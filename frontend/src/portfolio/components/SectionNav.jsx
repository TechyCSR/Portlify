function SectionNav({ sections, activeSection, onNavigate }) {
    if (sections.length <= 1) return null

    return (
        <nav
            className="portfolio-no-print portfolio-surface lg:hidden flex-shrink-0 py-2 px-2.5 sm:px-3 border border-[var(--pf-border-subtle)] rounded-xl shadow-none"
            aria-label="Section navigation"
        >
            <div className="portfolio-section-nav-fade">
                <div className="flex gap-2 overflow-x-auto hide-scrollbar portfolio-section-nav-scroll py-0.5">
                    {sections.map((section) => {
                        const Icon = section.icon
                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => onNavigate(section.id)}
                                data-active={activeSection === section.id}
                                aria-current={activeSection === section.id ? 'true' : undefined}
                                className="portfolio-nav-link flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0"
                            >
                                <Icon size={15} />
                                {section.label}
                            </button>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

export default SectionNav