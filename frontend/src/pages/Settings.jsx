import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCurrentUser, getPreferences, updatePreferences, getMyProfile, downloadPortfolio } from '../utils/api'

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
    back: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
    check: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    )
}

const tabs = [
    { id: 'profile', label: 'Profile', icon: icons.user },
    { id: 'appearance', label: 'Appearance', icon: icons.palette },
    { id: 'export', label: 'Export', icon: icons.download },
    { id: 'privacy', label: 'Privacy', icon: icons.eye }
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
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [error, setError] = useState('')

    const [userData, setUserData] = useState(null)
    const [preferences, setPreferences] = useState({
        portfolioType: 'technical',
        experienceLevel: 'fresher',
        themePreference: 'modern'
    })
    const [isPublic, setIsPublic] = useState(true)

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
                setPreferences(prefsRes.data.preferences || preferences)
                setIsPublic(profileRes.data?.isPublic ?? true)
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

    const handleSave = async () => {
        setSaving(true)
        setError('')
        setSaveSuccess(false)
        try {
            await updatePreferences(preferences)
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (err) {
            setError('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handleDownload = async () => {
        setDownloading(true)
        setError('')
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
        } catch (err) {
            setError('Failed to download portfolio')
        } finally {
            setDownloading(false)
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
                                            ? 'bg-indigo-500/20 text-indigo-400'
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

                                                {preferences.themePreference === theme.id && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white"
                                                    >
                                                        {icons.check}
                                                    </motion.div>
                                                )}
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
                                            <div className="p-3 rounded-xl bg-indigo-500/20">
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
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Save Button */}
                        {(activeTab === 'profile' || activeTab === 'appearance' || activeTab === 'privacy') && (
                            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
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
                                <div className="flex-1" />
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
        </div>
    )
}

export default Settings
