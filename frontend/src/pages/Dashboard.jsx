import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getMyProfile, getCurrentUser } from '../utils/api'

// SVG Icons
const icons = {
    skills: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    briefcase: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    rocket: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
    ),
    education: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
    ),
    edit: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    upload: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    ),
    external: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    ),
    location: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
    ),
    copy: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    check: (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    link: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
    ),
    wave: (
        <svg className="w-8 h-8 inline-block ml-2" viewBox="0 0 36 36" fill="none">
            <path d="M7.5 17.5C7.5 17.5 8 14, 11 13 C14 12, 15.5 14, 16 16.5 C16.5 19, 18 20, 20 19 C22 18, 23.5 15.5, 26 15 C28.5 14.5, 30 17, 30 17" stroke="url(#waveGrad)" strokeWidth="3" strokeLinecap="round" />
            <defs>
                <linearGradient id="waveGrad" x1="7.5" y1="15" x2="30" y2="15">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
            </defs>
        </svg>
    )
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

function Dashboard() {
    const { user } = useUser()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dbUser, setDbUser] = useState(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: userData } = await getCurrentUser()
                setDbUser(userData)

                const { data: profileData } = await getMyProfile()
                setProfile(profileData)
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
    }, [navigate])

    const copyLink = () => {
        navigator.clipboard.writeText(`https://portlify.techycsr.dev/${dbUser.username}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="spinner" />
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

    const quickActions = [
        {
            to: '/editor',
            icon: icons.edit,
            title: 'Edit Profile',
            desc: 'Update your info, add projects',
            gradient: 'from-indigo-500 to-purple-500'
        },
        {
            to: '/upload',
            icon: icons.upload,
            title: 'New Resume',
            desc: 'Re-parse with latest AI',
            gradient: 'from-pink-500 to-rose-500'
        },
        {
            to: dbUser?.username ? `/${dbUser.username}` : '#',
            icon: icons.external,
            title: 'View Live',
            desc: 'See your public portfolio',
            gradient: 'from-emerald-500 to-teal-500'
        }
    ]

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <motion.div
                className="max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-display font-bold text-primary flex items-center">
                            Welcome back{basicDetails?.name ? `, ${basicDetails.name.split(' ')[0]}` : ''}!
                            <motion.span
                                className="inline-block ml-3 text-3xl"
                                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                            >
                                👋
                            </motion.span>
                        </h1>
                        <p className="text-secondary">Manage your portfolio and profile</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/upload" className="btn-secondary text-sm">
                            Re-upload Resume
                        </Link>
                        {dbUser?.username && (
                            <Link to={`/${dbUser.username}`} className="btn-primary text-sm">
                                View Portfolio →
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* Portfolio URL Card */}
                {dbUser?.username && (
                    <motion.div
                        variants={itemVariants}
                        className="relative overflow-hidden glass-card rounded-2xl p-6 mb-8 group"
                    >
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                                    {icons.link}
                                </div>
                                <div>
                                    <p className="text-tertiary text-sm mb-0.5">Your Portfolio URL</p>
                                    <p className="text-xl font-medium heading-gradient">
                                        portlify.techycsr.dev/{dbUser.username}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={copyLink}
                                className="px-5 py-2.5 rounded-xl bg-surface border text-secondary text-sm transition-all flex items-center gap-2 hover:border-indigo-500/50"
                                style={{ borderColor: 'var(--color-border)' }}
                            >
                                {copied ? (
                                    <>
                                        {icons.check}
                                        <span className="text-green-500">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        {icons.copy}
                                        Copy Link
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="glass-card rounded-2xl p-5 text-center group cursor-default"
                        >
                            <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                                {stat.value}
                            </p>
                            <p className="text-tertiary text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Profile Preview */}
                <motion.div
                    variants={itemVariants}
                    className="glass-card rounded-3xl p-6 md:p-8 mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-primary">Profile Preview</h2>
                        <Link to="/editor" className="text-sm font-medium heading-gradient hover:opacity-80 transition-opacity flex items-center gap-1">
                            Edit Profile
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden ring-4 ring-white/10"
                            style={{ background: 'var(--gradient-primary)' }}
                        >
                            {basicDetails?.profilePhoto ? (
                                <img src={basicDetails.profilePhoto} alt={basicDetails.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {basicDetails?.name?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-2xl font-bold text-primary mb-1">
                                {basicDetails?.name || 'Your Name'}
                            </h3>
                            {basicDetails?.headline && (
                                <p className="heading-gradient font-medium mb-2">{basicDetails.headline}</p>
                            )}
                            {basicDetails?.location && (
                                <p className="text-tertiary text-sm mb-4 flex items-center gap-1">
                                    {icons.location}
                                    {basicDetails.location}
                                </p>
                            )}

                            {/* Skills preview */}
                            {allSkills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {allSkills.slice(0, 6).map((skill, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                            style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                    {allSkills.length > 6 && (
                                        <span className="px-3 py-1.5 rounded-lg text-sm text-muted" style={{ background: 'var(--color-bg-tertiary)' }}>
                                            +{allSkills.length - 6} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    variants={itemVariants}
                    className="grid md:grid-cols-3 gap-4"
                >
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.to}>
                            <motion.div
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="glass-card rounded-2xl p-6 group cursor-pointer h-full"
                            >
                                <div
                                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                                >
                                    {action.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-primary mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-indigo-400 group-hover:to-purple-400 transition-all">
                                    {action.title}
                                </h3>
                                <p className="text-tertiary text-sm">{action.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Dashboard
