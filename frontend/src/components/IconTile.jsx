/** Unified icon styling — monochrome Lucide icons on tertiary tiles */

export const ICON_STROKE = 1.5

export function IconTile({
    icon: Icon,
    size = 20,
    className = 'w-10 h-10',
    tileStyle,
    iconClassName = 'text-secondary',
    iconStyle,
}) {
    if (!Icon) return null
    return (
        <div
            className={`${className} rounded-lg flex items-center justify-center flex-shrink-0 ${tileStyle ? '' : 'bg-tertiary'}`}
            style={tileStyle}
        >
            <Icon size={size} strokeWidth={ICON_STROKE} className={iconClassName} style={iconStyle} />
        </div>
    )
}

export function InlineIcon({ icon: Icon, size = 18, className = 'text-secondary' }) {
    if (!Icon) return null
    return <Icon size={size} strokeWidth={ICON_STROKE} className={`flex-shrink-0 ${className}`} />
}