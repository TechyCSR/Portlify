import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Info, Sparkles } from 'lucide-react'
import { ICON_STROKE } from '../../components/IconTile'
import { getAppUrl } from '../../utils/appUrl'
import { safeHref } from '../../utils/safeUrl'

function Footer({ profile }) {
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
        <footer className="relative py-12 px-4 mt-8">
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 max-w-md h-px"
                style={{ background: 'var(--pf-border-subtle)' }}
            />

            <div className="max-w-6xl mx-auto flex justify-center">
                {customBranding?.enabled && customBranding?.text ? (
                    <a
                        href={safeHref(customBranding.url) || '#'}
                        target={safeHref(customBranding.url) ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        onClick={(e) => !safeHref(customBranding.url) && e.preventDefault()}
                        className="group portfolio-surface rounded-xl px-6 py-3 inline-flex items-center gap-3 transition-transform hover:-translate-y-0.5"
                    >
                        <span className="text-sm font-medium portfolio-text">
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
                                className="portfolio-btn-primary w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                                aria-label="Premium branding information"
                                onClick={() => setShowPremiumInfo((open) => !open)}
                            >
                                <Info size={12} strokeWidth={3} />
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
                                            className="portfolio-btn-primary block py-1.5 px-3 rounded-lg font-semibold"
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
                            className="group portfolio-surface rounded-xl px-6 py-3 inline-flex items-center gap-3 transition-transform hover:-translate-y-0.5"
                        >
                            <div className="portfolio-brand-gradient w-8 h-8 rounded-lg flex items-center justify-center">
                                <Sparkles size={16} strokeWidth={ICON_STROKE} className="text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm portfolio-text-secondary">Built with</span>
                                <span className="portfolio-brand-text font-semibold text-sm">
                                    Portlify
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