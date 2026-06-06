import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentUser, getPreferences, updatePreferences, getMyProfile, downloadPortfolio, resetProfile, updateVisibility, checkUsername, updateUsername, getPremiumStatus, getCustomBranding, updateCustomBranding } from '../utils/api'
import { getAppUrl } from '../utils/appUrl'
import { useToast } from '../context/ToastContext'
import {
    AlertTriangle,
    Check,
    CircleCheck,
    Download,
    ExternalLink,
    Eye,
    Info,
    Lock,
    Palette,
    Pencil,
    ShieldCheck,
    Star,
    Tag,
    Trash2,
    User,
    X,
} from 'lucide-react'
import { IconTile, InlineIcon, ICON_STROKE } from '../components/IconTile'
import PageHeader from '../components/PageHeader'
import MobileTabBar from '../components/MobileTabBar'
import { ErrorState, LoadingState } from '../components/AsyncState'

const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'premium', label: 'Premium', icon: ShieldCheck },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'data', label: 'Data', icon: Trash2 },
]

const portfolioTypes = [
    { id: 'technical', name: 'Technical', desc: 'Developer, Engineer' },
    { id: 'non-technical', name: 'General', desc: 'Business, Creative' }
]

const experienceLevels = [
    { id: 'fresher', name: 'Fresher', desc: '0-2 years' },
    { id: 'experienced', name: 'Experienced', desc: '2+ years' }
]

const themes = [
    { id: 'modern', name: 'Modern', colors: ['#5a7a9e', '#7a96b5'] },
    { id: 'minimal', name: 'Minimal', colors: ['#18181b', '#71717a'] },
    { id: 'creative', name: 'Creative', colors: ['#ec4899', '#f472b6'] },
    { id: 'professional', name: 'Professional', colors: ['#0f766e', '#14b8a6'] }
]

