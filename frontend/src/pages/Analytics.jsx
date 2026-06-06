import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getAnalyticsDetailed, getAnalyticsSummary } from '../utils/api'
import {
    buildChartSeries,
    formatChartLabel,
    formatChartTooltip,
    getChartBarHeight,
    getChartGapClass,
} from '../utils/analyticsChart'
import { getReferrerCategoryLabel, getReferrerIcon } from '../utils/referrer'
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
import GrowthTips from '../components/GrowthTips'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/AsyncState'
import { useDashboardLayout } from '../components/DashboardLayout'

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
    const { dbUser, profile, basicDetails, isRouteReady } = useDashboardLayout()
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
        if (!isRouteReady) return

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
    }, [isLoaded, isSignedIn, isRouteReady, navigate])

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

    const chartData = buildChartSeries(detailed?.dailyStats, period)
    const maxViews = Math.max(1, ...chartData.map((stat) => stat.views))
    const hasChartViews = chartData.some((stat) => stat.views > 0)

    const allReferrers = detailed?.referrers || []
    const topReferrers = allReferrers.slice(0, 8)
    const totalReferrerViews = allReferrers.reduce((sum, ref) => sum + (ref.count || 0), 0)

    const getReferrerPercent = (count) => {
        if (!totalReferrerViews) return 0
        return Math.round((count / totalReferrerViews) * 100)
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

                        <div className="space-y-3">
                            <div
                                className={`relative h-48 flex items-end ${getChartGapClass(period)}`}
                                role="img"
                                aria-label={`Views over the last ${period === 'week' ? '7 days' : '30 days'}`}
                            >
                                {!hasChartViews && (
                                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted pointer-events-none">
                                        No views in this period yet
                                    </div>
                                )}
                                {chartData.map((stat, i) => {
                                    const barHeight = getChartBarHeight(stat.views, maxViews, period)
                                    const barDelay = period === 'month' ? i * 0.015 : i * 0.04

                                    return (
                                        <div
                                            key={`${stat.date.getTime()}-${i}`}
                                            className="flex-1 h-full flex flex-col justify-end min-w-0"
                                        >
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: barHeight }}
                                                transition={{ delay: barDelay, duration: 0.35, ease: 'easeOut' }}
                                                className={`w-full rounded-t-sm relative group ${stat.views > 0
                                                    ? 'bg-primary-500/90 hover:bg-primary-500'
                                                    : 'bg-surface/80'
                                                    }`}
                                                title={formatChartTooltip(stat.date, stat.views)}
                                            >
                                                {stat.views > 0 && (
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface border border-[var(--glass-border)] rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                        {stat.views} views
                                                    </div>
                                                )}
                                            </motion.div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={`flex ${getChartGapClass(period)}`}>
                                {chartData.map((stat, i) => {
                                    const label = formatChartLabel(stat.date, period, i, chartData.length)

                                    return (
                                        <div
                                            key={`${stat.date.getTime()}-label-${i}`}
                                            className="flex-1 text-center text-[10px] sm:text-xs text-muted min-w-0 leading-none"
                                            aria-hidden={!label}
                                        >
                                            {label}
                                        </div>
                                    )
                                })}
                            </div>
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
                        <div className="flex items-center justify-between gap-3 mb-6">
                            <h2 className="font-bold text-primary">Top Referrers</h2>
                            {topReferrers.length > 0 && (
                                <span className="text-xs text-muted">
                                    {formatNumber(totalReferrerViews)} referrer visits tracked
                                </span>
                            )}
                        </div>

                        {topReferrers.length > 0 ? (
                            <div className="space-y-4">
                                {topReferrers.map((ref, i) => {
                                    const ReferrerIcon = getReferrerIcon(ref.category)
                                    const label = ref.label || ref.source
                                    const percent = getReferrerPercent(ref.count)

                                    return (
                                        <div key={`${ref.id || label}-${i}`}>
                                            <div className="flex items-center justify-between gap-3 mb-2">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-9 h-9 rounded-lg bg-tertiary flex items-center justify-center flex-shrink-0">
                                                        <ReferrerIcon size={16} className="text-secondary" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-primary font-medium truncate">{label}</p>
                                                        <p className="text-xs text-muted truncate">
                                                            {getReferrerCategoryLabel(ref.category)}
                                                            {ref.domain ? ` · ${ref.domain}` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-primary font-medium">{formatNumber(ref.count)}</p>
                                                    <p className="text-xs text-muted">{percent}%</p>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-surface rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percent}%` }}
                                                    transition={{ delay: 0.5 + i * 0.08, duration: 0.45 }}
                                                    className="h-full bg-primary-500/70 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted">
                                <p>No referrer data yet</p>
                                <p className="text-sm mt-1 max-w-sm mx-auto">
                                    Share your portfolio on LinkedIn, add UTM links, or send it through ChatGPT to see where visitors come from
                                </p>
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

                        <GrowthTips
                            username={dbUser?.username}
                            basicDetails={basicDetails}
                            profile={profile}
                        />
                    </motion.div>
                </div>
        </div>
    )
}

export default Analytics
