import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPublicProfile } from '../utils/api'

function Portfolio() {
    const { username } = useParams()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

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
                <div className="spinner" />
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

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-3xl p-8 md:p-12 mb-8 text-center"
                >
                    {/* Avatar */}
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center ring-4 ring-white/10 shadow-xl shadow-primary-500/20">
                        <span className="text-5xl font-bold text-white">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : username.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {/* Name & Headline */}
                    <h1 className="text-4xl font-display font-bold heading-gradient mb-2">
                        {profile.name || username}
                    </h1>
                    {profile.headline && (
                        <p className="text-xl text-primary-300 mb-4">
                            {profile.headline}
                        </p>
                    )}

                    {/* Social Links */}
                    {profile.socialLinks && Object.values(profile.socialLinks).some(v => v) && (
                        <div className="flex justify-center gap-3 mt-6">
                            {profile.socialLinks.linkedin && (
                                <a
                                    href={profile.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl bg-dark-700/50 flex items-center justify-center hover:bg-primary-500/20 hover:scale-110 transition-all"
                                >
                                    <svg className="w-6 h-6 text-dark-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            )}
                            {profile.socialLinks.github && (
                                <a
                                    href={profile.socialLinks.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl bg-dark-700/50 flex items-center justify-center hover:bg-primary-500/20 hover:scale-110 transition-all"
                                >
                                    <svg className="w-6 h-6 text-dark-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            )}
                            {profile.socialLinks.twitter && (
                                <a
                                    href={profile.socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl bg-dark-700/50 flex items-center justify-center hover:bg-primary-500/20 hover:scale-110 transition-all"
                                >
                                    <svg className="w-6 h-6 text-dark-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                            )}
                            {profile.socialLinks.website && (
                                <a
                                    href={profile.socialLinks.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl bg-dark-700/50 flex items-center justify-center hover:bg-primary-500/20 hover:scale-110 transition-all"
                                >
                                    <svg className="w-6 h-6 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* About Section */}
                {profile.about && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-3xl p-8 mb-8"
                    >
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                            <span className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            About
                        </h2>
                        <p className="text-dark-300 leading-relaxed pl-13">
                            {profile.about}
                        </p>
                    </motion.div>
                )}

                {/* Skills Section */}
                {profile.skills && profile.skills.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card rounded-3xl p-8 mb-8"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                            <span className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </span>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {profile.skills.map((skill, index) => (
                                <motion.span
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + index * 0.03 }}
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 
                             text-white font-medium border border-white/10
                             hover:from-primary-500/30 hover:to-accent-500/30 transition-all cursor-default"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Experience Section */}
                {profile.experience && profile.experience.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card rounded-3xl p-8 mb-8"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                            <span className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {profile.experience.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="relative pl-6 border-l-2 border-dark-600"
                                >
                                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary-500" />
                                    <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                                    {exp.company && (
                                        <p className="text-primary-300">{exp.company}</p>
                                    )}
                                    {exp.duration && (
                                        <p className="text-dark-400 text-sm mt-1">{exp.duration}</p>
                                    )}
                                    {exp.description && (
                                        <p className="text-dark-300 mt-2">{exp.description}</p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Education Section */}
                {profile.education && profile.education.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card rounded-3xl p-8"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                            <span className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                </svg>
                            </span>
                            Education
                        </h2>
                        <div className="space-y-4">
                            {profile.education.map((edu, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="p-4 rounded-xl bg-dark-800/30"
                                >
                                    <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                                    {edu.institution && (
                                        <p className="text-primary-300">{edu.institution}</p>
                                    )}
                                    {edu.year && (
                                        <p className="text-dark-400 text-sm mt-1">{edu.year}</p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <p className="text-dark-500 text-sm">
                        Built with <span className="text-primary-400">Portlify</span>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Portfolio
