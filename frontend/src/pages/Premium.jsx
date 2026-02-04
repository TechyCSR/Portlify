import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPremiumStatus, createPaymentOrder, verifyPayment, getCurrentUser } from '../utils/api'
import { useToast } from '../context/ToastContext'

// Premium Features
const premiumFeatures = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        ),
        title: 'Change Username',
        description: 'Update your portfolio URL anytime'
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
        ),
        title: 'Custom Branding',
        description: 'Replace footer with your own text & link'
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        ),
        title: 'Premium Badge',
        description: 'Show your supporter status proudly'
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: 'Priority Support',
        description: 'Get faster responses to your queries'
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        title: 'Support the Project',
        description: 'Help us build more amazing features'
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
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05, x: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard')}
                        className="p-3 rounded-xl glass-card text-secondary hover:text-primary transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-primary">Premium Membership</h1>
                        <p className="text-secondary">Unlock exclusive features</p>
                    </div>
                </div>

                {/* Premium Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl"
                >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
                    <div className="absolute inset-0 backdrop-blur-xl" />
                    
                    {/* Decorative orbs */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

                    {/* Glass border */}
                    <div className="absolute inset-0 rounded-3xl border border-white/10" />

                    <div className="relative p-8 md:p-12">
                        {/* Status Badge */}
                        {isPremium && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-6 right-6"
                            >
                                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/25">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                    </svg>
                                    Premium Member
                                </div>
                            </motion.div>
                        )}

                        {/* Main Content */}
                        <div className="text-center mb-10">
                            {/* 3D Icon */}
                            <motion.div
                                className="inline-block mb-6"
                                animate={{ rotateY: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                            </motion.div>

                            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-3">
                                {isPremium ? 'You\'re Premium!' : 'Go Premium'}
                            </h2>
                            <p className="text-secondary text-lg max-w-md mx-auto">
                                {isPremium 
                                    ? 'Enjoy all the exclusive features and thank you for supporting Portlify!'
                                    : 'Unlock all features with a one-time payment. No subscriptions, no hidden fees.'
                                }
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                            {premiumFeatures.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="relative p-5 rounded-2xl overflow-hidden group"
                                >
                                    {/* Card background */}
                                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                                    <div className="absolute inset-0 border border-white/10 rounded-2xl" />
                                    
                                    {/* Hover glow */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />

                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 mb-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-primary font-semibold mb-1">{feature.title}</h3>
                                        <p className="text-secondary text-sm">{feature.description}</p>

                                        {isPremium && (
                                            <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pricing & CTA */}
                        {!isPremium && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-center"
                            >
                                {/* Price Card */}
                                <div className="inline-block mb-6">
                                    <div className="relative px-8 py-6 rounded-2xl overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm" />
                                        <div className="absolute inset-0 border border-white/10 rounded-2xl" />
                                        
                                        <div className="relative">
                                            <p className="text-muted text-sm uppercase tracking-wider mb-2">One-time payment</p>
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-2xl text-secondary">₹</span>
                                                <span className="text-5xl font-display font-bold text-primary">11</span>
                                            </div>
                                            <p className="text-secondary text-sm mt-2">
                                                "Shagun" - A token of appreciation
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pay Button */}
                                <div>
                                    <motion.button
                                        whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.4)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handlePayment}
                                        disabled={processing}
                                        className="relative px-12 py-4 rounded-2xl font-semibold text-white text-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {/* Animated gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:200%_100%] animate-gradient-x" />
                                        
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        </div>

                                        <span className="relative flex items-center gap-3">
                                            {processing ? (
                                                <>
                                                    <motion.div 
                                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    Pay ₹11 & Unlock Premium
                                                </>
                                            )}
                                        </span>
                                    </motion.button>

                                    <p className="text-muted text-sm mt-4 flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Secured by Razorpay
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Already Premium - Go to Settings */}
                        {isPremium && (
                            <div className="text-center">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/settings')}
                                    className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-primary font-medium hover:bg-white/20 transition-colors"
                                >
                                    Go to Settings to Use Premium Features
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Premium
