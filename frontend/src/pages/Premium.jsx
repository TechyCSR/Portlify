import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getPremiumStatus, createPaymentOrder, verifyPayment, getCurrentUser } from '../utils/api'
import { useToast } from '../context/ToastContext'
import { Check, Heart, Lock, Pencil, ShieldCheck, Sparkles, Star, Tag, Zap } from 'lucide-react'
import { IconTile, InlineIcon, ICON_STROKE } from '../components/IconTile'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/AsyncState'

const premiumFeatures = [
    { icon: Pencil, title: 'Change Username', description: 'Update your portfolio URL anytime' },
    { icon: Tag, title: 'Custom Branding', description: 'Replace footer with your own text & link' },
    { icon: Sparkles, title: 'Premium Badge', description: 'Show your supporter status proudly' },
    { icon: Zap, title: 'Priority Support', description: 'Get faster responses to your queries' },
    { icon: Heart, title: 'Support the Project', description: 'Help us build more amazing features' },
]

function Premium() {
    const navigate = useNavigate()
    const { isLoaded, isSignedIn } = useUser()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
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
            setLoadError('')
            try {
                const [statusRes, userRes] = await Promise.all([
                    getPremiumStatus(),
                    getCurrentUser()
                ])
                setIsPremium(statusRes.data.isPremium)
                setUserData(userRes.data)
            } catch (err) {
                if (err.response?.data?.needsRegistration) {
                    navigate('/username')
                    return
                }
                setLoadError(err.response?.data?.error || 'Failed to load premium status')
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
                    color: '#5a7a9e'
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
        return <LoadingState />
    }

    if (loadError) {
        return (
            <ErrorState
                message={loadError}
                onRetry={() => { setLoading(true); window.location.reload() }}
            />
        )
    }

    return (
        <div className="max-w-5xl mx-auto pb-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <PageHeader
                    title="Go Premium"
                    description="Unlock all features with a one-time payment"
                />
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
                                className="group relative p-5 rounded-2xl bg-surface hover:bg-surface-hover transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <IconTile icon={feature.icon} className="w-11 h-11" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-primary mb-1 flex items-center gap-2">
                                            {feature.title}
                                            {isPremium && (
                                                <Check size={14} strokeWidth={ICON_STROKE} className="text-success" />
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
                        <div className="sticky sticky-below-navbar">
                            {/* Pricing Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-surface border border-border">
                                {/* Premium gradient top bar */}
                                <div className="h-1.5 bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500" />
                                
                                <div className="p-6">
                                    {/* Status Badge for Premium users */}
                                    {isPremium && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="mb-6"
                                        >
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary text-secondary">
                                                <InlineIcon icon={Star} size={16} />
                                                <span className="text-sm font-semibold">Premium Member</span>
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
                                                <InlineIcon icon={Check} size={16} />
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
                                            className="w-full py-4 rounded-xl font-semibold text-white text-lg bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                    <Lock size={20} strokeWidth={ICON_STROKE} />
                                                    Pay ₹11 & Unlock
                                                </span>
                                            )}
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => navigate('/settings')}
                                            className="w-full py-4 rounded-xl font-semibold text-primary bg-surface border border-border hover:border-primary-500/30 transition-all"
                                        >
                                            Go to Settings
                                        </motion.button>
                                    )}

                                    {/* Secured Badge */}
                                    <p className="text-center text-xs text-muted mt-4 flex items-center justify-center gap-2">
                                        <InlineIcon icon={ShieldCheck} size={16} />
                                        Secured by Razorpay
                                    </p>
                                </div>
                            </div>

                            {/* Shagun Note */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-4 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10"
                            >
                                <p className="text-center text-sm text-secondary">
                                    <span className="text-primary-400 font-medium">"Shagun"</span> — A token of appreciation 💜
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
        </div>
    )
}

export default Premium
