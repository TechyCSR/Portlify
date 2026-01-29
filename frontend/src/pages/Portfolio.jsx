import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPublicProfile } from '../utils/api'

function Portfolio() {
    const { username } = useParams()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('about')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getPublicProfile(username)
                setProfile(data)
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
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-full border-4 border-primary-500/30 border-t-primary-500"
                />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-800 flex items-center justify-center">
                        <svg className="w-12 h-12 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">{error}</h1>
                    <p className="text-dark-400 mb-6">
                        The portfolio you're looking for doesn't exist or isn't public.
                    </p>
                    <Link to="/" className="btn-primary">
                        Go Home
                    </Link>
                </motion.div>
            </div>
        )
    }

    const { basicDetails, skills, experience, education, projects, achievements, extraCurricular, socialLinks } = profile
    const allSkills = [...(skills?.technical || []), ...(skills?.tools || []), ...(skills?.soft || []), ...(skills?.languages || [])]

    const tabs = [
        { id: 'about', label: 'About' },
        { id: 'experience', label: 'Experience', count: experience?.length },
        { id: 'projects', label: 'Projects', count: projects?.length },
        { id: 'education', label: 'Education', count: education?.length },
        { id: 'achievements', label: 'Achievements', count: achievements?.length },
    ].filter(t => !t.count || t.count > 0 || t.id === 'about')

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 to-transparent" />

                <div className="relative max-w-5xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="relative inline-block mb-6"
                        >
                            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1 shadow-2xl shadow-primary-500/30">
                                <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center overflow-hidden">
                                    {basicDetails?.profilePhoto ? (
                                        <img src={basicDetails.profilePhoto} alt={basicDetails.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl font-bold text-white">
                                            {basicDetails?.name?.charAt(0)?.toUpperCase() || username?.charAt(0)?.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                                <span className="text-green-400 text-xs font-medium">● Available</span>
                            </div>
                        </motion.div>

                        {/* Name & Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-display font-bold heading-gradient mb-3"
                        >
                            {basicDetails?.name || username}
                        </motion.h1>

                        {basicDetails?.headline && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl text-primary-300 mb-4"
                            >
                                {basicDetails.headline}
                            </motion.p>
                        )}

                        {basicDetails?.location && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-dark-400 flex items-center justify-center gap-2"
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
                                className="flex justify-center gap-3 mt-6"
                            >
                                {socialLinks.linkedin && (
                                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-primary-500/20 hover:scale-110 transition-all group">
                                        <svg className="w-5 h-5 text-dark-400 group-hover:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    </a>
                                )}
                                {socialLinks.github && (
                                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-primary-500/20 hover:scale-110 transition-all group">
                                        <svg className="w-5 h-5 text-dark-400 group-hover:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </a>
                                )}
                                {socialLinks.twitter && (
                                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-primary-500/20 hover:scale-110 transition-all group">
                                        <svg className="w-5 h-5 text-dark-400 group-hover:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                )}
                                {socialLinks.website && (
                                    <a href={socialLinks.website} target="_blank" rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-primary-500/20 hover:scale-110 transition-all group">
                                        <svg className="w-5 h-5 text-dark-400 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                    </a>
                                )}
                                {socialLinks.email && (
                                    <a href={`mailto:${socialLinks.email}`}
                                        className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:bg-primary-500/20 hover:scale-110 transition-all group">
                                        <svg className="w-5 h-5 text-dark-400 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </a>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Skills Bar */}
            {allSkills.length > 0 && (
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="py-6 border-y border-white/5 overflow-hidden"
                >
                    <div className="flex gap-4 animate-scroll">
                        {[...allSkills, ...allSkills].map((skill, i) => (
                            <span
                                key={i}
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-white/5 text-sm text-dark-300 whitespace-nowrap"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Tab Navigation */}
            <section className="py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-primary-500 text-white'
                                        : 'glass text-dark-400 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                                {tab.count && <span className="ml-2 text-xs opacity-70">({tab.count})</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="px-4 pb-16">
                <div className="max-w-5xl mx-auto">
                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {basicDetails?.about && (
                                <div className="glass-card rounded-3xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
                                    <p className="text-dark-300 leading-relaxed text-lg">{basicDetails.about}</p>
                                </div>
                            )}

                            {/* Skills Grid */}
                            {allSkills.length > 0 && (
                                <div className="glass-card rounded-3xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">Skills & Expertise</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {skills?.technical?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium text-primary-400 mb-3 uppercase tracking-wide">Technical</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.technical.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-primary-500/20 text-primary-300 text-sm">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {skills?.tools?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium text-accent-400 mb-3 uppercase tracking-wide">Tools & Platforms</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.tools.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-accent-500/20 text-accent-300 text-sm">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {skills?.soft?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium text-green-400 mb-3 uppercase tracking-wide">Soft Skills</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.soft.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 text-sm">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {skills?.languages?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium text-yellow-400 mb-3 uppercase tracking-wide">Languages</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {skills.languages.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-300 text-sm">{skill}</span>
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
                                    className="glass-card rounded-2xl p-6 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-accent-500" />
                                    <div className="pl-4">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                                            <span className="text-dark-500 text-sm">{exp.duration}</span>
                                        </div>
                                        <p className="text-primary-400 font-medium mb-1">{exp.company}</p>
                                        {exp.location && <p className="text-dark-500 text-sm mb-3">{exp.location}</p>}
                                        {exp.description && <p className="text-dark-300">{exp.description}</p>}
                                        {exp.achievements?.length > 0 && (
                                            <ul className="mt-3 space-y-1">
                                                {exp.achievements.map((ach, i) => (
                                                    <li key={i} className="text-dark-400 text-sm flex items-start gap-2">
                                                        <span className="text-primary-400 mt-1">•</span>
                                                        {ach}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
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
                                    whileHover={{ y: -5 }}
                                    className="glass-card rounded-2xl p-6 group"
                                >
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                                        {proj.title}
                                    </h3>
                                    <p className="text-dark-400 mb-4 line-clamp-3">{proj.description}</p>

                                    {proj.techStack?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {proj.techStack.map((tech, i) => (
                                                <span key={i} className="px-2 py-1 rounded-md bg-dark-700/50 text-dark-300 text-xs">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        {proj.demoUrl && (
                                            <a
                                                href={proj.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Live Demo
                                            </a>
                                        )}
                                        {proj.githubUrl && (
                                            <a
                                                href={proj.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-dark-400 hover:text-white text-sm font-medium"
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
                                    className="glass-card rounded-2xl p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-1">{edu.degree}</h3>
                                            <p className="text-primary-400 font-medium">{edu.institution}</p>
                                            <div className="flex items-center gap-4 mt-2 text-dark-500 text-sm">
                                                {edu.year && <span>{edu.year}</span>}
                                                {edu.gpa && <span>• {edu.gpa}</span>}
                                            </div>
                                            {edu.coursework?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {edu.coursework.map((course, i) => (
                                                        <span key={i} className="px-2 py-1 rounded-md bg-dark-700/50 text-dark-400 text-xs">
                                                            {course}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Achievements Tab */}
                    {activeTab === 'achievements' && achievements?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            {achievements.map((ach, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card rounded-2xl p-6"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl">🏆</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{ach.title}</h3>
                                            {ach.date && <p className="text-dark-500 text-sm mb-2">{ach.date}</p>}
                                            {ach.description && <p className="text-dark-400">{ach.description}</p>}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-white/5 text-center">
                <p className="text-dark-500 text-sm">
                    Built with <span className="text-primary-400 font-medium">Portlify</span>
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
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    )
}

export default Portfolio
