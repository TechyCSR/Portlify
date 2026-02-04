import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getPremiumStatus, createPaymentOrder, verifyPayment, getCurrentUser } from '../utils/api'
import { useToast } from '../context/ToastContext'

// Premium Features
const premiumFeatures = [
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        ),
        title: 'Change Username',
        description: 'Update your portfolio URL anytime',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
        ),
        title: 'Custom Branding',
        description: 'Replace footer with your own text & link',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        ),
        title: 'Premium Badge',
        description: 'Show your supporter status proudly',
        color: 'from-amber-500 to-orange-500'
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: 'Priority Support',
        description: 'Get faster responses to your queries',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        title: 'Support the Project',
        description: 'Help us build more amazing features',
        color: 'from-rose-500 to-red-500'
    }
]

function Premium() {
    const navigate = useNavigate()
    const { isLoaded, isSignedIn } = useUser()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [isPremium, setIsPremium] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            navigate('/')
            return
        }

        const loadData = async () => {
            try {
                const [statusRes, userRes] = await Promise.all([
                    getPremiumStatus(),
                    getCurrentUser()
                ])
                setIsPremium(statusRes.data.isPremium)
                setUserData(userRes.data)
            } catch (err) {
                console.error('Failed to load premium status:', err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [isLoaded, isSignedIn, navigate])

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true)
                return
            }
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handlePayment = async () => {
        setProcessing(true)
        const loadingId = toast.loading('Preparing payment...')

        try {
            // Load Razorpay script
            const loaded = await loadRazorpayScript()
            if (!loaded) {
                toast.dismiss(loadingId)
                toast.error('Failed to load payment gateway')
                setProcessing(false)
                return
            }

            // Create order
            const orderRes = await createPaymentOrder()
            const { orderId, amount, currency, keyId } = orderRes.data

            toast.dismiss(loadingId)

            // Open Razorpay checkout
            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: 'Portlify',
                description: 'Premium Membership - Lifetime Access',
                order_id: orderId,
                handler: async (response) => {
                    // Verify payment
                    const verifyId = toast.loading('Verifying payment...')
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                        toast.dismiss(verifyId)
                        toast.success('Welcome to Premium! Enjoy your benefits.')
                        setIsPremium(true)
                    } catch (err) {
                        toast.dismiss(verifyId)
                        toast.error('Payment verification failed. Please contact support.')
                    }
                    setProcessing(false)
                },
                prefill: {
                    name: userData?.username || '',
                    email: userData?.email || ''
                },
                theme: {
                    color: '#6366f1'
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(false)
                    }
                }
            }

            const paymentObject = new window.Razorpay(options)
            paymentObject.open()
        } catch (err) {
            toast.dismiss(loadingId)
            toast.error(err.response?.data?.error || 'Failed to initiate payment')
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="spinner w-8 h-8" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-10"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard')}
                        className="p-3 rounded-xl bg-surface border border-border text-secondary hover:text-primary hover:border-indigo-500/30 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </motion.button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-primary">Go Premium</h1>
                        <p className="text-secondary">Unlock all features with a one-time payment</p>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Features Section - Left Side */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3 space-y-4"
                    >
                        <h2 className="text-lg font-semibold text-primary mb-6">What you get</h2>
                        
                        {premiumFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.08 }}
                                whileHover={{ x: 4 }}
                                className="group relative p-5 rounded-2xl bg-surface border border-border hover:border-indigo-500/30 transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                                        {feature.icon}
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-primary mb-1 flex items-center gap-2">
                                            {feature.title}
                                            {isPremium && (
                                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </h3>
                                        <p className="text-secondary text-sm">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Pricing Card - Right Side */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="sticky top-28">
                            {/* Pricing Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-surface border border-border">
                                {/* Premium gradient top bar */}
                                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                                
                                <div className="p-6">
                                    {/* Status Badge for Premium users */}
                                    {isPremium && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="mb-6"
                                        >
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                                                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-sm font-semibold text-amber-400">Premium Member</span>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {/* Price Display */}
                                    <div className="text-center mb-6">
                                        <div className="inline-block">
                                            <p className="text-xs text-muted uppercase tracking-wider mb-2">One-time payment</p>
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-2xl font-medium text-secondary">₹</span>
                                                <span className="text-6xl font-display font-bold text-primary">11</span>
                                            </div>
                                            <p className="text-sm text-secondary mt-2">Lifetime access</p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-border mb-6" />

                                    {/* Quick Features List */}
                                    <ul className="space-y-3 mb-6">
                                        {['All premium features', 'No recurring fees', 'Instant activation', 'Forever yours'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-secondary">
                                                <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    {!isPremium ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handlePayment}
                                            disabled={processing}
                                            className="w-full py-4 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center gap-3">
                                                    <motion.div 
                                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    Processing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    Pay ₹11 & Unlock
                                                </span>
                                            )}
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => navigate('/settings')}
                                            className="w-full py-4 rounded-xl font-semibold text-primary bg-surface border border-border hover:border-indigo-500/30 transition-all"
                                        >
                                            Go to Settings
                                        </motion.button>
                                    )}

                                    {/* Secured Badge */}
                                    <p className="text-center text-xs text-muted mt-4 flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Secured by Razorpay
                                    </p>
                                </div>
                            </div>

                            {/* Shagun Note */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10"
                            >
                                <p className="text-center text-sm text-secondary">
                                    <span className="text-indigo-400 font-medium">"Shagun"</span> — A token of appreciation 💜
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Premium
