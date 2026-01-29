import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getMyProfile, getCurrentUser } from '../utils/api'

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

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-display font-bold text-primary">
                            Welcome back{basicDetails?.name ? `, ${basicDetails.name.split(' ')[0]}` : ''}! 👋
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-2xl p-6 mb-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="text-tertiary text-sm mb-1">Your Portfolio URL</p>
                                <p className="text-xl font-medium heading-gradient">
                                    portlify.techycsr.dev/{dbUser.username}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={copyLink}
                                className="px-5 py-2.5 rounded-xl bg-surface border text-secondary text-sm transition-all flex items-center gap-2"
                                style={{ borderColor: 'var(--color-border)' }}
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy Link
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { label: 'Skills', value: allSkills.length, icon: '⚡', gradient: 'from-indigo-500 to-purple-500' },
                        { label: 'Experience', value: experience?.length || 0, icon: '💼', gradient: 'from-emerald-500 to-teal-500' },
                        { label: 'Projects', value: projects?.length || 0, icon: '🚀', gradient: 'from-pink-500 to-rose-500' },
                        { label: 'Education', value: education?.length || 0, icon: '🎓', gradient: 'from-amber-500 to-orange-500' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -3, scale: 1.02 }}
                            className="glass-card rounded-2xl p-5 text-center"
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                                {stat.value}
                            </p>
                            <p className="text-tertiary text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Profile Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-3xl p-6 md:p-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-primary">Profile Preview</h2>
                        <Link to="/editor" className="text-sm font-medium heading-gradient hover:opacity-80 transition-opacity">
                            Edit Profile →
                        </Link>
                    </div>

                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden"
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
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {basicDetails.location}
                                </p>
                            )}

                            {/* Skills preview */}
                            {allSkills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {allSkills.slice(0, 6).map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                            style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}
                                        >
                                            {skill}
                                        </span>
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 grid md:grid-cols-3 gap-4"
                >
                    {[
                        {
                            to: '/editor',
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            ),
                            title: 'Edit Profile',
                            desc: 'Update your info, add projects',
                            gradient: 'from-indigo-500 to-purple-500'
                        },
                        {
                            to: '/upload',
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            ),
                            title: 'New Resume',
                            desc: 'Re-parse with latest AI',
                            gradient: 'from-pink-500 to-rose-500'
                        },
                        {
                            to: dbUser?.username ? `/${dbUser.username}` : '#',
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            ),
                            title: 'View Live',
                            desc: 'See your public portfolio',
                            gradient: 'from-emerald-500 to-teal-500'
                        }
                    ].map((action, i) => (
                        <Link key={i} to={action.to}>
                            <motion.div
                                whileHover={{ y: -3, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="glass-card rounded-2xl p-6 group cursor-pointer"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}
                                >
                                    {action.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-primary mb-1">{action.title}</h3>
                                <p className="text-tertiary text-sm">{action.desc}</p>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default Dashboard
