import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getAnalyticsDetailed, getAnalyticsSummary } from '../utils/api'
import {
    Calendar,
    Eye,
    Monitor,
    Smartphone,
    Tablet,
    TrendingUp,
    Users,
} from 'lucide-react'
import { IconTile, InlineIcon } from '../components/IconTile'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/AsyncState'

const analyticsStats = [
    { label: 'Total Views', key: 'totalViews', icon: Eye },
    { label: 'Unique Visitors', key: 'uniqueVisitors', icon: Users },
    { label: 'This Week', key: 'weekViews', icon: Calendar },
    { label: 'Today', key: 'todayViews', icon: TrendingUp },
]

const deviceStats = [
    { type: 'desktop', label: 'Desktop', icon: Monitor },
    { type: 'mobile', label: 'Mobile', icon: Smartphone },
    { type: 'tablet', label: 'Tablet', icon: Tablet },
]

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
    const [loadError, setLoadError] = useState('')
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
            setLoadError('')
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
                    return
                }
                setLoadError(err.response?.data?.error || 'Failed to load analytics')
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [isLoaded, isSignedIn, navigate])

    // Format number with commas
    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num || 0)
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

    const totalDevices = (detailed?.devices?.desktop || 0) +
        (detailed?.devices?.mobile || 0) +
        (detailed?.devices?.tablet || 0)

    const getDevicePercent = (type) => {
        if (!totalDevices) return 0
        return Math.round(((detailed?.devices?.[type] || 0) / totalDevices) * 100)
    }

    return (
        <div className="max-w-6xl mx-auto pb-6">
            <PageHeader
                title="Analytics"
                description="Track your portfolio performance"
            />

                {/* Stats Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {analyticsStats.map((stat) => (
                        <motion.div key={stat.key} variants={itemVariants} className="glass-card rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <IconTile icon={stat.icon} className="w-9 h-9" size={18} />
                                <span className="text-sm text-muted">{stat.label}</span>
                            </div>
                            <p className="text-3xl font-bold text-primary">{formatNumber(summary?.[stat.key])}</p>
                        </motion.div>
                    ))}
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
                                                ? 'bg-primary-500/20 text-primary-400'
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
                                        className="flex-1 bg-primary-500 rounded-t-lg relative group cursor-pointer min-h-[8px]"
                                        role="img"
                                        aria-label={`${stat.date}: ${stat.views} views`}
                                        title={`${stat.date}: ${stat.views} views`}
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
                            {deviceStats.map((device, i) => (
                                <div key={device.type}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-secondary">
                                            <InlineIcon icon={device.icon} size={16} />
                                            <span>{device.label}</span>
                                        </div>
                                        <span className="text-primary font-medium">{getDevicePercent(device.type)}%</span>
                                    </div>
                                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${getDevicePercent(device.type)}%` }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                            className="h-full bg-primary-500/70 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
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

                        <div className="space-y-3">
                            {[
                                { title: 'Share on LinkedIn', desc: 'Professional networks drive the most relevant traffic to portfolios.' },
                                { title: 'Add to email signature', desc: 'Every email becomes an opportunity to showcase your work.' },
                                { title: 'Add to resume', desc: 'Include your portfolio link to stand out from other applicants.' },
                            ].map((tip) => (
                                <div key={tip.title} className="p-4 bg-tertiary rounded-xl">
                                    <p className="text-secondary text-sm">
                                        <strong className="text-primary">{tip.title}</strong> — {tip.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
        </div>
    )
}

export default Analytics
