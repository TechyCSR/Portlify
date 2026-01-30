import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getAnalyticsDetailed, getAnalyticsSummary, getCurrentUser } from '../utils/api'

// Icons
const icons = {
    back: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    ),
    eye: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    users: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
    ),
    calendar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    trending: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
    desktop: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    mobile: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    ),
    tablet: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    )
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

function Analytics() {
    const navigate = useNavigate()
    const { isLoaded, isSignedIn } = useUser()
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState(null)
    const [detailed, setDetailed] = useState(null)
    const [period, setPeriod] = useState('week')

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            navigate('/')
            return
        }

        const loadData = async () => {
            try {
                const [summaryRes, detailedRes] = await Promise.all([
                    getAnalyticsSummary(),
                    getAnalyticsDetailed()
                ])
                setSummary(summaryRes.data)
                setDetailed(detailedRes.data)
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

    // Calculate percentage change
    const getChange = (current, previous) => {
        if (!previous) return { value: 0, positive: true }
        const change = ((current - previous) / previous) * 100
        return { value: Math.abs(change).toFixed(1), positive: change >= 0 }
    }

    // Format number with commas
    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num || 0)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="spinner w-8 h-8" />
            </div>
        )
    }

    const totalDevices = (detailed?.devices?.desktop || 0) +
        (detailed?.devices?.mobile || 0) +
        (detailed?.devices?.tablet || 0)

    const getDevicePercent = (type) => {
        if (!totalDevices) return 0
        return Math.round(((detailed?.devices?.[type] || 0) / totalDevices) * 100)
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
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
                        <h1 className="text-2xl font-display font-bold text-primary">Analytics</h1>
                        <p className="text-secondary">Track your portfolio performance</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {/* Total Views */}
                    <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400">
                                {icons.eye}
                            </div>
                            <span className="text-sm text-muted">Total Views</span>
                        </div>
                        <p className="text-3xl font-bold text-primary">{formatNumber(summary?.totalViews)}</p>
                    </motion.div>

                    {/* Unique Visitors */}
                    <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400">
                                {icons.users}
                            </div>
                            <span className="text-sm text-muted">Unique Visitors</span>
                        </div>
                        <p className="text-3xl font-bold text-primary">{formatNumber(summary?.uniqueVisitors)}</p>
                    </motion.div>

                    {/* This Week */}
                    <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400">
                                {icons.calendar}
                            </div>
                            <span className="text-sm text-muted">This Week</span>
                        </div>
                        <p className="text-3xl font-bold text-primary">{formatNumber(summary?.weekViews)}</p>
                    </motion.div>

                    {/* Today */}
                    <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-400">
                                {icons.trending}
                            </div>
                            <span className="text-sm text-muted">Today</span>
                        </div>
                        <p className="text-3xl font-bold text-primary">{formatNumber(summary?.todayViews)}</p>
                    </motion.div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* View History Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-primary">Views Over Time</h2>
                            <div className="flex gap-2">
                                {['week', 'month'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${period === p
                                                ? 'bg-indigo-500/20 text-indigo-400'
                                                : 'text-muted hover:text-primary'
                                            }`}
                                    >
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Simple bar chart */}
                        <div className="h-48 flex items-end gap-2">
                            {(detailed?.dailyStats?.slice(period === 'week' ? -7 : -30) || []).map((stat, i) => {
                                const maxViews = Math.max(...(detailed?.dailyStats?.map(s => s.views) || [1]))
                                const height = (stat.views / maxViews) * 100
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(height, 5)}%` }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex-1 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg relative group cursor-pointer min-h-[8px]"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {stat.views} views
                                        </div>
                                    </motion.div>
                                )
                            })}
                            {(!detailed?.dailyStats?.length) && (
                                <div className="flex-1 flex items-center justify-center text-muted">
                                    No data yet
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Device Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h2 className="font-bold text-primary mb-6">Device Breakdown</h2>

                        <div className="space-y-4">
                            {/* Desktop */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-secondary">
                                        {icons.desktop}
                                        <span>Desktop</span>
                                    </div>
                                    <span className="text-primary font-medium">{getDevicePercent('desktop')}%</span>
                                </div>
                                <div className="h-2 bg-surface rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getDevicePercent('desktop')}%` }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Mobile */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-secondary">
                                        {icons.mobile}
                                        <span>Mobile</span>
                                    </div>
                                    <span className="text-primary font-medium">{getDevicePercent('mobile')}%</span>
                                </div>
                                <div className="h-2 bg-surface rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getDevicePercent('mobile')}%` }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Tablet */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-secondary">
                                        {icons.tablet}
                                        <span>Tablet</span>
                                    </div>
                                    <span className="text-primary font-medium">{getDevicePercent('tablet')}%</span>
                                </div>
                                <div className="h-2 bg-surface rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${getDevicePercent('tablet')}%` }}
                                        transition={{ delay: 0.7, duration: 0.5 }}
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Top Referrers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h2 className="font-bold text-primary mb-6">Top Referrers</h2>

                        {(detailed?.referrers?.length || 0) > 0 ? (
                            <div className="space-y-3">
                                {detailed.referrers.slice(0, 5).map((ref, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-xl">
                                        <span className="text-secondary truncate max-w-[200px]">{ref.source}</span>
                                        <span className="text-primary font-medium">{ref.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted">
                                <p>No referrer data yet</p>
                                <p className="text-sm mt-1">Share your portfolio to see where visitors come from</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Tips */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <h2 className="font-bold text-primary mb-6">Growth Tips</h2>

                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                                <p className="text-secondary text-sm">
                                    💡 <strong className="text-primary">Share on LinkedIn</strong> - Professional networks drive the most relevant traffic to portfolios.
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
                                <p className="text-secondary text-sm">
                                    📧 <strong className="text-primary">Add to email signature</strong> - Every email becomes an opportunity to showcase your work.
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
                                <p className="text-secondary text-sm">
                                    🔗 <strong className="text-primary">Add to resume</strong> - Include your portfolio link to stand out from other applicants.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Analytics