function Settings() {
    const navigate = useNavigate()
    const { isLoaded, isSignedIn } = useUser()
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [saving, setSaving] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [resetting, setResetting] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [error, setError] = useState('')
    const [showResetModal, setShowResetModal] = useState(false)
    const [resetConfirmText, setResetConfirmText] = useState('')

    // Username update states
    const [newUsername, setNewUsername] = useState('')
    const [usernameAvailable, setUsernameAvailable] = useState(null)
    const [checkingUsername, setCheckingUsername] = useState(false)
    const [updatingUsername, setUpdatingUsername] = useState(false)
    const [usernameError, setUsernameError] = useState('')

    // Premium states
    const [isPremium, setIsPremium] = useState(false)
    const [customBranding, setCustomBranding] = useState({ enabled: false, text: '', url: '' })
    const [savingBranding, setSavingBranding] = useState(false)

    const [userData, setUserData] = useState(null)
    const [preferences, setPreferences] = useState({
        portfolioType: 'technical',
        experienceLevel: 'fresher',
        themePreference: 'modern'
    })
    const [isPublic, setIsPublic] = useState(true)
    const [originalIsPublic, setOriginalIsPublic] = useState(true)

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            navigate('/')
            return
        }

        const loadData = async () => {
            setLoadError('')
            try {
                const [userRes, prefsRes, profileRes, premiumRes, brandingRes] = await Promise.all([
                    getCurrentUser(),
                    getPreferences(),
                    getMyProfile(),
                    getPremiumStatus(),
                    getCustomBranding()
                ])
                setUserData(userRes.data)
                if (prefsRes.data.preferences) {
                    setPreferences(prefsRes.data.preferences)
                }
                const publicStatus = profileRes.data?.isPublic ?? true
                setIsPublic(publicStatus)
                setOriginalIsPublic(publicStatus)
                setIsPremium(premiumRes.data.isPremium)
                if (brandingRes.data.customBranding) {
                    setCustomBranding(brandingRes.data.customBranding)
                }
            } catch (err) {
                if (err.response?.data?.needsRegistration) {
                    navigate('/username')
                    return
                }
                setLoadError(err.response?.data?.error || 'Failed to load settings')
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [isLoaded, isSignedIn, navigate])

    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({ ...prev, [key]: value }))
    }

    const toast = useToast()

    const handleSave = async () => {
        setSaving(true)
        setError('')
        setSaveSuccess(false)

        const loadingId = toast.loading('Saving settings...')

        try {
            await updatePreferences(preferences)

            if (isPublic !== originalIsPublic) {
                await updateVisibility(isPublic)
                setOriginalIsPublic(isPublic)
            }

            toast.dismiss(loadingId)
            toast.saved('Settings saved successfully!')
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (err) {
            toast.dismiss(loadingId)

            const errorMessage = err.response?.data?.error || err.message || 'Failed to save settings'
            toast.error(errorMessage)
            setError(errorMessage)
        } finally {
            setSaving(false)
        }
    }

    const handleDownload = async () => {
        setDownloading(true)
        setError('')

        const loadingId = toast.processing('Preparing your portfolio download...')

        try {
            const response = await downloadPortfolio()
            const blob = new Blob([response.data], { type: 'application/zip' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${userData?.username || 'portfolio'}-portfolio.zip`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            a.remove()

            toast.dismiss(loadingId)
            toast.success('Portfolio downloaded!')
        } catch (err) {
            toast.dismiss(loadingId)
            toast.error('Failed to download portfolio')
            setError('Failed to download portfolio')
        } finally {
            setDownloading(false)
        }
    }

    const handleReset = async () => {
        if (resetConfirmText !== 'DELETE') return

        setResetting(true)
        setError('')

        const loadingId = toast.loading('Resetting your profile...')

        try {
            await resetProfile()
            setShowResetModal(false)
            setResetConfirmText('')
            // Reset local state
            setPreferences({
                portfolioType: 'technical',
                experienceLevel: 'fresher',
                themePreference: 'modern'
            })

            toast.dismiss(loadingId)
            toast.success('Profile reset successfully!')

            // Navigate to upload page to re-setup
            setTimeout(() => navigate('/upload'), 500)
        } catch (err) {
            toast.dismiss(loadingId)
            toast.error('Failed to reset profile')
            setError('Failed to reset profile')
        } finally {
            setResetting(false)
        }
    }

    // Username availability check
    const handleCheckUsername = async () => {
        if (!newUsername || newUsername.length < 3) {
            setUsernameError('Username must be at least 3 characters')
            return
        }

        if (newUsername.toLowerCase() === userData?.username) {
            setUsernameError('This is your current username')
            return
        }

        setCheckingUsername(true)
        setUsernameError('')
        setUsernameAvailable(null)

        try {
            const response = await checkUsername(newUsername)
            setUsernameAvailable(response.data.available)
            if (!response.data.available) {
                setUsernameError(response.data.error || 'Username is not available')
            }
        } catch (err) {
            setUsernameError(err.response?.data?.error || 'Failed to check availability')
            setUsernameAvailable(false)
        } finally {
            setCheckingUsername(false)
        }
    }

    // Username update handler
    const handleUpdateUsername = async () => {
        if (!usernameAvailable || !newUsername) return

        setUpdatingUsername(true)
        const loadingId = toast.loading('Updating username...')

        try {
            const response = await updateUsername(newUsername)

            // Update local state
            setUserData(prev => ({ ...prev, username: response.data.newUsername }))
            setNewUsername('')
            setUsernameAvailable(null)

            toast.dismiss(loadingId)
            toast.success(`Username updated to "${response.data.newUsername}"`)
        } catch (err) {
            toast.dismiss(loadingId)
            const errorMsg = err.response?.data?.error || 'Failed to update username'
            toast.error(errorMsg)
            setUsernameError(errorMsg)
        } finally {
            setUpdatingUsername(false)
        }
    }

    // Custom branding save handler
    const handleSaveBranding = async () => {
        setSavingBranding(true)
        const loadingId = toast.loading('Saving custom branding...')

        try {
            await updateCustomBranding(customBranding)
            toast.dismiss(loadingId)
            toast.success('Custom branding updated!')
        } catch (err) {
            toast.dismiss(loadingId)
            toast.error(err.response?.data?.error || 'Failed to save branding')
        } finally {
            setSavingBranding(false)
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
        <div className="max-w-4xl mx-auto pb-6">
            <PageHeader
                title="Settings"
                description="Manage your preferences and export options"
            />

                <div className="grid md:grid-cols-[240px,1fr] gap-6">
                    {/* Sidebar */}
                    {/* Sidebar Navigation - Desktop */}
                    <div className="hidden md:block glass-card rounded-2xl p-4 h-fit sticky sticky-below-navbar">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ x: 4 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                        ? tab.id === 'data' ? 'bg-red-500/20 text-red-400' : 'bg-primary-500/20 text-primary-400'
                                        : 'text-secondary hover:text-primary hover:bg-surface'
                                        }`}
                                >
                                    <InlineIcon icon={tab.icon} size={18} />
                                    <span className="font-medium">{tab.label}</span>
                                </motion.button>
                            ))}
                        </nav>
                    </div>

                    <MobileTabBar
                        tabs={tabs.map((tab) => ({
                            id: tab.id,
                            label: tab.label,
                            icon: <InlineIcon icon={tab.icon} size={16} />,
                        }))}
                        activeId={activeTab}
                        onChange={setActiveTab}
                        className="md:hidden mb-4"
                    />

                    {/* Content */}
                    <div className="glass-card rounded-2xl p-6">
                        <AnimatePresence mode="wait">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-xl font-bold text-primary mb-6">Profile Settings</h2>

                                    {/* Portfolio Type */}
                                    <div className="mb-8">
                                        <label className="block text-secondary font-medium mb-3">Portfolio Type</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {portfolioTypes.map((type) => (
                                                <motion.button
                                                    key={type.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handlePreferenceChange('portfolioType', type.id)}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${preferences.portfolioType === type.id
                                                        ? 'border-primary-500 bg-primary-500/10'
                                                        : 'border-border hover:border-primary-500/50'
                                                        }`}
                                                >
                                                    <p className="font-medium text-primary">{type.name}</p>
                                                    <p className="text-sm text-muted">{type.desc}</p>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Experience Level */}
                                    <div className="mb-8">
                                        <label className="block text-secondary font-medium mb-3">Experience Level</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {experienceLevels.map((level) => (
                                                <motion.button
                                                    key={level.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handlePreferenceChange('experienceLevel', level.id)}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${preferences.experienceLevel === level.id
                                                        ? 'border-primary-500 bg-primary-500/10'
                                                        : 'border-border hover:border-primary-500/50'
                                                        }`}
                                                >
                                                    <p className="font-medium text-primary">{level.name}</p>
                                                    <p className="text-sm text-muted">{level.desc}</p>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Appearance Tab */}
                            {activeTab === 'appearance' && (
                                <motion.div
                                    key="appearance"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-xl font-bold text-primary mb-6">Portfolio Theme</h2>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {themes.map((theme) => (
                                            <motion.button
                                                key={theme.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handlePreferenceChange('themePreference', theme.id)}
                                                className={`relative p-4 rounded-xl border-2 transition-all ${preferences.themePreference === theme.id
                                                    ? 'border-primary-500'
                                                    : 'border-border hover:border-primary-500/50'
                                                    }`}
                                            >
                                                <div
                                                    className="w-full h-12 rounded-lg mb-3"
                                                    style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}
                                                />
                                                <p className="text-center font-medium text-primary">{theme.name}</p>

                                                {preferences.themePreference === theme.id && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white"
                                                    >
                                                        <Check size={16} strokeWidth={ICON_STROKE} className="text-white" />
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Premium Tab */}
                            {activeTab === 'premium' && (
                                <motion.div
                                    key="premium"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-primary">Premium Features</h2>
                                        {isPremium && (
                                            <div className="px-3 py-1.5 rounded-full bg-tertiary text-secondary text-xs font-semibold flex items-center gap-1.5">
                                                <InlineIcon icon={Star} size={14} />
                                                Premium
                                            </div>
                                        )}
                                    </div>

                                    {/* Premium Required Banner */}
                                    {!isPremium && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative overflow-hidden rounded-2xl"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10" />
                                            <div className="absolute inset-0 backdrop-blur-xl" />
                                            <div className="absolute inset-0 border border-amber-500/20 rounded-2xl" />

                                            <div className="relative p-6">
                                                <div className="flex items-start gap-4">
                                                    <IconTile icon={Star} size={28} className="w-14 h-14 rounded-2xl" />
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-primary mb-2">Premium Features</h3>
                                                        <p className="text-secondary text-sm mb-4">
                                                            Unlock username changes, custom branding, and more with a one-time payment of just ₹11.
                                                        </p>
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => navigate('/premium')}
                                                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow"
                                                        >
                                                            Upgrade to Premium
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Username Update Card */}
                                    <motion.div
                                        className={`relative overflow-hidden rounded-2xl ${!isPremium ? 'opacity-50 pointer-events-none' : ''}`}
                                        initial={{ rotateX: 5 }}
                                        whileHover={isPremium ? { rotateX: 0, scale: 1.01 } : {}}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                                    >
                                        {/* Premium lock overlay */}
                                        {!isPremium && (
                                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-2xl">
                                                <div className="px-4 py-2 rounded-full bg-surface/90 border border-border text-muted text-sm flex items-center gap-2">
                                                    <InlineIcon icon={Lock} size={16} />
                                                    Premium Required
                                                </div>
                                            </div>
                                        )}

                                        {/* Animated gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-accent-600/5 to-cyan-600/10 animate-gradient-slow" />
                                        <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.02]" />

                                        {/* Glass border effect */}
                                        <div className="absolute inset-0 rounded-2xl border border-white/10" />
                                        <div className="absolute inset-[1px] rounded-2xl border border-border" />

                                        {/* Content */}
                                        <div className="relative p-6">
                                            <div className="flex items-start gap-5">
                                                {/* 3D Shield Icon */}
                                                <IconTile icon={ShieldCheck} size={28} className="w-14 h-14 rounded-2xl" />

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-primary text-lg mb-1">Update Username</h3>
                                                    <p className="text-secondary text-sm">
                                                        Change your portfolio URL across all services
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Current Username Display */}
                                            <motion.div
                                                className="mt-6 relative overflow-hidden rounded-xl"
                                                whileHover={{ scale: 1.01 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5" />
                                                <div className="relative p-4 backdrop-blur-sm border border-white/10 rounded-xl">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] text-muted uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                                Current Username
                                                            </p>
                                                            <motion.p
                                                                className="text-primary font-mono font-semibold text-xl tracking-tight"
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                            >
                                                                @{userData?.username || '...'}
                                                            </motion.p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Portfolio URL</p>
                                                            <p className="text-xs text-primary-400 font-mono bg-primary-500/10 px-2 py-1 rounded-lg">
                                                                /{userData?.username}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>

                                            {/* Divider */}
                                            <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                            {/* New Username Input */}
                                            <div className="space-y-4">
                                                <label className="block text-secondary text-sm font-medium">Choose New Username</label>

                                                <div className="flex gap-3">
                                                    {/* Input Container */}
                                                    <motion.div
                                                        className="relative flex-1 group"
                                                        whileFocus={{ scale: 1.01 }}
                                                    >
                                                        {/* Input glow effect on focus */}
                                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/50 to-accent-500/50 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />

                                                        <div className="relative flex items-center bg-surface/80 backdrop-blur-sm rounded-xl border border-white/10 group-focus-within:border-primary-500/50 transition-colors overflow-hidden">
                                                            {/* @ prefix badge */}
                                                            <div className="pl-4 pr-2 py-3 text-primary-400 font-mono text-lg font-semibold select-none">
                                                                @
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={newUsername}
                                                                onChange={(e) => {
                                                                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                                                                    setNewUsername(val.slice(0, 8))
                                                                    setUsernameAvailable(null)
                                                                    setUsernameError('')
                                                                }}
                                                                placeholder="username"
                                                                className="flex-1 bg-transparent py-3 pr-4 text-primary font-mono text-lg placeholder:text-muted/50 focus:outline-none"
                                                                maxLength={8}
                                                            />
                                                            {/* Character count */}
                                                            <div className="pr-4 text-xs text-muted font-mono">
                                                                {newUsername.length}/8
                                                            </div>
                                                        </div>
                                                    </motion.div>

                                                    {/* Check Button */}
                                                    <motion.button
                                                        whileHover={{ scale: 1.05, rotateZ: -1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={handleCheckUsername}
                                                        disabled={checkingUsername || !newUsername || newUsername.length < 3}
                                                        className="relative px-5 py-3 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
                                                    >
                                                        {/* Button background */}
                                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-colors" />
                                                        <div className="absolute inset-0 border border-primary-500/30 rounded-xl" />

                                                        <span className="relative text-primary-400">
                                                            {checkingUsername ? (
                                                                <motion.div
                                                                    className="w-5 h-5 border-2 border-primary-400/30 border-t-primary-400 rounded-full"
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                />
                                                            ) : (
                                                                'Check'
                                                            )}
                                                        </span>
                                                    </motion.button>
                                                </div>

                                                {/* Requirements hint */}
                                                <p className="text-xs text-muted flex items-center gap-2">
                                                    <InlineIcon icon={Info} size={14} />
                                                    3-8 characters: lowercase letters, numbers, underscore
                                                </p>

                                                {/* Availability Status */}
                                                <AnimatePresence mode="wait">
                                                    {usernameAvailable === true && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                            className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                                                        >
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                                                                className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"
                                                            >
                                                                <InlineIcon icon={Check} size={16} className="text-green-400" />
                                                            </motion.div>
                                                            <div>
                                                                <p className="text-green-400 font-medium text-sm">@{newUsername} is available!</p>
                                                                <p className="text-green-400/60 text-xs">You can claim this username</p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                    {usernameError && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                            className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                                <InlineIcon icon={X} size={16} className="text-red-400" />
                                                            </div>
                                                            <p className="text-red-400 text-sm">{usernameError}</p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Update Button */}
                                                <AnimatePresence>
                                                    {usernameAvailable && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                        >
                                                            <motion.button
                                                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -15px rgba(90, 122, 158, 0.4)" }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={handleUpdateUsername}
                                                                disabled={updatingUsername}
                                                                className="relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50"
                                                            >
                                                                {/* Animated gradient background */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-[length:200%_100%] animate-gradient-x" />

                                                                {/* Shine effect */}
                                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                                                </div>

                                                                <span className="relative flex items-center justify-center gap-2">
                                                                    {updatingUsername ? (
                                                                        <>
                                                                            <motion.div
                                                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                                                animate={{ rotate: 360 }}
                                                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                            />
                                                                            Updating username...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <InlineIcon icon={CircleCheck} size={20} className="text-white" />
                                                                            Confirm Change to @{newUsername}
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </motion.button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Info Box */}
                                    <motion.div
                                        className="relative overflow-hidden rounded-xl"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5" />
                                        <div className="relative p-4 border border-amber-500/20 rounded-xl backdrop-blur-sm">
                                            <div className="flex items-start gap-3">
                                                <IconTile icon={AlertTriangle} size={16} className="w-8 h-8 rounded-lg" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-amber-400 mb-1">Important Note</p>
                                                    <p className="text-secondary leading-relaxed">Changing your username will update your portfolio URL. Old links will no longer work after the change.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Custom Branding Card */}
                                    <motion.div
                                        className={`relative overflow-hidden rounded-2xl ${!isPremium ? 'opacity-50 pointer-events-none' : ''}`}
                                        initial={{ rotateX: 5 }}
                                        whileHover={isPremium ? { rotateX: 0, scale: 1.01 } : {}}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                                    >
                                        {/* Premium lock overlay */}
                                        {!isPremium && (
                                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-2xl">
                                                <div className="px-4 py-2 rounded-full bg-surface/90 border border-border text-muted text-sm flex items-center gap-2">
                                                    <InlineIcon icon={Lock} size={16} />
                                                    Premium Required
                                                </div>
                                            </div>
                                        )}

                                        {/* Animated gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-accent-600/5 to-primary-600/10 animate-gradient-slow" />
                                        <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.02]" />

                                        {/* Glass border effect */}
                                        <div className="absolute inset-0 rounded-2xl border border-white/10" />
                                        <div className="absolute inset-[1px] rounded-2xl border border-border" />

                                        {/* Content */}
                                        <div className="relative p-6">
                                            <div className="flex items-start gap-5 mb-6">
                                                {/* 3D Tag Icon */}
                                                <IconTile icon={Tag} size={28} className="w-14 h-14 rounded-2xl" />

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-primary text-lg mb-1">Custom Branding</h3>
                                                    <p className="text-secondary text-sm">
                                                        Replace the footer with your own text and link
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Enable Toggle */}
                                            <div className="p-4 rounded-xl bg-surface/50 border border-white/10 mb-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-primary">Enable Custom Branding</p>
                                                        <p className="text-xs text-muted mt-1">Show your custom text instead of "Built with PortlifyAi"</p>
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            const newEnabled = !customBranding.enabled
                                                            setCustomBranding(prev => ({ ...prev, enabled: newEnabled }))

                                                            // If turning OFF, auto-save to revert to default footer
                                                            if (!newEnabled) {
                                                                const loadingId = toast.loading('Reverting to default footer...')
                                                                try {
                                                                    await updateCustomBranding({ enabled: false, text: '', url: '' })
                                                                    toast.dismiss(loadingId)
                                                                    toast.success('Custom branding disabled')
                                                                } catch (err) {
                                                                    toast.dismiss(loadingId)
                                                                    toast.error('Failed to save')
                                                                }
                                                            }
                                                        }}
                                                        className={`relative w-14 h-8 rounded-full transition-all ${customBranding.enabled ? 'bg-pink-500' : 'bg-gray-600'}`}
                                                    >
                                                        <motion.div
                                                            animate={{ x: customBranding.enabled ? 24 : 4 }}
                                                            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                                                        />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Branding Fields */}
                                            <AnimatePresence>
                                                {customBranding.enabled && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-4"
                                                    >
                                                        {/* Text Input */}
                                                        <div>
                                                            <label className="block text-secondary text-sm font-medium mb-2">Display Text</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    value={customBranding.text}
                                                                    onChange={(e) => setCustomBranding(prev => ({ ...prev, text: e.target.value }))}
                                                                    placeholder="Made by John Doe"
                                                                    className="w-full px-4 py-3 pr-16 rounded-xl bg-surface border border-white/10 text-primary font-medium placeholder:text-muted/40 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                                                    maxLength={50}
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
                                                                    {customBranding.text.length}/50
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* URL Input */}
                                                        <div>
                                                            <label className="block text-secondary text-sm font-medium mb-2">Link URL (optional)</label>
                                                            <input
                                                                type="url"
                                                                value={customBranding.url}
                                                                onChange={(e) => setCustomBranding(prev => ({ ...prev, url: e.target.value }))}
                                                                placeholder="https://yourwebsite.com"
                                                                className="w-full px-4 py-3 rounded-xl bg-surface border border-white/10 text-primary font-medium placeholder:text-muted/40 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
                                                            />
                                                        </div>

                                                        {/* Preview */}
                                                        <div className="p-4 rounded-xl bg-black/20 border border-border">
                                                            <p className="text-xs text-muted uppercase tracking-wider mb-2">Preview</p>
                                                            <div className="flex items-center justify-center gap-2 text-sm">
                                                                <span className="text-secondary">{customBranding.text || 'Made by Your Name'}</span>
                                                                {customBranding.url && (
                                                                    <InlineIcon icon={ExternalLink} size={16} />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Save Button */}
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={handleSaveBranding}
                                                            disabled={savingBranding}
                                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-accent-500 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-shadow disabled:opacity-50"
                                                        >
                                                            {savingBranding ? (
                                                                <span className="flex items-center justify-center gap-2">
                                                                    <motion.div
                                                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                                                        animate={{ rotate: 360 }}
                                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                    />
                                                                    Saving...
                                                                </span>
                                                            ) : (
                                                                'Save Branding'
                                                            )}
                                                        </motion.button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Export Tab */}
                            {activeTab === 'export' && (
                                <motion.div
                                    key="export"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-xl font-bold text-primary mb-6">Export Portfolio</h2>

                                    <div className="p-6 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-primary-500/20 text-primary-400">
                                                <Download size={20} strokeWidth={ICON_STROKE} className="text-secondary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-primary mb-2">Download as Static Site</h3>
                                                <p className="text-secondary text-sm mb-4">
                                                    Get your portfolio as a ZIP file containing HTML, CSS, and JavaScript.
                                                    Host it anywhere - GitHub Pages, Netlify, Vercel, or your own server.
                                                </p>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleDownload}
                                                    disabled={downloading}
                                                    className="btn-primary disabled:opacity-50"
                                                >
                                                    {downloading ? (
                                                        <span className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Preparing...
                                                        </span>
                                                    ) : (
                                                        <>Download ZIP</>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-surface border border-border">
                                        <h4 className="font-medium text-primary mb-2">What's included:</h4>
                                        <ul className="text-sm text-secondary space-y-1">
                                            <li>• index.html - Your portfolio page</li>
                                            <li>• styles.css - All styling with your theme</li>
                                            <li>• script.js - Animations and interactions</li>
                                            <li>• README.md - Deployment instructions</li>
                                        </ul>
                                    </div>
                                </motion.div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <motion.div
                                    key="privacy"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-xl font-bold text-primary mb-6">Privacy Settings</h2>

                                    <div className="p-4 rounded-xl border border-border">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-primary">Public Portfolio</p>
                                                <p className="text-sm text-muted">Make your portfolio visible to everyone</p>
                                            </div>
                                            <button
                                                onClick={() => setIsPublic(!isPublic)}
                                                className={`relative w-14 h-8 rounded-full transition-all ${isPublic ? 'bg-primary-500' : 'bg-gray-600'
                                                    }`}
                                            >
                                                <motion.div
                                                    animate={{ x: isPublic ? 24 : 4 }}
                                                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-muted">
                                        {isPublic
                                            ? `✓ Your portfolio is publicly accessible at ${getAppUrl().replace(/^https?:\/\//, '')}/` + (userData?.username || 'username')
                                            : '✗ Your portfolio is hidden from public view'
                                        }
                                    </p>
                                </motion.div>
                            )}

                            {/* Data Tab */}
                            {activeTab === 'data' && (
                                <motion.div
                                    key="data"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-xl font-bold text-primary mb-6">Data Management</h2>

                                    <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
                                                <Trash2 size={20} strokeWidth={ICON_STROKE} className="text-secondary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-primary mb-2">Reset All Data</h3>
                                                <p className="text-secondary text-sm mb-4">
                                                    This will permanently delete all your profile data including your resume, skills,
                                                    experience, projects, and all other information. Your username and account will
                                                    be preserved.
                                                </p>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setShowResetModal(true)}
                                                    className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                                                >
                                                    Reset Profile Data
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 rounded-xl bg-surface border border-border">
                                        <h4 className="font-medium text-primary mb-2">What gets deleted:</h4>
                                        <ul className="text-sm text-secondary space-y-1">
                                            <li>• All profile information (name, bio, etc.)</li>
                                            <li>• Skills, experience, and education</li>
                                            <li>• Projects and achievements</li>
                                            <li>• Uploaded resume and photos</li>
                                            <li>• Analytics data (views reset to 0)</li>
                                        </ul>
                                        <p className="mt-3 text-sm text-muted">
                                            <strong>Note:</strong> Your username and account will remain intact.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Save Button - show for profile, appearance, privacy tabs */}
                        {(activeTab === 'profile' || activeTab === 'appearance' || activeTab === 'privacy') && (
                            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                                <div>
                                    {error && <p className="text-red-400 text-sm">{error}</p>}
                                    {saveSuccess && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-green-400 text-sm flex items-center gap-2"
                                        >
                                            <Check size={16} strokeWidth={ICON_STROKE} className="text-secondary" /> Settings saved!
                                        </motion.p>
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {saving ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </span>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>

            {/* Reset Confirmation Modal */}
            <AnimatePresence>
                {showResetModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowResetModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md glass-card rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                                        <AlertTriangle size={22} strokeWidth={ICON_STROKE} className="text-secondary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-primary">Confirm Reset</h3>
                                </div>
                                <button
                                    onClick={() => setShowResetModal(false)}
                                    className="p-2 rounded-lg hover:bg-surface text-muted hover:text-primary transition-colors"
                                >
                                    <X size={18} strokeWidth={ICON_STROKE} />
                                </button>
                            </div>

                            <p className="text-secondary mb-4">
                                This action cannot be undone. All your profile data will be permanently deleted.
                            </p>

                            <div className="mb-4">
                                <label className="block text-sm text-muted mb-2">
                                    Type <strong className="text-red-400">DELETE</strong> to confirm:
                                </label>
                                <input
                                    type="text"
                                    value={resetConfirmText}
                                    onChange={(e) => setResetConfirmText(e.target.value.toUpperCase())}
                                    placeholder="DELETE"
                                    className="input-field"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowResetModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-border text-primary font-medium hover:bg-border/50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: resetConfirmText === 'DELETE' ? 1.02 : 1 }}
                                    whileTap={{ scale: resetConfirmText === 'DELETE' ? 0.98 : 1 }}
                                    onClick={handleReset}
                                    disabled={resetConfirmText !== 'DELETE' || resetting}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {resetting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Resetting...
                                        </span>
                                    ) : (
                                        'Reset Data'
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Settings
