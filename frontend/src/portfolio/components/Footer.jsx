import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Info } from 'lucide-react'
import { ICON_STROKE } from '../../components/IconTile'
import { getAppUrl } from '../../utils/appUrl'
import { BRAND_LOGO_ALT, BRAND_LOGO_SRC, BRAND_NAME_DISPLAY } from '../../constants/brand'
import { safeHref } from '../../utils/safeUrl'

function Footer({ profile, compact = false }) {
    const [showPremiumInfo, setShowPremiumInfo] = useState(false)
    const timeoutRef = useRef(null)

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setShowPremiumInfo(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setShowPremiumInfo(false), 3000)
    }

    useEffect(() => () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }, [])

    const customBranding = profile?.customBranding

    return (
        <footer className={`relative flex-shrink-0 ${compact ? 'py-3 mt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]' : 'py-12 px-4 mt-8'}`}>
            {!compact && (
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 max-w-md h-px"
                    style={{ background: 'var(--pf-border-subtle)' }}
                />
            )}

            <div className={`${compact ? '' : 'max-w-6xl mx-auto'} flex justify-center`}>
                {customBranding?.enabled && customBranding?.text ? (
                    <a
                        href={safeHref(customBranding.url) || '#'}
                        target={safeHref(customBranding.url) ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        onClick={(e) => !safeHref(customBranding.url) && e.preventDefault()}
                        className={`group portfolio-surface rounded-xl inline-flex items-center gap-3 transition-transform hover:-translate-y-0.5 ${compact ? 'px-4 py-2' : 'px-6 py-3'}`}
                    >
                        <span className={`font-medium portfolio-text ${compact ? 'text-xs' : 'text-sm'}`}>
                            {customBranding.text}
                        </span>
                        {customBranding.url && (
                            <ChevronRight
                                size={16}
                                strokeWidth={ICON_STROKE}
                                className="portfolio-link opacity-60 group-hover:translate-x-0.5 transition-transform"
                            />
                        )}
                    </a>
                ) : (
                    <div className="relative">
                        <div
                            className="absolute -top-2 -left-2 z-20 portfolio-no-print"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                type="button"
                                className="portfolio-btn-primary min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center shadow-lg portfolio-touch-target"
                                aria-label="Premium branding information"
                                aria-expanded={showPremiumInfo}
                                onClick={() => setShowPremiumInfo((open) => !open)}
                            >
                                <Info size={14} strokeWidth={3} />
                            </button>

                            <AnimatePresence>
                                {showPremiumInfo && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        className="portfolio-surface absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 p-4 rounded-xl text-xs text-center shadow-xl z-30"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <p className="portfolio-text-secondary mb-2 leading-relaxed">
                                            Customize or remove this branding with a premium membership.
                                        </p>
                                        <a
                                            href={`${getAppUrl()}/premium`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="portfolio-btn-primary block min-h-[44px] py-2.5 px-3 rounded-lg font-semibold"
                                        >
                                            Upgrade to Premium
                                        </a>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <a
                            href={getAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group portfolio-surface rounded-xl inline-flex items-center gap-3 transition-transform hover:-translate-y-0.5 ${compact ? 'px-4 py-2' : 'px-6 py-3'}`}
                        >
                            <img
                                src={BRAND_LOGO_SRC}
                                alt={BRAND_LOGO_ALT}
                                className={`object-contain flex-shrink-0 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}
                                width={compact ? 24 : 32}
                                height={compact ? 24 : 32}
                                decoding="async"
                            />
                            <div className="flex items-center gap-2">
                                <span className={`portfolio-text-secondary ${compact ? 'text-xs' : 'text-sm'}`}>Built with</span>
                                <span className={`font-semibold ${compact ? 'text-xs' : 'text-sm'}`}>
                                    <span className="portfolio-text">Portlify</span>
                                    <span className="portfolio-brand-text">Ai</span>
                                </span>
                            </div>
                            <ChevronRight
                                size={16}
                                strokeWidth={ICON_STROKE}
                                className="portfolio-link opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                            />
                        </a>
                    </div>
                )}
            </div>
        </footer>
    )
}

export default Footer