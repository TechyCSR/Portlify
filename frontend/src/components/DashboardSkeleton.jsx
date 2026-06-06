function DashboardSkeleton() {
    return (
        <div className="max-w-5xl mx-auto w-full" aria-busy="true" aria-label="Loading dashboard">
            <div className="flex items-start gap-3 mb-8">
                <div className="md:hidden w-10 h-10 rounded-xl bg-tertiary animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2.5">
                    <div className="h-8 sm:h-9 w-48 sm:w-64 bg-tertiary rounded-lg animate-pulse" />
                    <div className="h-4 w-56 sm:w-72 bg-tertiary/70 rounded animate-pulse" />
                </div>
            </div>

            <div className="glass-card rounded-2xl p-5 mb-6 h-[88px] animate-pulse" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="glass-card rounded-xl p-4 h-[76px] animate-pulse" />
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="glass-card rounded-xl p-4 h-[108px] animate-pulse" />
                ))}
            </div>
        </div>
    )
}

export default DashboardSkeleton