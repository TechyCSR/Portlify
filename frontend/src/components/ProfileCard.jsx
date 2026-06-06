import { motion } from 'framer-motion'
import { Globe, Github, Linkedin, Lightbulb, Twitter, User } from 'lucide-react'
import { IconTile, InlineIcon, ICON_STROKE } from './IconTile'

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
            <div className="text-center mb-8">
                <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                        {name ? name.charAt(0).toUpperCase() : '?'}
                    </span>
                </div>

                <h1 className="text-3xl font-display font-bold heading-gradient mb-2">
                    {name || 'Your Name'}
                </h1>

                {headline && (
                    <p className="text-xl text-secondary">
                        {headline}
                    </p>
                )}
            </div>

            {about && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-3">
                        <IconTile icon={User} className="w-8 h-8" size={16} />
                        About
                    </h2>
                    <p className="text-secondary leading-relaxed pl-11">
                        {about}
                    </p>
                </div>
            )}

            {skills && skills.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-3">
                        <IconTile icon={Lightbulb} className="w-8 h-8" size={16} />
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2 pl-11">
                        {skills.map((skill, index) => (
                            <motion.span
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-4 py-2 rounded-md bg-tertiary text-sm font-medium text-secondary"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}

            {socialLinks && Object.values(socialLinks).some(v => v) && (
                <div className="pt-6">
                    <div className="flex justify-center gap-3">
                        {socialLinks.linkedin && (
                            <a
                                href={socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-tertiary flex items-center justify-center hover:bg-surface-hover transition-colors"
                            >
                                <Linkedin size={18} strokeWidth={ICON_STROKE} className="text-secondary" />
                            </a>
                        )}
                        {socialLinks.github && (
                            <a
                                href={socialLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-tertiary flex items-center justify-center hover:bg-surface-hover transition-colors"
                            >
                                <Github size={18} strokeWidth={ICON_STROKE} className="text-secondary" />
                            </a>
                        )}
                        {socialLinks.twitter && (
                            <a
                                href={socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-tertiary flex items-center justify-center hover:bg-surface-hover transition-colors"
                            >
                                <Twitter size={18} strokeWidth={ICON_STROKE} className="text-secondary" />
                            </a>
                        )}
                        {socialLinks.website && (
                            <a
                                href={socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-tertiary flex items-center justify-center hover:bg-surface-hover transition-colors"
                            >
                                <Globe size={18} strokeWidth={ICON_STROKE} className="text-secondary" />
                            </a>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default ProfileCard