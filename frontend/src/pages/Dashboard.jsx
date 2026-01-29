import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getMyProfile, updateProfile, getCurrentUser } from '../utils/api'

function Dashboard() {
    const { user } = useUser()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dbUser, setDbUser] = useState(null)

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
                        <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
                        <p className="text-dark-400">Manage your portfolio</p>
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
                                <p className="text-dark-400 text-sm mb-1">Your Portfolio URL</p>
                                <p className="text-xl font-medium text-primary-300">
                                    portlify.techycsr.dev/{dbUser.username}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`https://portlify.techycsr.dev/${dbUser.username}`)
                                    // Could add toast notification here
                                }}
                                className="px-4 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-dark-300 text-sm transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy Link
                            </button>
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
                        { label: 'Skills', value: allSkills.length, icon: '⚡', color: 'primary' },
                        { label: 'Experience', value: experience?.length || 0, icon: '💼', color: 'green' },
                        { label: 'Projects', value: projects?.length || 0, icon: '🚀', color: 'accent' },
                        { label: 'Education', value: education?.length || 0, icon: '🎓', color: 'yellow' }
                    ].map((stat, i) => (
                        <div key={i} className="glass rounded-2xl p-4 text-center">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <p className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</p>
                            <p className="text-dark-500 text-sm">{stat.label}</p>
                        </div>
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
                        <h2 className="text-xl font-bold text-white">Profile Preview</h2>
                        <Link to="/editor" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                            Edit Profile →
                        </Link>
                    </div>

                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {basicDetails?.profilePhoto ? (
                                <img src={basicDetails.profilePhoto} alt={basicDetails.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-white">
                                    {basicDetails?.name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-2xl font-bold text-white mb-1">
                                {basicDetails?.name || 'Your Name'}
                            </h3>
                            {basicDetails?.headline && (
                                <p className="text-primary-400 mb-2">{basicDetails.headline}</p>
                            )}
                            {basicDetails?.location && (
                                <p className="text-dark-500 text-sm mb-4">{basicDetails.location}</p>
                            )}

                            {/* Skills preview */}
                            {allSkills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {allSkills.slice(0, 6).map((skill, i) => (
                                        <span key={i} className="px-3 py-1 rounded-full bg-dark-700/50 text-dark-300 text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                    {allSkills.length > 6 && (
                                        <span className="px-3 py-1 rounded-full bg-dark-700/50 text-dark-500 text-sm">
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
                    <Link
                        to="/editor"
                        className="glass rounded-2xl p-6 group hover:bg-dark-800/50 transition-colors"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Edit Profile</h3>
                        <p className="text-dark-500 text-sm">Update your information, add projects, and more</p>
                    </Link>

                    <Link
                        to="/upload"
                        className="glass rounded-2xl p-6 group hover:bg-dark-800/50 transition-colors"
                    >
                        <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">Upload New Resume</h3>
                        <p className="text-dark-500 text-sm">Re-parse your resume with the latest AI</p>
                    </Link>

                    {dbUser?.username && (
                        <a
                            href={`https://portlify.techycsr.dev/${dbUser.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass rounded-2xl p-6 group hover:bg-dark-800/50 transition-colors"
                        >
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">View Live Portfolio</h3>
                            <p className="text-dark-500 text-sm">See how your portfolio looks to visitors</p>
                        </a>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default Dashboard
