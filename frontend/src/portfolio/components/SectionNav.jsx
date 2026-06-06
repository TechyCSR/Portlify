function SectionNav({ sections, activeSection, onNavigate }) {
    if (sections.length <= 1) return null

    return (
        <nav
            className="portfolio-no-print portfolio-surface lg:hidden flex-shrink-0 py-2.5 px-3 border border-[var(--pf-border-subtle)] rounded-xl shadow-none"
            aria-label="Section navigation"
        >
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {sections.map((section) => {
                    const Icon = section.icon
                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => onNavigate(section.id)}
                            data-active={activeSection === section.id}
                            aria-current={activeSection === section.id ? 'true' : undefined}
                            className="portfolio-nav-link flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0"
                        >
                            <Icon size={14} />
                            {section.label}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

export default SectionNav