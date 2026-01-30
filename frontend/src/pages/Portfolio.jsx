import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPublicProfile, trackPortfolioView } from '../utils/api'
import { useTheme } from '../context/ThemeContext'

// SVG Icons for tabs
const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
)

const BriefcaseIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
)

const RocketIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
)

const AcademicIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
)

function Portfolio() {
    const { username } = useParams()
    const { theme, toggleTheme } = useTheme()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('about')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getPublicProfile(username)
                setProfile(data)

                // Track the view (fire and forget)
                try {
                    const referrer = document.referrer || 'direct'
                    trackPortfolioView(username, referrer)
                } catch (e) {
                    // Silently fail - analytics shouldn't break the page
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('Profile not found')
                } else {
                    setError('Failed to load profile')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [username])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-full border-4 border-t-transparent"
                    style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary-500)' }}
                />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--color-bg-secondary)' }}>
                        <svg className="w-12 h-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-2">{error}</h1>
                    <p className="text-secondary mb-6">
                        The portfolio you're looking for doesn't exist.
                    </p>
                    <Link to="/" className="btn-primary">
                        Go Home
                    </Link>
                </motion.div>
            </div>
        )
    }

    const { basicDetails, skills, experience, education, projects, socialLinks } = profile
    const allSkills = [...(skills?.technical || []), ...(skills?.tools || []), ...(skills?.soft || [])]

    const tabs = [
        { id: 'about', label: 'About', icon: <UserIcon /> },
        { id: 'experience', label: 'Experience', icon: <BriefcaseIcon />, count: experience?.length },
        { id: 'projects', label: 'Projects', icon: <RocketIcon />, count: projects?.length },
        { id: 'education', label: 'Education', icon: <AcademicIcon />, count: education?.length },
    ].filter(t => !t.count || t.count > 0 || t.id === 'about')

    return (
        <div className="min-h-screen bg-primary">
            {/* Theme toggle - floating */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                onClick={toggleTheme}
                className="fixed top-6 right-6 z-50 p-3 rounded-xl glass"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? (
                    <svg className="w-5 h-5" style={{ color: 'var(--color-primary-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
            </motion.button>

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 opacity-20" style={{ background: 'var(--gradient-primary)' }} />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Avatar - Clean design without badge */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-block mb-8"
                        >
                            <div className="w-36 h-36 rounded-3xl p-1 shadow-2xl"
                                style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-glow)' }}>
                                <div className="w-full h-full rounded-[22px] flex items-center justify-center overflow-hidden"
                                    style={{ background: 'var(--color-bg-primary)' }}>
                                    {basicDetails?.profilePhoto ? (
                                        <img src={basicDetails.profilePhoto} alt={basicDetails.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl font-bold heading-gradient">
                                            {basicDetails?.name?.charAt(0)?.toUpperCase() || username?.charAt(0)?.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Name & Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-display font-bold heading-gradient mb-4"
                        >
                            {basicDetails?.name || username}
                        </motion.h1>

                        {basicDetails?.headline && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl text-secondary mb-4"
                            >
                                {basicDetails.headline}
                            </motion.p>
                        )}

                        {basicDetails?.location && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-tertiary flex items-center justify-center gap-2 mb-6"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {basicDetails.location}
                            </motion.p>
                        )}

                        {/* Social Links */}
                        {socialLinks && Object.values(socialLinks).some(v => v) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex justify-center gap-3"
                            >
                                {socialLinks.linkedin && (
                                    <a href={socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://${socialLinks.linkedin}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-xl bg-surface border flex items-center justify-center hover:scale-110 hover:border-primary-500/50 transition-all"
                                        style={{ borderColor: 'var(--color-border)' }}>
                                        <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                )}
                                {socialLinks.github && (
                                    <a href={socialLinks.github.startsWith('http') ? socialLinks.github : `https://${socialLinks.github}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-xl bg-surface border flex items-center justify-center hover:scale-110 hover:border-primary-500/50 transition-all"
                                        style={{ borderColor: 'var(--color-border)' }}>
                                        <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                )}
                                {socialLinks.twitter && (
                                    <a href={socialLinks.twitter.startsWith('http') ? socialLinks.twitter : `https://${socialLinks.twitter}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-xl bg-surface border flex items-center justify-center hover:scale-110 hover:border-primary-500/50 transition-all"
                                        style={{ borderColor: 'var(--color-border)' }}>
                                        <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                )}
                                {socialLinks.website && (
                                    <a href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-xl bg-surface border flex items-center justify-center hover:scale-110 hover:border-primary-500/50 transition-all"
                                        style={{ borderColor: 'var(--color-border)' }}>
                                        <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                    </a>
                                )}
                                {(socialLinks.email || basicDetails?.email) && (
                                    <a href={`mailto:${socialLinks.email || basicDetails?.email}`}
                                        className="w-11 h-11 rounded-xl bg-surface border flex items-center justify-center hover:scale-110 hover:border-primary-500/50 transition-all"
                                        style={{ borderColor: 'var(--color-border)' }}>
                                        <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </a>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Skills Bar - animated scroll */}
            {allSkills.length > 0 && (
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="py-6 overflow-hidden"
                    style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
                >
                    <div className="flex gap-4 animate-scroll">
                        {[...allSkills, ...allSkills].map((skill, i) => (
                            <span
                                key={i}
                                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border"
                                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Tab Navigation */}
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                        {tabs.map(tab => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                    ? 'text-white'
                                    : 'bg-surface border text-secondary hover:border-primary-500/50'
                                    }`}
                                style={activeTab === tab.id
                                    ? { background: 'var(--gradient-primary)' }
                                    : { borderColor: 'var(--color-border)' }}
                            >
                                {tab.icon}
                                {tab.label}
                                {tab.count !== undefined && <span className="opacity-70">({tab.count})</span>}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="px-4 pb-16">
                <div className="max-w-4xl mx-auto">
                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {basicDetails?.about && (
                                <div className="rounded-2xl p-8 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                    <h2 className="text-2xl font-bold text-primary mb-4">About Me</h2>
                                    <p className="text-secondary leading-relaxed text-lg">{basicDetails.about}</p>
                                </div>
                            )}

                            {/* Skills Grid */}
                            {allSkills.length > 0 && (
                                <div className="rounded-2xl p-8 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                                    <h2 className="text-2xl font-bold text-primary mb-6">Skills & Expertise</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {skills?.technical?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-primary-400">
                                                    Technical
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.technical.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                                            style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-primary-400)' }}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {skills?.tools?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide text-purple-400">
                                                    Tools & Platforms
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.tools.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                                            style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'rgb(192, 132, 252)' }}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {skills?.soft?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wide">Soft Skills</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.soft.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                                            style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'rgb(52, 211, 153)' }}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {skills?.languages?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wide">Languages</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.languages.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-medium"
                                                            style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'rgb(251, 191, 36)' }}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Experience Tab */}
                    {activeTab === 'experience' && experience?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {experience.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="rounded-2xl p-6 border relative overflow-hidden"
                                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: 'var(--gradient-primary)' }} />
                                    <div className="pl-4">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-primary">{exp.title}</h3>
                                            <span className="text-muted text-sm px-3 py-1 rounded-full" style={{ background: 'var(--color-bg-tertiary)' }}>
                                                {exp.duration}
                                            </span>
                                        </div>
                                        <p className="font-medium heading-gradient mb-1">{exp.company}</p>
                                        {exp.location && <p className="text-muted text-sm mb-3">{exp.location}</p>}
                                        {exp.description && <p className="text-secondary">{exp.description}</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && projects?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            {projects.map((proj, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="rounded-2xl p-6 border group transition-all"
                                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                                >
                                    <h3 className="text-xl font-bold text-primary mb-2 group-hover:heading-gradient transition-colors">
                                        {proj.title}
                                    </h3>
                                    <p className="text-tertiary mb-4 line-clamp-3">{proj.description}</p>

                                    {proj.techStack?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {proj.techStack.map((tech, i) => (
                                                <span key={i} className="px-2 py-1 rounded-md text-xs font-medium"
                                                    style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-tertiary)' }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        {proj.demoUrl && (
                                            <a
                                                href={proj.demoUrl.startsWith('http') ? proj.demoUrl : `https://${proj.demoUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Live Demo
                                            </a>
                                        )}
                                        {proj.githubUrl && (
                                            <a
                                                href={proj.githubUrl.startsWith('http') ? proj.githubUrl : `https://${proj.githubUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-tertiary hover:text-primary text-sm font-medium transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                                Code
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Education Tab */}
                    {activeTab === 'education' && education?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {education.map((edu, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="rounded-2xl p-6 border"
                                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                                            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-primary mb-1">{edu.degree}</h3>
                                            <p className="font-medium heading-gradient">{edu.institution}</p>
                                            <div className="flex items-center gap-4 mt-2 text-muted text-sm">
                                                {edu.year && <span>{edu.year}</span>}
                                                {edu.gpa && <span>• {edu.gpa}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
                <p className="text-muted text-sm">
                    Built with <span className="heading-gradient font-medium">Portlify</span>
                </p>
            </footer>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
            `}</style>
        </div>
    )
}

export default Portfolio
