import {
    Award,
    BookOpen,
    Briefcase,
    Building,
    Calendar,
    ChevronRight,
    ExternalLink,
    Github,
    GraduationCap,
    MapPin,
    Rocket,
} from 'lucide-react'
import { ICON_STROKE } from '../../components/IconTile'
import { safeHref } from '../../utils/safeUrl'

const SKILL_GROUPS = [
    { key: 'programmingLanguages', label: 'Languages' },
    { key: 'frameworks', label: 'Frameworks' },
    { key: 'databases', label: 'Databases' },
    { key: 'tools', label: 'Tools' },
    { key: 'cloudSystems', label: 'Cloud & Systems' },
    { key: 'softSkills', label: 'Soft Skills' },
]

function SectionTitle({ icon: Icon, children }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="portfolio-icon-tile w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} strokeWidth={ICON_STROKE} />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold portfolio-text">
                {children}
            </h2>
        </div>
    )
}

function Surface({ children, className = '' }) {
    return (
        <div className={`portfolio-surface rounded-2xl overflow-visible ${className}`}>
            {children}
        </div>
    )
}

function TimelineCard({ children }) {
    return <Surface className="p-5 sm:p-6">{children}</Surface>
}

function ExperienceItem({ item, isLast }) {
    return (
        <div className={`relative pl-7 sm:pl-8 ${isLast ? '' : 'pb-8'}`}>
            {!isLast && (
                <div className="portfolio-timeline-line absolute left-[7px] sm:left-[9px] top-3 bottom-0 w-px" />
            )}
            <div className="portfolio-timeline-dot absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2" />
            <TimelineCard>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold portfolio-text portfolio-break-words">
                            {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm portfolio-text-secondary">
                            <Building size={14} strokeWidth={ICON_STROKE} />
                            <span>{item.company}</span>
                        </div>
                    </div>
                    {item.duration && (
                        <span className="portfolio-muted-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit">
                            <Calendar size={12} strokeWidth={ICON_STROKE} />
                            {item.duration}
                        </span>
                    )}
                </div>
                {item.location && (
                    <div className="flex items-center gap-2 mb-3 text-sm portfolio-text-secondary">
                        <MapPin size={14} strokeWidth={ICON_STROKE} />
                        {item.location}
                    </div>
                )}
                {item.description && (
                    <p className="text-sm sm:text-sm leading-relaxed portfolio-text-secondary portfolio-mobile-content-copy">
                        {item.description}
                    </p>
                )}
                {item.achievements?.length > 0 && (
                    <ul className="mt-3 space-y-2">
                        {item.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm portfolio-text-secondary portfolio-mobile-content-copy">
                                <ChevronRight size={14} strokeWidth={ICON_STROKE} className="portfolio-link mt-0.5 flex-shrink-0" />
                                {achievement}
                            </li>
                        ))}
                    </ul>
                )}
            </TimelineCard>
        </div>
    )
}

function EducationItem({ item, isLast }) {
    return (
        <div className={`relative pl-7 sm:pl-8 ${isLast ? '' : 'pb-8'}`}>
            {!isLast && (
                <div className="portfolio-timeline-line absolute left-[7px] sm:left-[9px] top-3 bottom-0 w-px" />
            )}
            <div className="portfolio-timeline-dot absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2" />
            <TimelineCard>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold portfolio-text portfolio-break-words">
                            {item.degree}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm portfolio-text-secondary">
                            <GraduationCap size={14} strokeWidth={ICON_STROKE} />
                            <span>{item.institution}</span>
                        </div>
                    </div>
                    {item.year && (
                        <span className="portfolio-muted-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit">
                            <Calendar size={12} strokeWidth={ICON_STROKE} />
                            {item.year}
                        </span>
                    )}
                </div>
                {item.gpa && (
                    <div className="portfolio-muted-pill inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg text-sm font-medium">
                        <Award size={14} strokeWidth={ICON_STROKE} />
                        Score: {item.gpa}
                    </div>
                )}
                {item.location && (
                    <div className="flex items-center gap-2 mb-3 text-sm portfolio-text-secondary">
                        <MapPin size={14} strokeWidth={ICON_STROKE} />
                        {item.location}
                    </div>
                )}
                {item.description && (
                    <p className="text-sm leading-relaxed portfolio-text-secondary portfolio-mobile-content-copy">
                        {item.description}
                    </p>
                )}
                {item.coursework?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {item.coursework.map((course, index) => (
                            <span key={index} className="portfolio-tag px-2.5 py-1 rounded-md text-xs font-medium">
                                {course}
                            </span>
                        ))}
                    </div>
                )}
            </TimelineCard>
        </div>
    )
}

