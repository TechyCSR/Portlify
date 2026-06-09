import { useTheme } from '../context/ThemeContext'
import { PRODUCT_HUNT } from '../constants/brand'

function ProductHuntBadge({ className = '' }) {
    const { theme } = useTheme()
    const badgeTheme = theme === 'light' ? 'light' : 'dark'
    const badgeSrc = `https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${PRODUCT_HUNT.postId}&theme=${badgeTheme}&t=${PRODUCT_HUNT.cacheKey}`

    return (
        <a
            href={PRODUCT_HUNT.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex shrink-0 rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] ${className}`}
            aria-label="View PortlifyAi on Product Hunt"
        >
            <img
                src={badgeSrc}
                alt={PRODUCT_HUNT.alt}
                width={250}
                height={54}
                className="h-auto w-[min(100%,13.5rem)] sm:w-[250px]"
                loading="lazy"
                decoding="async"
            />
        </a>
    )
}

export default ProductHuntBadge
