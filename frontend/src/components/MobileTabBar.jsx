function MobileTabBar({ tabs, activeId, onChange, className = 'mb-6' }) {
    return (
        <div
            className={`md:hidden sticky top-navbar z-20 bg-surface/90 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2 border-b border-border overflow-x-auto hide-scrollbar flex gap-2 ${className}`}
            role="tablist"
            aria-label="Section navigation"
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeId === tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full whitespace-nowrap text-sm font-medium transition-colors flex-shrink-0 ${
                        activeId === tab.id
                            ? 'bg-primary-500/10 text-primary ring-1 ring-primary-500/25'
                            : 'text-secondary hover:text-primary hover:bg-surface-hover'
                    }`}
                >
                    {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                    {tab.label}
                </button>
            ))}
        </div>
    )
}

export default MobileTabBar