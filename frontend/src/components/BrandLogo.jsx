import { BRAND_LOGO_ALT, BRAND_LOGO_SRC, BRAND_NAME_DISPLAY } from '../constants/brand'

const SIZE_STYLES = {
    sm: {
        image: 'w-8 h-8 rounded-lg',
        text: 'text-base',
    },
    md: {
        image: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl',
        text: 'text-lg sm:text-xl',
    },
    lg: {
        image: 'w-12 h-12 rounded-xl',
        text: 'text-2xl',
    },
}

function BrandLogo({
    size = 'md',
    showName = true,
    className = '',
    nameClassName = '',
    imageClassName = '',
}) {
    const styles = SIZE_STYLES[size] || SIZE_STYLES.md

    return (
        <span className={`inline-flex items-center gap-2.5 sm:gap-3 min-w-0 ${className}`}>
            <img
                src={BRAND_LOGO_SRC}
                alt={BRAND_LOGO_ALT}
                className={`${styles.image} object-contain flex-shrink-0 shadow-sm ${imageClassName}`}
                width={size === 'sm' ? 32 : size === 'lg' ? 48 : 40}
                height={size === 'sm' ? 32 : size === 'lg' ? 48 : 40}
                decoding="async"
            />
            {showName && (
                <span className={`font-display font-bold truncate ${styles.text} ${nameClassName}`}>
                    <span className="text-primary">Portlify</span>
                    <span className="heading-gradient">Ai</span>
                </span>
            )}
        </span>
    )
}

export default BrandLogo