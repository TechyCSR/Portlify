import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { PORTFOLIO_PALETTES } from '../../portfolio/theme'
import { ICON_STROKE } from '../IconTile'

const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
    }),
}

function OnboardingThemeCard({ theme, selected, onSelect, index = 0 }) {
    const palette = PORTFOLIO_PALETTES[theme.id] || PORTFOLIO_PALETTES.modern
    const lineColor = theme.isLight ? '#e4e4e7' : 'rgba(255,255,255,0.18)'
    const lineMuted = theme.isLight ? '#f4f4f5' : 'rgba(255,255,255,0.08)'
    const cardSurface = theme.isLight ? '#f4f4f5' : 'rgba(255,255,255,0.05)'

    return (
        <motion.button
            type="button"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            custom={index}
            onClick={onSelect}
            aria-pressed={selected}
            className={[
                'relative w-full text-left rounded-xl sm:rounded-2xl p-2 sm:p-2.5',
                'border-2 transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                selected
                    ? 'border-primary-500 bg-surface shadow-md'
                    : 'border-border bg-surface hover:border-border-hover',
            ].join(' ')}
        >
            <div
                className="aspect-[4/5] sm:aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden"
                style={{ background: theme.previewBg }}
            >
                <div className="p-3 sm:p-4 h-full flex flex-col">
                    <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mb-2 sm:mb-3 flex-shrink-0"
                        style={{
                            background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                        }}
                    />
                    <div className="h-1.5 sm:h-2 rounded mb-1.5 sm:mb-2" style={{ background: lineColor, width: '70%' }} />
                    <div className="h-1.5 sm:h-2 rounded mb-3 sm:mb-4" style={{ background: lineMuted, width: '50%' }} />
                    <div className="flex-1 space-y-1.5 sm:space-y-2">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="h-6 sm:h-8 rounded-md sm:rounded-lg"
                                style={{ background: cardSurface }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <p className={`text-center text-sm sm:text-base font-medium mt-2 sm:mt-3 ${selected ? 'text-primary' : 'text-secondary'}`}>
                {theme.name}
            </p>

            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white"
                    aria-hidden="true"
                >
                    <Check size={14} strokeWidth={ICON_STROKE} />
                </motion.div>
            )}
        </motion.button>
    )
}

export default OnboardingThemeCard