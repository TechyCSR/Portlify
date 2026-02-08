import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getPublicProfile, trackPortfolioView } from '../utils/api'
import { useTheme } from '../context/ThemeContext'
import {
    User, Briefcase, Rocket, GraduationCap,
    Award, BookOpen, Heart, Users,
    Github, Linkedin, Twitter, Globe, Mail,
    MapPin, ExternalLink, Code, Calendar,
    Building, ChevronRight, Sparkles, Moon, Sun,
    Terminal, Layers, Database, Wrench, Cloud, MessageCircle, Info
} from 'lucide-react'

// ==================== THEME UTILS ====================
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

const getThemeColors = (themeName, mode) => {
    const palettes = {
        modern: { primary: '#6366f1', secondary: '#a855f7', accent: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)' },
        minimal: { primary: '#18181b', secondary: '#52525b', accent: 'linear-gradient(135deg, #18181b, #52525b)' },
        creative: { primary: '#ec4899', secondary: '#8b5cf6', accent: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)' },
        professional: { primary: '#0d9488', secondary: '#0891b2', accent: 'linear-gradient(135deg, #0d9488, #0891b2)' }
    }

    const palette = palettes[themeName] || palettes.modern
    const isDark = mode === 'dark'

    // Adjust minimal theme primary for dark mode
    if (themeName === 'minimal' && isDark) {
        palette.primary = '#f8fafc'
        palette.secondary = '#94a3b8'
        palette.accent = 'linear-gradient(135deg, #f8fafc, #94a3b8)'
    }

    return {
        ...palette,
        bg: isDark ? '#030712' : '#ffffff',
        surface: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.85)',
        surfaceSolid: isDark ? '#0f172a' : '#f8fafc',
        text: isDark ? '#f8fafc' : '#0f172a',
        textSecondary: isDark ? '#94a3b8' : '#475569',
        border: isDark ? `rgba(${hexToRgb(palette.primary)}, 0.2)` : `rgba(${hexToRgb(palette.primary)}, 0.1)`,
        glow: isDark ? `rgba(${hexToRgb(palette.primary)}, 0.4)` : `rgba(${hexToRgb(palette.primary)}, 0.15)`
    }
}

// ==================== ANIMATION VARIANTS ====================
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
}

const cardHover = {
    rest: { scale: 1, rotateX: 0, rotateY: 0 },
    hover: { scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 17 } }
}

// ==================== GLASSMORPHIC CARD COMPONENT ====================
const GlassCard = ({ children, className = '', hover = true, style = {} }) => (
    <motion.div
        variants={hover ? cardHover : undefined}
        initial="rest"
        whileHover={hover ? "hover" : undefined}
        className={`relative backdrop-blur-xl rounded-2xl border transition-all duration-300 ${className}`}
        style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            ...style
        }}
    >
        {children}
        {hover && (
            <div
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    boxShadow: `0 0 40px var(--glow), inset 0 1px 0 rgba(255,255,255,0.1)`,
                    border: '1px solid var(--glow)'
                }}
            />
        )}
    </motion.div>
)

// ==================== SKILL BAR COMPONENT ====================
const SkillChip = ({ skill, index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.03 }}
        className="group relative px-4 py-2 rounded-full backdrop-blur-sm border cursor-default"
        style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)'
        }}
    >
        <span style={{ color: 'var(--text)' }} className="text-sm font-medium">
            {skill}
        </span>
        <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'var(--accent)', opacity: 0.1 }}
        />
    </motion.div>
)

