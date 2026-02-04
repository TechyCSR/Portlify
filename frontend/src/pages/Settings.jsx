import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentUser, getPreferences, updatePreferences, getMyProfile, downloadPortfolio, resetProfile, updateVisibility, checkUsername, updateUsername, getPremiumStatus, getCustomBranding, updateCustomBranding } from '../utils/api'
import { useToast } from '../context/ToastContext'

// Icons
const icons = {
    user: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    palette: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
    ),
    download: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    ),
    eye: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    trash: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    back: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
    check: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    warning: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    close: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    shield: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    edit: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    )
}

const tabs = [
    { id: 'profile', label: 'Profile', icon: icons.user },
    { id: 'appearance', label: 'Appearance', icon: icons.palette },
    { id: 'security', label: 'Premium', icon: icons.shield },
    { id: 'export', label: 'Export', icon: icons.download },
    { id: 'privacy', label: 'Privacy', icon: icons.eye },
    { id: 'data', label: 'Data', icon: icons.trash }
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
    { id: 'modern', name: 'Modern', colors: ['#6366f1', '#a855f7'] },
    { id: 'minimal', name: 'Minimal', colors: ['#18181b', '#71717a'] },
    { id: 'creative', name: 'Creative', colors: ['#ec4899', '#f472b6'] },
    { id: 'professional', name: 'Professional', colors: ['#0f766e', '#14b8a6'] }
]