function ProjectCard({ project }) {
    return (
        <Surface className="p-5 sm:p-6 flex flex-col min-w-0 w-full">
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="portfolio-icon-tile w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket size={20} strokeWidth={ICON_STROKE} />
                </div>
                <div className="flex gap-1.5">
                    {safeHref(project.githubUrl) && (
                        <a
                            href={safeHref(project.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View project on GitHub"
                            className="portfolio-chip portfolio-touch-target inline-flex items-center justify-center p-2.5 rounded-lg"
                        >
                            <Github size={18} strokeWidth={ICON_STROKE} />
                        </a>
                    )}
                    {safeHref(project.demoUrl) && (
                        <a
                            href={safeHref(project.demoUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View live demo"
                            className="portfolio-chip portfolio-touch-target inline-flex items-center justify-center p-2.5 rounded-lg"
                        >
                            <ExternalLink size={18} strokeWidth={ICON_STROKE} />
                        </a>
                    )}
                </div>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 portfolio-text portfolio-break-words">
                {project.title}
            </h3>
            {project.description && (
                <p className="text-sm leading-relaxed mb-4 flex-1 portfolio-text-secondary portfolio-mobile-content-copy portfolio-break-words">
                    {project.description}
                </p>
            )}
            {project.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto w-full min-w-0">
                    {project.techStack.map((tech, index) => (
                        <span key={index} className="portfolio-tag px-2.5 py-1 rounded-md text-xs font-medium">
                            {tech}
                        </span>
                    ))}
                </div>
            )}
        </Surface>
    )
}

function ListCard({ title, subtitle, description, date, url, urlLabel = 'View' }) {
    return (
        <Surface className="p-5 h-full">
            <h3 className="font-semibold mb-1 portfolio-text portfolio-break-words">{title}</h3>
            {subtitle && (
                <p className="text-sm mb-2 font-medium portfolio-text-secondary">{subtitle}</p>
            )}
            {date && (
                <div className="flex items-center gap-2 text-sm mb-2 portfolio-text-secondary">
                    <Calendar size={14} strokeWidth={ICON_STROKE} />
                    {date}
                </div>
            )}
            {description && (
                <p className="text-sm leading-relaxed portfolio-text-secondary portfolio-mobile-content-copy">
                    {description}
                </p>
            )}
            {safeHref(url) && (
                <a
                    href={safeHref(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolio-link inline-flex items-center gap-1 mt-3 text-sm font-medium min-h-[44px]"
                >
                    {urlLabel} <ExternalLink size={14} strokeWidth={ICON_STROKE} />
                </a>
            )}
        </Surface>
    )
}

function SectionContent({ section, basicDetails }) {
    switch (section.type) {
        case 'about':
        case 'about-fallback':
            return (
                <>
                    <SectionTitle icon={section.icon}>About</SectionTitle>
                    <Surface className="p-5 sm:p-6">
                        <p className="leading-relaxed whitespace-pre-wrap text-base portfolio-text-secondary portfolio-mobile-content-copy">
                            {basicDetails?.about || 'Professional portfolio powered by PortlifyAi.'}
                        </p>
                    </Surface>
                </>
            )

        case 'experience':
            return (
                <>
                    <SectionTitle icon={section.icon}>Experience</SectionTitle>
                    <div>
                        {section.items.map((item, index) => (
                            <ExperienceItem key={index} item={item} isLast={index === section.items.length - 1} />
                        ))}
                    </div>
                </>
            )

        case 'projects':
            return (
                <>
                    <SectionTitle icon={section.icon}>Projects</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                        {section.items.map((project, index) => (
                            <ProjectCard key={index} project={project} />
                        ))}
                    </div>
                </>
            )

        case 'education':
            return (
                <>
                    <SectionTitle icon={section.icon}>Education</SectionTitle>
                    <div>
                        {section.items.map((item, index) => (
                            <EducationItem key={index} item={item} isLast={index === section.items.length - 1} />
                        ))}
                    </div>
                </>
            )

        case 'skills':
            return (
                <>
                    <SectionTitle icon={section.icon}>Skills</SectionTitle>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {SKILL_GROUPS.map((group) => {
                            const items = section.items?.[group.key] || []
                            if (items.length === 0) return null
                            return (
                                <Surface key={group.key} className="p-4 sm:p-5">
                                    <h3 className="text-sm font-semibold mb-3 portfolio-text">
                                        {group.label}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {items.map((skill, index) => (
                                            <span key={index} className="portfolio-tag px-3 py-1.5 rounded-full text-xs font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </Surface>
                            )
                        })}
                    </div>
                </>
            )

        case 'achievements':
            return (
                <>
                    <SectionTitle icon={section.icon}>Achievements</SectionTitle>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {section.items.map((item, index) => (
                            <ListCard
                                key={index}
                                title={item.title}
                                description={item.description}
                                date={item.date}
                            />
                        ))}
                    </div>
                </>
            )

        case 'certifications':
            return (
                <>
                    <SectionTitle icon={section.icon}>Certifications</SectionTitle>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {section.items.map((item, index) => (
                            <ListCard
                                key={index}
                                title={item.name}
                                subtitle={item.issuer}
                                date={item.date}
                                url={item.credentialUrl || item.url}
                                urlLabel="View Credential"
                            />
                        ))}
                    </div>
                </>
            )

        case 'publications':
            return (
                <>
                    <SectionTitle icon={section.icon}>Publications</SectionTitle>
                    <div className="space-y-4">
                        {section.items.map((item, index) => (
                            <ListCard
                                key={index}
                                title={item.title}
                                subtitle={item.publisher}
                                description={item.description}
                                date={item.date}
                                url={item.url}
                                urlLabel="Read Publication"
                            />
                        ))}
                    </div>
                </>
            )

        case 'volunteering':
            return (
                <>
                    <SectionTitle icon={section.icon}>Volunteering</SectionTitle>
                    <div className="space-y-4">
                        {section.items.map((item, index) => (
                            <ListCard
                                key={index}
                                title={item.role}
                                subtitle={item.organization}
                                description={item.description}
                                date={item.duration || item.date}
                            />
                        ))}
                    </div>
                </>
            )

        case 'activities':
            return (
                <>
                    <SectionTitle icon={section.icon}>Activities</SectionTitle>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {section.items.map((item, index) => (
                            <ListCard
                                key={index}
                                title={item.activity || item.role}
                                subtitle={item.role && item.activity ? item.role : undefined}
                                description={item.description}
                            />
                        ))}
                    </div>
                </>
            )

        case 'references':
            return (
                <>
                    <SectionTitle icon={section.icon}>References</SectionTitle>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {section.items.map((item, index) => (
                            <ListCard
                                key={index}
                                title={item.name}
                                subtitle={[item.title, item.company].filter(Boolean).join(' · ')}
                                description={item.email || item.phone || item.description}
                            />
                        ))}
                    </div>
                </>
            )

        case 'custom':
            return (
                <>
                    <SectionTitle icon={section.icon}>{section.label}</SectionTitle>
                    <Surface className="p-5 sm:p-6">
                        <p className="leading-relaxed whitespace-pre-wrap text-base portfolio-text-secondary portfolio-mobile-content-copy">
                            {section.content}
                        </p>
                    </Surface>
                </>
            )

        default:
            return null
    }
}

export default SectionContent