// ==================== TIMELINE ITEM COMPONENT ====================
const TimelineItem = ({ item, type, index, isLast }) => (
    <motion.div
        variants={itemVariants}
        className="relative pl-8 pb-8"
    >
        {/* Timeline connector */}
        {!isLast && (
            <div
                className="absolute left-[11px] top-8 bottom-0 w-px"
                style={{ background: `linear-gradient(to bottom, var(--primary), transparent)` }}
            />
        )}

        {/* Timeline dot */}
        <div
            className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--accent)', boxShadow: `0 0 20px var(--glow)` }}
        >
            <div className="w-2 h-2 bg-white rounded-full" />
        </div>

        <GlassCard className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                        {type === 'experience' ? item.title : item.degree}
                    </h3>
                    <div className="flex items-center gap-2 mt-1" style={{ color: 'var(--textSecondary)' }}>
                        <Building size={14} />
                        <span className="text-sm">
                            {type === 'experience' ? item.company : item.institution}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'var(--surface)', color: 'var(--primary)' }}>
                    <Calendar size={12} />
                    {type === 'experience' ? item.duration : item.year}
                </div>
            </div>

            {/* GPA/Score for Education */}
            {type === 'education' && item.gpa && (
                <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg w-fit text-sm font-medium"
                    style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Score: {item.gpa}
                </div>
            )}

            {item.location && (
                <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: 'var(--textSecondary)' }}>
                    <MapPin size={14} />
                    {item.location}
                </div>
            )}

            {item.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                    {item.description}
                </p>
            )}

            {item.achievements?.length > 0 && (
                <ul className="mt-3 space-y-2">
                    {item.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--textSecondary)' }}>
                            <ChevronRight size={14} style={{ color: 'var(--primary)' }} className="mt-0.5 flex-shrink-0" />
                            {achievement}
                        </li>
                    ))}
                </ul>
            )}
        </GlassCard>
    </motion.div>
)

// ==================== PROJECT CARD COMPONENT ====================
const ProjectCard = ({ project, index }) => (
    <motion.div
        variants={itemVariants}
        className="group"
        style={{ perspective: '1000px' }}
    >
        <GlassCard className="p-6 h-full">
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--accent)' }}
                >
                    <Rocket size={24} className="text-white" />
                </div>
                <div className="flex gap-2">
                    {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg transition-colors hover:bg-white/10"
                            style={{ color: 'var(--textSecondary)' }}>
                            <Github size={18} />
                        </a>
                    )}
                    {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                            className="p-2 rounded-lg transition-colors hover:bg-white/10"
                            style={{ color: 'var(--textSecondary)' }}>
                            <ExternalLink size={18} />
                        </a>
                    )}
                </div>
            </div>

            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                {project.title}
            </h3>

            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--textSecondary)' }}>
                {project.description}
            </p>

            {project.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.techStack.map((tech, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-md font-medium"
                            style={{ background: 'var(--surface)', color: 'var(--primary)' }}>
                            {tech}
                        </span>
                    ))}
                </div>
            )}
        </GlassCard>
    </motion.div>
)

