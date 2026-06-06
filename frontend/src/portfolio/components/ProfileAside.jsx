import {
    Download,
    Github,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react'
import { ICON_STROKE } from '../../components/IconTile'
import { safeHref, safeMailto } from '../../utils/safeUrl'

function SocialButton({ href, label, icon: Icon, compact = false }) {
    if (!href) return null
    return (
        <a
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={label}
            className={`inline-flex items-center justify-center rounded-xl transition-colors portfolio-chip portfolio-touch-target ${compact ? 'w-11 h-11' : 'w-10 h-10 lg:w-10 lg:h-10'}`}
        >
            <Icon size={18} strokeWidth={ICON_STROKE} className="portfolio-text" />
        </a>
    )
}

function ProfilePhoto({ basicDetails, username, className = '' }) {
    return (
        <div className={`portfolio-surface-raised rounded-2xl overflow-hidden flex items-center justify-center border-2 border-[var(--pf-border)] flex-shrink-0 ${className}`}>
            {basicDetails?.profilePhoto ? (
                <img
                    src={basicDetails.profilePhoto}
                    alt={basicDetails.name || username}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="text-3xl sm:text-4xl font-bold portfolio-link">
                    {basicDetails?.name?.charAt(0)?.toUpperCase() || username?.charAt(0)?.toUpperCase()}
                </span>
            )}
        </div>
    )
}

function ProfileAside({
    username,
    basicDetails,
    socialLinks,
    resumeUrl,
    sections,
    activeSection,
    onNavigate,
}) {
    const email = socialLinks?.email || basicDetails?.email
    const mailto = safeMailto(email)
    const resumeLink = safeHref(resumeUrl)

    const socialButtons = (
        <>
            <SocialButton href={safeHref(socialLinks?.github)} label="GitHub" icon={Github} compact />
            <SocialButton href={safeHref(socialLinks?.linkedin)} label="LinkedIn" icon={Linkedin} compact />
            <SocialButton href={safeHref(socialLinks?.twitter)} label="Twitter" icon={Twitter} compact />
            <SocialButton href={safeHref(socialLinks?.website)} label="Website" icon={Globe} compact />
        </>
    )

    return (
        <aside className="lg:min-h-0 lg:overflow-visible">
            <div className="portfolio-surface rounded-2xl p-4 sm:p-5 lg:p-6 lg:h-full lg:flex lg:flex-col">
                <div className="lg:hidden">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <ProfilePhoto
                            basicDetails={basicDetails}
                            username={username}
                            className="w-16 h-16 sm:w-20 sm:h-20"
                        />
                        <div className="flex-1 min-w-0 pt-0.5">
                            <h1 className="text-xl sm:text-2xl font-display font-bold leading-tight portfolio-text">
                                {basicDetails?.name || username}
                            </h1>
                            {basicDetails?.headline && (
                                <p className="text-sm sm:text-base mt-1 leading-relaxed portfolio-text-secondary portfolio-break-words">
                                    {basicDetails.headline}
                                </p>
                            )}
                            {basicDetails?.location && (
                                <div className="flex items-start gap-1.5 text-sm mt-2 portfolio-text-muted">
                                    <MapPin size={14} strokeWidth={ICON_STROKE} className="flex-shrink-0 mt-0.5" />
                                    <span className="portfolio-break-words">{basicDetails.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {(basicDetails?.phone || mailto) && (
                        <div className="mt-3 flex flex-col gap-1.5 text-sm portfolio-text-secondary">
                            {basicDetails?.phone && (
                                <a href={`tel:${basicDetails.phone}`} className="inline-flex items-center gap-2 min-h-[44px]">
                                    <Phone size={15} strokeWidth={ICON_STROKE} />
                                    <span>{basicDetails.phone}</span>
                                </a>
                            )}
                            {mailto && (
                                <a href={mailto} className="inline-flex items-start gap-2 min-h-[44px] hover:opacity-80">
                                    <Mail size={15} strokeWidth={ICON_STROKE} className="flex-shrink-0 mt-0.5" />
                                    <span className="portfolio-break-words">{email}</span>
                                </a>
                            )}
                        </div>
                    )}

                    <div className="mt-3 flex items-center gap-2 overflow-x-auto hide-scrollbar pb-0.5">
                        {socialButtons}
                    </div>

                    {resumeLink && (
                        <a
                            href={resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-btn-primary inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium mt-3 min-h-[44px]"
                        >
                            <Download size={16} strokeWidth={ICON_STROKE} />
                            Download Resume
                        </a>
                    )}
                </div>

                <div className="hidden lg:flex lg:flex-col lg:items-start lg:text-left">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full">
                        <ProfilePhoto
                            basicDetails={basicDetails}
                            username={username}
                            className="w-24 h-24 sm:w-28 sm:h-28 mb-4"
                        />

                        <h1 className="text-2xl sm:text-3xl font-display font-bold leading-tight mb-2 portfolio-text">
                            {basicDetails?.name || username}
                        </h1>

                        {basicDetails?.headline && (
                            <p className="text-sm sm:text-base mb-3 portfolio-text-secondary">
                                {basicDetails.headline}
                            </p>
                        )}

                        {basicDetails?.location && (
                            <div className="flex items-center gap-2 text-sm mb-4 portfolio-text-muted">
                                <MapPin size={14} strokeWidth={ICON_STROKE} />
                                <span>{basicDetails.location}</span>
                            </div>
                        )}

                        {(basicDetails?.phone || mailto) && (
                            <div className="flex flex-col gap-2 w-full mb-4 text-sm portfolio-text-secondary">
                                {basicDetails?.phone && (
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <Phone size={14} strokeWidth={ICON_STROKE} />
                                        <span>{basicDetails.phone}</span>
                                    </div>
                                )}
                                {mailto && (
                                    <a href={mailto} className="flex items-center justify-center lg:justify-start gap-2 hover:opacity-80">
                                        <Mail size={14} strokeWidth={ICON_STROKE} />
                                        <span className="truncate">{email}</span>
                                    </a>
                                )}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-5">
                            <SocialButton href={safeHref(socialLinks?.github)} label="GitHub" icon={Github} />
                            <SocialButton href={safeHref(socialLinks?.linkedin)} label="LinkedIn" icon={Linkedin} />
                            <SocialButton href={safeHref(socialLinks?.twitter)} label="Twitter" icon={Twitter} />
                            <SocialButton href={safeHref(socialLinks?.website)} label="Website" icon={Globe} />
                        </div>

                        {resumeLink && (
                            <a
                                href={resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="portfolio-btn-primary inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium mb-5"
                            >
                                <Download size={16} strokeWidth={ICON_STROKE} />
                                Download Resume
                            </a>
                        )}
                    </div>

                    <nav className="portfolio-scroll border-t border-[var(--pf-border-subtle)] pt-4 lg:flex-1 lg:min-h-0 lg:overflow-y-auto w-full" aria-label="Section navigation">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-2 px-2 portfolio-text-muted">
                            Sections
                        </p>
                        <ul className="space-y-1">
                            {sections.map((section) => {
                                const Icon = section.icon
                                return (
                                    <li key={section.id}>
                                        <button
                                            type="button"
                                            onClick={() => onNavigate(section.id)}
                                            data-active={activeSection === section.id}
                                            aria-current={activeSection === section.id ? 'true' : undefined}
                                            className="portfolio-nav-link w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left"
                                        >
                                            <Icon size={15} strokeWidth={ICON_STROKE} />
                                            {section.label}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </aside>
    )
}

export default ProfileAside