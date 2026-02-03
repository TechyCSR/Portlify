import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentUser, getPreferences, updatePreferences, getMyProfile, downloadPortfolio, resetProfile, updateVisibility } from '../utils/api'
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
    )
}

const tabs = [
    { id: 'profile', label: 'Profile', icon: icons.user },
    { id: 'appearance', label: 'Appearance', icon: icons.palette },
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
                const [userRes, prefsRes, profileRes] = await Promise.all([
                    getCurrentUser(),
                    getPreferences(),
                    getMyProfile()
                ])
                setUserData(userRes.data)
                if (prefsRes.data.preferences) {
                    setPreferences(prefsRes.data.preferences)
                }
                const publicStatus = profileRes.data?.isPublic ?? true
                setIsPublic(publicStatus)
                setOriginalIsPublic(publicStatus)
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