// ==================== MAIN PORTFOLIO COMPONENT ====================
function Portfolio() {
    const [showPremiumInfo, setShowPremiumInfo] = useState(false)
    const timeoutRef = useRef(null)

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setShowPremiumInfo(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowPremiumInfo(false)
        }, 3000)
    }

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])
    const { username } = useParams()
    const { theme, toggleTheme } = useTheme()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('about')
    const [portfolioTheme, setPortfolioTheme] = useState('modern')



    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getPublicProfile(username)
                setProfile(data)
                if (data.theme) setPortfolioTheme(data.theme)

                // Track view using fetch to avoid auth interceptor issues
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
                fetch(`${API_URL}/api/analytics/track/${encodeURIComponent(username)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ referrer: document.referrer || 'direct' })
                }).catch(() => { /* silent */ })
            } catch (err) {
                setError(err.response?.status === 404 ? 'Profile not found' : 'Failed to load profile')
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [username])

    const colors = useMemo(() => getThemeColors(portfolioTheme, theme), [portfolioTheme, theme])

    // Extract profile data
    const { basicDetails, skills, experience, education, projects, achievements,
        certifications, publications, volunteering, socialLinks, customSections } = profile || {}

    // Skill categories configuration with animated icons
    const skillCategories = useMemo(() => [
        { key: 'programmingLanguages', label: 'Programming Languages', icon: Terminal, gradient: 'from-blue-500 to-cyan-500' },
        { key: 'frameworks', label: 'Frameworks & Libraries', icon: Layers, gradient: 'from-purple-500 to-pink-500' },
        { key: 'databases', label: 'Databases', icon: Database, gradient: 'from-emerald-500 to-teal-500' },
        { key: 'tools', label: 'Tools', icon: Wrench, gradient: 'from-orange-500 to-amber-500' },
        { key: 'cloudSystems', label: 'Cloud & Systems', icon: Cloud, gradient: 'from-indigo-500 to-violet-500' },
        { key: 'softSkills', label: 'Soft Skills', icon: MessageCircle, gradient: 'from-rose-500 to-pink-500' }
    ], [])

    const allSkills = useMemo(() => [
        ...(skills?.programmingLanguages || []),
        ...(skills?.frameworks || []),
        ...(skills?.databases || []),
        ...(skills?.tools || []),
        ...(skills?.cloudSystems || []),
        ...(skills?.softSkills || [])
    ], [skills])

    // Build tabs only for sections with data
    const tabs = useMemo(() => {
        const tabConfig = [
            { id: 'about', label: 'About', icon: User, show: true },
            { id: 'experience', label: 'Experience', icon: Briefcase, show: experience?.length > 0 },
            { id: 'projects', label: 'Projects', icon: Rocket, show: projects?.length > 0 },
            { id: 'education', label: 'Education', icon: GraduationCap, show: education?.length > 0 },
            { id: 'achievements', label: 'Achievements', icon: Award, show: achievements?.length > 0 },
            { id: 'certifications', label: 'Certifications', icon: Award, show: certifications?.length > 0 },
            { id: 'publications', label: 'Publications', icon: BookOpen, show: publications?.length > 0 },
            { id: 'volunteering', label: 'Volunteering', icon: Heart, show: volunteering?.length > 0 }
        ]

        // Add custom sections
        const customTabs = (customSections || [])
            .filter(s => s.title && s.content)
            .map((s, i) => ({
                id: `custom-${i}`,
                label: s.title,
                icon: Code,
                show: true,
                content: s.content
            }))

        return [...tabConfig.filter(t => t.show), ...customTabs]
    }, [experience, projects, education, achievements, certifications, publications, volunteering, customSections])

    // CSS Variables injection
    const cssVars = {
        '--primary': colors.primary,
        '--secondary': colors.secondary,
        '--bg': colors.bg,
        '--surface': colors.surface,
        '--surfaceSolid': colors.surfaceSolid,
        '--text': colors.text,
        '--textSecondary': colors.textSecondary,
        '--border': colors.border,
        '--glow': colors.glow,
        '--accent': colors.accent
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
                />
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
                <GlassCard className="p-8 text-center max-w-md" style={cssVars}>
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                        <User size={32} className="text-red-400" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>{error}</h2>
                    <p style={{ color: colors.textSecondary }}>The portfolio you're looking for doesn't exist.</p>
                </GlassCard>
            </div>
        )
    }

    return (
        <div className="min-h-screen transition-colors duration-500" style={{ ...cssVars, background: colors.bg }}>
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
                    style={{ background: colors.primary }}
                />
                <motion.div
                    animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15"
                    style={{ background: colors.secondary }}
                />
            </div>

            {/* Theme Toggle - 3D Switch */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="fixed top-6 right-6 z-50 p-2 rounded-2xl backdrop-blur-xl border flex items-center justify-center overflow-hidden group"
                style={{
                    background: colors.surface,
                    borderColor: colors.border,
                    boxShadow: `0 10px 30px -10px ${colors.glow}`
                }}
            >
                <div className="relative w-12 h-6 rounded-full bg-black/10 dark:bg-white/10 p-1 transition-colors">
                    <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="w-4 h-4 rounded-full shadow-lg flex items-center justify-center"
                        style={{
                            background: theme === 'dark' ? colors.primary : '#fbbf24',
                            x: theme === 'dark' ? 24 : 0
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={theme}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                            >
                                {theme === 'dark' ? (
                                    <Moon size={10} className="text-white" />
                                ) : (
                                    <Sun size={10} className="text-white" />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.button>

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Avatar with 3D effect */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                        className="inline-block mb-8"
                        style={{ perspective: '1000px' }}
                    >
                        <div
                            className="relative w-36 h-36 rounded-3xl p-1"
                            style={{
                                background: colors.accent,
                                boxShadow: `0 20px 50px ${colors.glow}`
                            }}
                        >
                            <div
                                className="w-full h-full rounded-[22px] overflow-hidden flex items-center justify-center"
                                style={{ background: colors.surfaceSolid }}
                            >
                                {basicDetails?.profilePhoto ? (
                                    <img src={basicDetails.profilePhoto} alt={basicDetails.name}
                                        className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-bold" style={{
                                        background: colors.accent,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}>
                                        {basicDetails?.name?.charAt(0)?.toUpperCase() || username?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {/* Glow ring */}
                            <div className="absolute inset-0 rounded-3xl animate-pulse"
                                style={{ boxShadow: `0 0 60px ${colors.glow}` }} />
                        </div>
                    </motion.div>

                    {/* Name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{
                            background: colors.accent,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        {basicDetails?.name || username}
                    </motion.h1>

                    {/* Headline */}
                    {basicDetails?.headline && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl mb-4"
                            style={{ color: colors.textSecondary }}
                        >
                            {basicDetails.headline}
                        </motion.p>
                    )}

                    {/* Location */}
                    {basicDetails?.location && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center gap-2 mb-6"
                            style={{ color: colors.textSecondary }}
                        >
                            <MapPin size={16} />
                            <span>{basicDetails.location}</span>
                        </motion.div>
                    )}

                    {/* Social Links */}
                    {socialLinks && Object.values(socialLinks).some(v => v) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center justify-center gap-3 flex-wrap"
                        >
                            {socialLinks.github && (
                                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                                    className="p-3 rounded-xl backdrop-blur-sm border transition-all hover:scale-110"
                                    style={{ background: colors.surface, borderColor: colors.border }}>
                                    <Github size={20} style={{ color: colors.text }} />
                                </a>
                            )}
                            {socialLinks.linkedin && (
                                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                                    className="p-3 rounded-xl backdrop-blur-sm border transition-all hover:scale-110"
                                    style={{ background: colors.surface, borderColor: colors.border }}>
                                    <Linkedin size={20} style={{ color: colors.text }} />
                                </a>
                            )}
                            {socialLinks.twitter && (
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                                    className="p-3 rounded-xl backdrop-blur-sm border transition-all hover:scale-110"
                                    style={{ background: colors.surface, borderColor: colors.border }}>
                                    <Twitter size={20} style={{ color: colors.text }} />
                                </a>
                            )}
                            {socialLinks.website && (
                                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer"
                                    className="p-3 rounded-xl backdrop-blur-sm border transition-all hover:scale-110"
                                    style={{ background: colors.surface, borderColor: colors.border }}>
                                    <Globe size={20} style={{ color: colors.text }} />
                                </a>
                            )}
                            {(socialLinks.email || basicDetails?.email) && (
                                <a href={`mailto:${socialLinks.email || basicDetails.email}`}
                                    className="p-3 rounded-xl backdrop-blur-sm border transition-all hover:scale-110"
                                    style={{ background: colors.surface, borderColor: colors.border }}>
                                    <Mail size={20} style={{ color: colors.text }} />
                                </a>
                            )}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Floating Navigation */}
            <nav className="sticky top-4 z-40 px-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto flex justify-center"
                >
                    <div
                        className="inline-flex items-center gap-1 p-1.5 rounded-2xl backdrop-blur-xl border overflow-x-auto scrollbar-hide"
                        style={{ background: colors.surface, borderColor: colors.border }}
                    >
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.id
                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
                                    style={{ color: isActive ? colors.text : colors.textSecondary }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-xl"
                                            style={{ background: colors.accent }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Icon size={16} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </span>
                                </motion.button>
                            )
                        })}
                    </div>
                </motion.div>
            </nav>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto px-4 pb-20">
                <AnimatePresence mode="wait">
                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            variants={containerVariants}
                        >
                            {/* About Text */}
                            {basicDetails?.about && (
                                <GlassCard className="p-6 mb-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
                                        <User size={20} style={{ color: colors.primary }} />
                                        About
                                    </h2>
                                    <p className="leading-relaxed whitespace-pre-wrap" style={{ color: colors.textSecondary }}>
                                        {basicDetails.about}
                                    </p>
                                </GlassCard>
                            )}

                            {/* Skills - Categorized Display */}
                            {allSkills.length > 0 && (
                                <GlassCard className="p-6">
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: colors.text }}>
                                        <Sparkles size={20} style={{ color: colors.primary }} />
                                        Skills
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {skillCategories.map((category, catIndex) => {
                                            const categorySkills = skills?.[category.key] || []
                                            if (categorySkills.length === 0) return null

                                            return (
                                                <motion.div
                                                    key={category.key}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: catIndex * 0.1 }}
                                                    className="relative overflow-hidden rounded-xl p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] group"
                                                    style={{
                                                        background: 'var(--surface)',
                                                        borderColor: 'var(--border)'
                                                    }}
                                                >
                                                    {/* Glow effect on hover */}
                                                    <div
                                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                                                        style={{ boxShadow: `inset 0 0 30px var(--glow)` }}
                                                    />

                                                    <div className="flex items-center gap-3 mb-3 relative z-10">
                                                        <motion.div
                                                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}
                                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                                            transition={{ type: 'spring', stiffness: 400 }}
                                                        >
                                                            <category.icon size={18} className="text-white" />
                                                        </motion.div>
                                                        <h3 className="font-medium text-sm" style={{ color: colors.text }}>
                                                            {category.label}
                                                        </h3>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 relative z-10">
                                                        {categorySkills.map((skill, i) => (
                                                            <motion.span
                                                                key={i}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: (catIndex * 0.1) + (i * 0.03) }}
                                                                className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm border cursor-default transition-all duration-200 hover:scale-105"
                                                                style={{
                                                                    background: `rgba(${colors.primary === '#6366f1' ? '99, 102, 241' : colors.primary === '#ec4899' ? '236, 72, 153' : colors.primary === '#0d9488' ? '13, 148, 136' : '99, 102, 241'}, 0.15)`,
                                                                    borderColor: 'var(--border)',
                                                                    color: colors.primary
                                                                }}
                                                            >
                                                                {skill}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </GlassCard>
                            )}
                        </motion.div>
                    )}

                    {/* Experience Tab */}
                    {activeTab === 'experience' && experience?.length > 0 && (
                        <motion.div
                            key="experience"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            variants={containerVariants}
                        >
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.accent }}>
                                    <Briefcase size={20} className="text-white" />
                                </div>
                                Work Experience
                            </h2>
                            <div>
                                {experience.map((exp, i) => (
                                    <TimelineItem
                                        key={i}
                                        item={exp}
                                        type="experience"
                                        index={i}
                                        isLast={i === experience.length - 1}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && projects?.length > 0 && (
                        <motion.div
                            key="projects"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            variants={containerVariants}
                        >
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.accent }}>
                                    <Rocket size={20} className="text-white" />
                                </div>
                                Projects
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {projects.map((project, i) => (
                                    <ProjectCard key={i} project={project} index={i} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Education Tab */}
                    {activeTab === 'education' && education?.length > 0 && (
                        <motion.div
                            key="education"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            variants={containerVariants}
                        >
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.accent }}>
                                    <GraduationCap size={20} className="text-white" />
                                </div>
                                Education
                            </h2>
                            <div>
                                {education.map((edu, i) => (
                                    <TimelineItem
                                        key={i}
                                        item={edu}
                                        type="education"
                                        index={i}
                                        isLast={i === education.length - 1}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Achievements Tab */}
                    {activeTab === 'achievements' && achievements?.length > 0 && (
                        <motion.div
                            key="achievements"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            variants={containerVariants}
                        >
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.accent }}>
                                    <Award size={20} className="text-white" />
                                </div>
                                Achievements
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {achievements.map((achievement, i) => (
                                    <motion.div
                                        key={i}
                                        variants={itemVariants}
                                    >
                                        <GlassCard className="p-5 h-full">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: colors.accent }}>
                                                    <Award size={18} className="text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold mb-1" style={{ color: colors.text }}>
                                                        {achievement.title}
                                                    </h3>
                                                    {achievement.date && (
                                                        <div className="flex items-center gap-1.5 text-xs" style={{ color: colors.textSecondary }}>
                                                            <Calendar size={12} />
                                                            {achievement.date}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {achievement.description && (
                                                <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                                                    {achievement.description}
                                                </p>
                                            )}
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Certifications Tab */}
                    {activeTab === 'certifications' && certifications?.length > 0 && (
                        <motion.div
                            key="certifications"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            variants={containerVariants}
                        >
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.accent }}>
                                    <Award size={20} className="text-white" />
                                </div>
                                Certifications
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {certifications.map((cert, i) => (
                                    <GlassCard key={i} className="p-5">
                                        <h3 className="font-semibold mb-2" style={{ color: colors.text }}>{cert.name}</h3>
                                        <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>{cert.issuer}</p>
                                        {cert.date && (
                                            <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                                                <Calendar size={14} />
                                                {cert.date}
                                            </div>
                                        )}
                                        {cert.credentialUrl && (
                                            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 mt-3 text-sm font-medium"
                                                style={{ color: colors.primary }}>
                                                View Credential <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Publications Tab */}
                    {activeTab === 'publications' && publications?.length > 0 && (
                        <motion.div
                            key="publications"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            variants={containerVariants}
                        >
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.accent }}>
                                    <BookOpen size={20} className="text-white" />
                                </div>
                                Publications
                            </h2>
                            <div className="space-y-4">
                                {publications.map((pub, i) => (
                                    <GlassCard key={i} className="p-5">
                                        <h3 className="font-semibold mb-2" style={{ color: colors.text }}>{pub.title}</h3>
                                        <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                                            {pub.publisher} {pub.date && `• ${pub.date}`}
                                        </p>
                                        {pub.description && (
                                            <p className="text-sm" style={{ color: colors.textSecondary }}>{pub.description}</p>
                                        )}
                                        {pub.url && (
                                            <a href={pub.url} target="_blank" rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 mt-3 text-sm font-medium"
                                                style={{ color: colors.primary }}>
                                                Read Publication <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Volunteering Tab */}
                    {activeTab === 'volunteering' && volunteering?.length > 0 && (
                        <motion.div
                            key="volunteering"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            variants={containerVariants}
                        >
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.accent }}>
                                    <Heart size={20} className="text-white" />
                                </div>
                                Volunteering
                            </h2>
                            <div className="space-y-4">
                                {volunteering.map((vol, i) => (
                                    <GlassCard key={i} className="p-5">
                                        <h3 className="font-semibold mb-1" style={{ color: colors.text }}>{vol.role}</h3>
                                        <p className="text-sm mb-2" style={{ color: colors.primary }}>{vol.organization}</p>
                                        {vol.duration && (
                                            <div className="flex items-center gap-2 text-sm mb-2" style={{ color: colors.textSecondary }}>
                                                <Calendar size={14} />
                                                {vol.duration}
                                            </div>
                                        )}
                                        {vol.description && (
                                            <p className="text-sm" style={{ color: colors.textSecondary }}>{vol.description}</p>
                                        )}
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Custom Sections */}
                    {activeTab.startsWith('custom-') && (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {(() => {
                                const customTab = tabs.find(t => t.id === activeTab)
                                if (!customTab) return null
                                return (
                                    <GlassCard className="p-6">
                                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" style={{ color: colors.text }}>
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.accent }}>
                                                <Code size={20} className="text-white" />
                                            </div>
                                            {customTab.label}
                                        </h2>
                                        <p className="leading-relaxed whitespace-pre-wrap" style={{ color: colors.textSecondary }}>
                                            {customTab.content}
                                        </p>
                                    </GlassCard>
                                )
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer - Glassy Portlify Branding or Custom Branding */}
            <footer className="relative py-12 px-4">
                {/* Subtle gradient separator */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 max-w-md h-px"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${colors.primary}40, transparent)`
                    }}
                />

                <div className="max-w-4xl mx-auto flex justify-center">
                    {/* Check if custom branding is enabled */}
                    {profile?.customBranding?.enabled && profile?.customBranding?.text ? (
                        // Custom Branding Footer
                        <motion.a
                            href={profile.customBranding.url || '#'}
                            target={profile.customBranding.url ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="group relative"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            onClick={(e) => !profile.customBranding.url && e.preventDefault()}
                        >
                            {/* Glow effect on hover */}
                            <div
                                className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                                style={{ background: colors.accent }}
                            />

                            {/* Glass card container */}
                            <div
                                className="relative px-6 py-3 rounded-xl backdrop-blur-xl border transition-all duration-300 overflow-hidden"
                                style={{
                                    background: colors.surface,
                                    borderColor: colors.border,
                                    boxShadow: `0 4px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px ${colors.border}`
                                }}
                            >
                                {/* Content */}
                                <div className="relative flex items-center gap-3">
                                    {/* Custom text */}
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: colors.text }}
                                    >
                                        {profile.customBranding.text}
                                    </span>

                                    {/* Arrow indicator if URL exists */}
                                    {profile.customBranding.url && (
                                        <ChevronRight
                                            size={16}
                                            className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                                            style={{ color: colors.primary }}
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.a>
                    ) : (
                        // Default Portlify Branding
                        <div className="relative">
                            {/* Premium Info Badge */}
                            <div
                                className="absolute -top-2 -left-2 z-20"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <motion.button
                                    className="w-5 h-5 rounded-full flex items-center justify-center shadow-lg cursor-help"
                                    style={{ background: colors.primary, color: '#fff' }}
                                    whileHover={{ scale: 1.1 }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setShowPremiumInfo(!showPremiumInfo)
                                    }}
                                >
                                    <Info size={12} strokeWidth={3} />
                                </motion.button>

                                <AnimatePresence>
                                    {showPremiumInfo && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 p-4 rounded-xl backdrop-blur-xl border text-xs text-center shadow-xl z-30"
                                            style={{
                                                background: colors.surfaceSolid,
                                                color: colors.text,
                                                borderColor: colors.border
                                            }}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <p className="mb-2 leading-relaxed">
                                                You can customize or remove this branding by buying a premium membership.
                                            </p>
                                            <a
                                                href="https://portlify.techycsr.dev/premium"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="block py-1.5 px-3 rounded-lg font-bold transition-opacity hover:opacity-80"
                                                style={{ background: colors.primary, color: '#fff' }}
                                            >
                                                Click here to upgrade
                                            </a>
                                            <div
                                                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b border-r"
                                                style={{
                                                    background: colors.surfaceSolid,
                                                    borderColor: colors.border
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.a
                                href="https://portlify.techycsr.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative block"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                {/* Glow effect on hover */}
                                <div
                                    className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                                    style={{ background: colors.accent }}
                                />

                                {/* Glass card container */}
                                <div
                                    className="relative px-6 py-3 rounded-xl backdrop-blur-xl border transition-all duration-300 overflow-hidden"
                                    style={{
                                        background: colors.surface,
                                        borderColor: colors.border,
                                        boxShadow: `0 4px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px ${colors.border}`
                                    }}
                                >
                                    {/* Inner shine effect */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{
                                            background: `linear-gradient(135deg, transparent 40%, ${colors.primary}10 50%, transparent 60%)`,
                                        }}
                                    />

                                    {/* Animated gradient border on hover */}
                                    <div
                                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            padding: '1px',
                                            background: colors.accent,
                                            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                            maskComposite: 'xor',
                                            WebkitMaskComposite: 'xor'
                                        }}
                                    />

                                    {/* Content */}
                                    <div className="relative flex items-center gap-3">
                                        {/* Logo/Icon */}
                                        <motion.div
                                            className="relative"
                                            animate={{ rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{
                                                    background: colors.accent,
                                                    boxShadow: `0 4px 12px ${colors.glow}`
                                                }}
                                            >
                                                <Sparkles size={16} className="text-white" />
                                            </div>
                                        </motion.div>

                                        {/* Text */}
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-sm"
                                                style={{ color: colors.textSecondary }}
                                            >
                                                Built with
                                            </span>
                                            <span
                                                className="font-semibold text-sm bg-clip-text text-transparent"
                                                style={{
                                                    backgroundImage: colors.accent,
                                                    WebkitBackgroundClip: 'text'
                                                }}
                                            >
                                                Portlify
                                            </span>
                                        </div>

                                        {/* Arrow indicator */}
                                        <ChevronRight
                                            size={16}
                                            className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                                            style={{ color: colors.primary }}
                                        />
                                    </div>
                                </div>
                            </motion.a>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    )
}

export default Portfolio
