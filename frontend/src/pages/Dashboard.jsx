import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMyProfile, getCurrentUser, getAnalyticsSummary } from '../utils/api'

// SVG Icons
const icons = {
    home: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    edit: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    upload: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    ),
    analytics: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    ),
    settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    external: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    ),
    skills: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    briefcase: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    rocket: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
    ),
    education: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
    ),
    copy: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    check: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    eye: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    users: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    menu: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    ),
    close: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

// Sidebar navigation items
const navItems = [
    { to: '/dashboard', icon: icons.home, label: 'Overview' },
    { to: '/editor', icon: icons.edit, label: 'Edit Profile' },
    { to: '/upload', icon: icons.upload, label: 'Upload Resume' },
    { to: '/analytics', icon: icons.analytics, label: 'Analytics' },
    { to: '/settings', icon: icons.settings, label: 'Settings' }
]

function Dashboard() {
    const { user, isLoaded, isSignedIn } = useUser()
    const navigate = useNavigate()
    const location = useLocation()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dbUser, setDbUser] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [copied, setCopied] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            navigate('/')
            return
        }

        const fetchData = async () => {
            try {
                const [userRes, profileRes] = await Promise.all([
                    getCurrentUser(),
                    getMyProfile()
                ])
                setDbUser(userRes.data)
                setProfile(profileRes.data)

                // Try to get analytics (might fail if no data yet)
                try {
                    const analyticsRes = await getAnalyticsSummary()
                    setAnalytics(analyticsRes.data)
                } catch (e) {
                    // Analytics might not exist yet
                }
            } catch (err) {
                if (err.response?.status === 404 || err.response?.data?.needsSetup) {
                    navigate('/upload')
                } else if (err.response?.data?.needsRegistration) {
                    navigate('/username')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [navigate, isLoaded, isSignedIn])

    const copyLink = () => {
        navigator.clipboard.writeText(`https://portlify.techycsr.dev/${dbUser.username}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="spinner w-8 h-8" />
            </div>
        )
    }

    const { basicDetails, skills, experience, education, projects } = profile || {}
    const allSkills = [...(skills?.technical || []), ...(skills?.tools || [])]

    const stats = [
        { label: 'Skills', value: allSkills.length, icon: icons.skills, gradient: 'from-indigo-500 to-purple-500' },
        { label: 'Experience', value: experience?.length || 0, icon: icons.briefcase, gradient: 'from-emerald-500 to-teal-500' },
        { label: 'Projects', value: projects?.length || 0, icon: icons.rocket, gradient: 'from-pink-500 to-rose-500' },
        { label: 'Education', value: education?.length || 0, icon: icons.education, gradient: 'from-amber-500 to-orange-500' }
    ]

    return (
        <div className="min-h-screen pt-16">
            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-20 left-4 z-50 md:hidden p-3 rounded-xl glass-card text-primary"
            >
                {sidebarOpen ? icons.close : icons.menu}
            </button>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    />
                )}
            </AnimatePresence>

            <div className="flex">
                {/* Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{ x: sidebarOpen ? 0 : '-100%' }}
                    className={`fixed md:sticky top-16 left-0 z-50 md:z-0 w-64 h-[calc(100vh-4rem)] glass-card border-r border-border/50 p-4 overflow-y-auto transition-transform md:translate-x-0`}
                >
                    {/* User info */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-surface/50 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {basicDetails?.name?.charAt(0) || dbUser?.username?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-primary truncate">
                                {basicDetails?.name || dbUser?.username || 'User'}
                            </p>
                            <p className="text-xs text-muted truncate">@{dbUser?.username}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.to
                                    ? 'bg-indigo-500/20 text-indigo-400'
                                    : 'text-secondary hover:text-primary hover:bg-surface'
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* View Portfolio button */}
                    {dbUser?.username && (
                        <div className="mt-6 pt-6 border-t border-border">
                            <Link
                                to={`/${dbUser.username}`}
                                target="_blank"
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity"
                            >
                                {icons.external}
                                View Live Portfolio
                            </Link>
                        </div>
                    )}
                </motion.aside>

                {/* Main content */}
                <main className="flex-1 p-6 md:p-8 md:ml-0">
                    <motion.div
                        className="max-w-5xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Header */}
                        <motion.div variants={itemVariants} className="mb-8">
                            <h1 className="text-3xl font-display font-bold text-primary flex items-center gap-3">
                                Welcome back{basicDetails?.name ? `, ${basicDetails.name.split(' ')[0]}` : ''}!
                                <motion.span
                                    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                                >
                                    👋
                                </motion.span>
                            </h1>
                            <p className="text-secondary mt-1">Here's an overview of your portfolio</p>
                        </motion.div>

                        {/* Portfolio URL Card */}
                        {dbUser?.username && (
                            <motion.div
                                variants={itemVariants}
                                className="relative overflow-hidden glass-card rounded-2xl p-5 mb-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted mb-1">Your portfolio URL</p>
                                            <p className="text-primary font-medium">
                                                portlify.techycsr.dev/<span className="heading-gradient">{dbUser.username}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={copyLink}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-primary hover:border-indigo-500/50 transition-all"
                                    >
                                        {copied ? icons.check : icons.copy}
                                        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Analytics Quick Stats */}
                        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="glass-card rounded-xl p-4">
                                <div className="flex items-center gap-2 text-blue-400 mb-2">
                                    {icons.eye}
                                    <span className="text-xs text-muted">Total Views</span>
                                </div>
                                <p className="text-2xl font-bold text-primary">{analytics?.totalViews || 0}</p>
                            </div>
                            <div className="glass-card rounded-xl p-4">
                                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                    {icons.users}
                                    <span className="text-xs text-muted">Unique Visitors</span>
                                </div>
                                <p className="text-2xl font-bold text-primary">{analytics?.uniqueVisitors || 0}</p>
                            </div>
                            <div className="glass-card rounded-xl p-4">
                                <div className="flex items-center gap-2 text-purple-400 mb-2">
                                    {icons.analytics}
                                    <span className="text-xs text-muted">This Week</span>
                                </div>
                                <p className="text-2xl font-bold text-primary">{analytics?.weekViews || 0}</p>
                            </div>
                            <div className="glass-card rounded-xl p-4">
                                <div className="flex items-center gap-2 text-orange-400 mb-2">
                                    {icons.rocket}
                                    <span className="text-xs text-muted">Today</span>
                                </div>
                                <p className="text-2xl font-bold text-primary">{analytics?.todayViews || 0}</p>
                            </div>
                        </motion.div>

                        {/* Profile Stats */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <h2 className="text-lg font-semibold text-primary mb-4">Profile Stats</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        variants={itemVariants}
                                        className="relative overflow-hidden glass-card rounded-xl p-4 group hover:scale-[1.02] transition-transform"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-3`}>
                                            {stat.icon}
                                        </div>
                                        <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                        <p className="text-sm text-muted">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div variants={itemVariants}>
                            <h2 className="text-lg font-semibold text-primary mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    to="/upload"
                                    className="glass-card rounded-xl p-5 group hover:border-purple-500/50 border border-transparent transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                        {icons.upload}
                                    </div>
                                    <h3 className="font-semibold text-primary mb-1">Upload Resume</h3>
                                    <p className="text-sm text-muted">Update with new resume</p>
                                </Link>

                                <Link
                                    to="/editor"
                                    className="glass-card rounded-xl p-5 group hover:border-indigo-500/50 border border-transparent transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                        {icons.edit}
                                    </div>
                                    <h3 className="font-semibold text-primary mb-1">Edit Profile</h3>
                                    <p className="text-sm text-muted">Update info, add projects</p>
                                </Link>

                                <Link
                                    to="/analytics"
                                    className="glass-card rounded-xl p-5 group hover:border-blue-500/50 border border-transparent transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                        {icons.analytics}
                                    </div>
                                    <h3 className="font-semibold text-primary mb-1">View Analytics</h3>
                                    <p className="text-sm text-muted">Track your visitors</p>
                                </Link>

                                <Link
                                    to="/settings"
                                    className="glass-card rounded-xl p-5 group hover:border-orange-500/50 border border-transparent transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                        {icons.settings}
                                    </div>
                                    <h3 className="font-semibold text-primary mb-1">Settings</h3>
                                    <p className="text-sm text-muted">Preferences & export</p>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Recent Skills Preview */}
                        {allSkills.length > 0 && (
                            <motion.div variants={itemVariants} className="mt-6">
                                <h2 className="text-lg font-semibold text-primary mb-4">Your Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {allSkills.slice(0, 12).map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm text-secondary"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {allSkills.length > 12 && (
                                        <span className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm">
                                            +{allSkills.length - 12} more
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard
