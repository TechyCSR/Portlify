function LoadingState({ colors }) {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
            <div className="text-center">
                <div
                    className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-4"
                    style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
                />
                <p className="text-sm" style={{ color: colors.textSecondary }}>Loading portfolio…</p>
            </div>
        </div>
    )
}

export default LoadingState