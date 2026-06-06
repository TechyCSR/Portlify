import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getAnalyticsSummary } from '../utils/api'
import { getAppUrl, getPortfolioUrl } from '../utils/appUrl'
import { useDashboardLayout } from '../components/DashboardLayout'
import { isMissingProfileError } from '../utils/profileSetup'
import DashboardSkeleton from '../components/DashboardSkeleton'
import {
    BarChart3,
    Briefcase,
    Check,
    Cloud,
    Copy,
    Database,
    Eye,
    GraduationCap,
    Layers,
    Link2,
    MessageCircle,
    Rocket,
    Terminal,
    Users,
    Wrench,
    Zap,
} from 'lucide-react'
import { IconTile, ICON_STROKE } from '../components/IconTile'
import PageHeader from '../components/PageHeader'
import SectionHeading from '../components/SectionHeading'
import { ErrorState } from '../components/AsyncState'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

const skillCategories = [
    { key: 'programmingLanguages', label: 'Programming Languages', icon: Terminal },
    { key: 'frameworks', label: 'Frameworks & Libraries', icon: Layers },
    { key: 'databases', label: 'Databases', icon: Database },
    { key: 'tools', label: 'Tools', icon: Wrench },
    { key: 'cloudSystems', label: 'Cloud & Systems', icon: Cloud },
    { key: 'softSkills', label: 'Soft Skills', icon: MessageCircle },
]

function Dashboard() {
    const { isLoaded, isSignedIn } = useUser()
    const navigate = useNavigate()
    const { dbUser, profile, basicDetails, isLoading, loadError, refreshData } = useDashboardLayout()
    const [analytics, setAnalytics] = useState(null)
    const [analyticsLoaded, setAnalyticsLoaded] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState(null)
    const [retryCount, setRetryCount] = useState(0)
    const attemptCountRef = useRef(0)

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            navigate('/')
        }
    }, [navigate, isLoaded, isSignedIn])

    useEffect(() => {
        if (isLoading || !loadError) return

        const err = loadError
        console.error('Dashboard data fetch error:', err)
        if (isMissingProfileError(err)) {
            navigate('/upload')
        } else if (err.response?.data?.needsRegistration) {
            navigate('/username')
        } else if (attemptCountRef.current === 0) {
            attemptCountRef.current = 1
            setTimeout(() => setRetryCount((c) => c + 1), 1000)
        } else {
            setError('Failed to load dashboard data. Please check your connection.')
        }
    }, [isLoading, loadError, navigate])

    useEffect(() => {
        if (isLoading || loadError || !profile) return

        attemptCountRef.current = 0
        setError(null)

        let cancelled = false
        const fetchAnalytics = async () => {
            try {
                const analyticsRes = await getAnalyticsSummary()
                if (!cancelled) setAnalytics(analyticsRes.data)
            } catch {
                if (!cancelled) setAnalytics(null)
            } finally {
                if (!cancelled) setAnalyticsLoaded(true)
            }
        }

        fetchAnalytics()
        return () => { cancelled = true }
    }, [isLoading, loadError, profile])

    useEffect(() => {
        if (retryCount > 0) {
            refreshData()
        }
    }, [retryCount, refreshData])

    const copyLink = () => {
        navigator.clipboard.writeText(getPortfolioUrl(dbUser?.username))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (isLoading) {
        return <DashboardSkeleton />
    }

    if (error) {
        return <ErrorState message={error} onRetry={() => setRetryCount((c) => c + 1)} />
    }

    const { skills, experience, education, projects } = profile || {}

    const allSkills = [
        ...(skills?.programmingLanguages || []),
        ...(skills?.frameworks || []),
        ...(skills?.databases || []),
        ...(skills?.tools || []),
        ...(skills?.cloudSystems || []),
        ...(skills?.softSkills || []),
    ]

    const profileStats = [
        { label: 'Skills', value: allSkills.length, icon: Zap },
        { label: 'Experience', value: experience?.length || 0, icon: Briefcase },
        { label: 'Projects', value: projects?.length || 0, icon: Rocket },
        { label: 'Education', value: education?.length || 0, icon: GraduationCap },
    ]

    const analyticsStats = [
        { label: 'Total Views', value: analytics?.totalViews || 0, icon: Eye },
        { label: 'Unique Visitors', value: analytics?.uniqueVisitors || 0, icon: Users },
        { label: 'This Week', value: analytics?.weekViews || 0, icon: BarChart3 },
        { label: 'Today', value: analytics?.todayViews || 0, icon: Rocket },
    ]

    return (
        <motion.div
            className="max-w-5xl mx-auto w-full"
            variants={containerVariants}
            initial={false}
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <PageHeader
                    title={`Welcome back${basicDetails?.name ? `, ${basicDetails.name.split(' ')[0]}` : ''}!`}
                    description="Here's an overview of your portfolio"
                />
            </motion.div>

            {dbUser?.username && (
                <motion.div variants={itemVariants} className="glass-card rounded-2xl p-5 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <IconTile icon={Link2} />
                            <div className="min-w-0">
                                <p className="text-sm text-muted mb-1">Your portfolio URL</p>
                                <p className="text-primary font-medium truncate">
                                    {getAppUrl().replace(/^https?:\/\//, '')}/
                                    <span className="text-primary-400">{dbUser.username}</span>
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={copyLink}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-tertiary text-primary hover:bg-surface-hover transition-colors flex-shrink-0"
                        >
                            {copied
                                ? <Check size={16} strokeWidth={ICON_STROKE} className="text-success" />
                                : <Copy size={16} strokeWidth={ICON_STROKE} className="text-secondary" />}
                            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                        </button>
                    </div>
                </motion.div>
            )}

            <motion.div variants={itemVariants} className="mb-6">
                <SectionHeading>Portfolio Analytics</SectionHeading>
                {analyticsLoaded && analyticsStats.every((stat) => stat.value === 0) ? (
                    <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-secondary text-sm">
                            No views yet. Share your portfolio link to start tracking visitors.
                        </p>
                        <Link to="/analytics" className="btn-primary text-sm justify-center">
                            View Analytics
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {analyticsStats.map((stat) => {
                            const Icon = stat.icon
                            return (
                                <div key={stat.label} className="glass-card rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon size={15} strokeWidth={ICON_STROKE} className="text-secondary" />
                                        <span className="text-xs text-muted">{stat.label}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
                <SectionHeading>Profile Stats</SectionHeading>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    {profileStats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={stat.label}
                                className="glass-card rounded-xl p-4 hover:bg-surface-hover transition-colors"
                            >
                                <IconTile icon={Icon} className="w-9 h-9 mb-3" size={18} />
                                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                                <p className="text-sm text-muted">{stat.label}</p>
                            </div>
                        )
                    })}
                </div>
            </motion.div>

            {allSkills.length > 0 && (
                <motion.div variants={itemVariants}>
                    <SectionHeading>Your Skills</SectionHeading>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {skillCategories.map((category) => {
                            const categorySkills = skills?.[category.key] || []
                            if (categorySkills.length === 0) return null
                            const Icon = category.icon

                            return (
                                <div
                                    key={category.key}
                                    className="glass-card rounded-xl p-4 hover:bg-surface-hover transition-colors"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <IconTile icon={Icon} className="w-9 h-9" size={18} />
                                        <h3 className="font-medium text-primary text-sm">{category.label}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {categorySkills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-2.5 py-1 rounded-md text-xs font-medium bg-tertiary text-secondary"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}

export default Dashboard