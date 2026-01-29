import { motion } from 'framer-motion'

function ProfileCard({ profile }) {
    if (!profile) return null

    const { name, headline, about, skills, socialLinks } = profile

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-8 md:p-10"
        >
            {/* Header */}
            <div className="text-center mb-8">
                {/* Avatar placeholder */}
                <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center ring-4 ring-white/10">
                    <span className="text-4xl font-bold text-white">
                        {name ? name.charAt(0).toUpperCase() : '?'}
                    </span>
                </div>

                <h1 className="text-3xl font-display font-bold heading-gradient mb-2">
                    {name || 'Your Name'}
                </h1>

                {headline && (
                    <p className="text-xl text-primary-300">
                        {headline}
                    </p>
                )}
            </div>

            {/* About */}
            {about && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                        About
                    </h2>
                    <p className="text-dark-300 leading-relaxed pl-11">
                        {about}
                    </p>
                </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </span>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2 pl-11">
                        {skills.map((skill, index) => (
                            <motion.span
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 
                           text-sm font-medium text-white border border-white/10
                           hover:from-primary-500/30 hover:to-accent-500/30 transition-all cursor-default"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}

            {/* Social Links */}
            {socialLinks && Object.values(socialLinks).some(v => v) && (
                <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-center gap-4">
                        {socialLinks.linkedin && (
                            <a
                                href={socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center hover:bg-primary-500/20 transition-colors"
                            >
                                <svg className="w-5 h-5 text-dark-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        )}
                        {socialLinks.github && (
                            <a
                                href={socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center hover:bg-primary-500/20 transition-colors"
                            >
                                <svg className="w-5 h-5 text-dark-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        )}
                        {socialLinks.twitter && (
                            <a
                                href={socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center hover:bg-primary-500/20 transition-colors"
                            >
                                <svg className="w-5 h-5 text-dark-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        )}
                        {socialLinks.website && (
                            <a
                                href={socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center hover:bg-primary-500/20 transition-colors"
                            >
                                <svg className="w-5 h-5 text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default ProfileCard
