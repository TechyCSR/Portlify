function SectionNav({ sections, activeSection, onNavigate }) {
    if (sections.length <= 1) return null

    return (
        <nav
            className="portfolio-no-print portfolio-surface lg:hidden sticky top-14 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 border-b border-[var(--pf-border-subtle)] rounded-none shadow-none"
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