function Settings() {
    const navigate = useNavigate()
    const { isLoaded, isSignedIn } = useUser()
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(true)
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
                }
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
            // Save preferences
            console.log('Saving preferences:', preferences)
            const prefResponse = await updatePreferences(preferences)
            console.log('Preferences saved:', prefResponse.data)

            // Save visibility if changed
            if (isPublic !== originalIsPublic) {
                console.log('Updating visibility to:', isPublic)
                const visResponse = await updateVisibility(isPublic)
                console.log('Visibility updated:', visResponse.data)
                setOriginalIsPublic(isPublic)
            }

            toast.dismiss(loadingId)
            toast.saved('Settings saved successfully!')
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (err) {
            console.error('Save error:', err)
            console.error('Error response:', err.response?.data)
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
                        {icons.back}
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-primary">Settings</h1>
                        <p className="text-secondary">Manage your preferences and export options</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-[240px,1fr] gap-6">
                    {/* Sidebar */}
                    <div className="glass-card rounded-2xl p-4">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ x: 4 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                        ? tab.id === 'data' ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'
                                        : 'text-secondary hover:text-primary hover:bg-surface'
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="font-medium">{tab.label}</span>
                                </motion.button>
                            ))}
                        </nav>
                    </div>

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
                                                        ? 'border-indigo-500 bg-indigo-500/10'
                                                        : 'border-border hover:border-indigo-500/50'
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
                                                        ? 'border-indigo-500 bg-indigo-500/10'
                                                        : 'border-border hover:border-indigo-500/50'
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
                                                    ? 'border-indigo-500'
                                                    : 'border-border hover:border-indigo-500/50'
                                                    }`}
                                            >
                                                <div
                                                    className="w-full h-12 rounded-lg mb-3"
                                                    style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}
                                                />
                                                <p className="text-center font-medium text-primary">{theme.name}</p>

                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white"
                                                >
                                                    {icons.check}
                                                </motion.div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-primary">Security Settings</h2>
                                        {isPremium && (
                                            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
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
                                                    <motion.div
                                                        animate={{ rotateY: [0, 360] }}
                                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25"
                                                    >
                                                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </motion.div>
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
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    Premium Required
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Animated gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-cyan-600/10 animate-gradient-slow" />
                                        <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.02]" />
                                        
                                        {/* Glass border effect */}
                                        <div className="absolute inset-0 rounded-2xl border border-white/10" />
                                        <div className="absolute inset-[1px] rounded-2xl border border-white/5" />
                                        
                                        {/* Content */}
                                        <div className="relative p-6">
                                            <div className="flex items-start gap-5">
                                                {/* 3D Shield Icon */}
                                                <motion.div 
                                                    className="relative"
                                                    whileHover={{ rotateY: 180 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                    style={{ transformStyle: "preserve-3d" }}
                                                >
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg shadow-indigo-500/20">
                                                        <motion.div
                                                            animate={{ 
                                                                rotateZ: [0, 5, -5, 0],
                                                            }}
                                                            transition={{ 
                                                                duration: 4,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                        >
                                                            <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                            </svg>
                                                        </motion.div>
                                                    </div>
                                                    {/* Glow effect */}
                                                    <div className="absolute -inset-2 bg-indigo-500/20 rounded-3xl blur-xl opacity-50" />
                                                </motion.div>

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
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
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
                                                            <p className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-1 rounded-lg">
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
                                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
                                                        
                                                        <div className="relative flex items-center bg-surface/80 backdrop-blur-sm rounded-xl border border-white/10 group-focus-within:border-indigo-500/50 transition-colors overflow-hidden">
                                                            {/* @ prefix badge */}
                                                            <div className="pl-4 pr-2 py-3 text-indigo-400 font-mono text-lg font-semibold select-none">
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
                                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-colors" />
                                                        <div className="absolute inset-0 border border-indigo-500/30 rounded-xl" />
                                                        
                                                        <span className="relative text-indigo-400">
                                                            {checkingUsername ? (
                                                                <motion.div 
                                                                    className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full"
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
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
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
                                                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                                </svg>
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
                                                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
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
                                                                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.4)" }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={handleUpdateUsername}
                                                                disabled={updatingUsername}
                                                                className="relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50"
                                                            >
                                                                {/* Animated gradient background */}
                                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] animate-gradient-x" />
                                                                
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
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
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
                                                <motion.div
                                                    animate={{ rotateZ: [0, 10, -10, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                                    className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0"
                                                >
                                                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </motion.div>
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
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    Premium Required
                                                </div>
                                            </div>
                                        )}

                                        {/* Animated gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-purple-600/5 to-indigo-600/10 animate-gradient-slow" />
                                        <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.02]" />
                                        
                                        {/* Glass border effect */}
                                        <div className="absolute inset-0 rounded-2xl border border-white/10" />
                                        <div className="absolute inset-[1px] rounded-2xl border border-white/5" />
                                        
                                        {/* Content */}
                                        <div className="relative p-6">
                                            <div className="flex items-start gap-5 mb-6">
                                                {/* 3D Tag Icon */}
                                                <motion.div 
                                                    className="relative"
                                                    whileHover={{ rotateY: 180 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                    style={{ transformStyle: "preserve-3d" }}
                                                >
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg shadow-pink-500/20">
                                                        <motion.div
                                                            animate={{ rotateZ: [0, 5, -5, 0] }}
                                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                        >
                                                            <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                            </svg>
                                                        </motion.div>
                                                    </div>
                                                    {/* Glow effect */}
                                                    <div className="absolute -inset-2 bg-pink-500/20 rounded-3xl blur-xl opacity-50" />
                                                </motion.div>

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
                                                        <p className="text-xs text-muted mt-1">Show your custom text instead of "Built with Portlify"</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setCustomBranding(prev => ({ ...prev, enabled: !prev.enabled }))}
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
                                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                                                            <p className="text-xs text-muted uppercase tracking-wider mb-2">Preview</p>
                                                            <div className="flex items-center justify-center gap-2 text-sm">
                                                                <span className="text-secondary">{customBranding.text || 'Made by Your Name'}</span>
                                                                {customBranding.url && (
                                                                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Save Button */}
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={handleSaveBranding}
                                                            disabled={savingBranding}
                                                            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-shadow disabled:opacity-50"
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

                                    <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                                                {icons.download}
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
                                                className={`relative w-14 h-8 rounded-full transition-all ${isPublic ? 'bg-indigo-500' : 'bg-gray-600'
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
                                            ? '✓ Your portfolio is publicly accessible at portlify.techycsr.dev/' + (userData?.username || 'username')
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
                                                {icons.trash}
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
                                            {icons.check} Settings saved!
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
                                        {icons.warning}
                                    </div>
                                    <h3 className="text-lg font-bold text-primary">Confirm Reset</h3>
                                </div>
                                <button
                                    onClick={() => setShowResetModal(false)}
                                    className="p-2 rounded-lg hover:bg-surface text-muted hover:text-primary transition-colors"
                                >
                                    {icons.close}
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
