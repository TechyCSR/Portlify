import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { IconTile, ICON_STROKE } from '../IconTile'

const cardVariants = {
    initial: { opacity: 0, y: 24 },
    animate: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' },
    }),
}

function OnboardingOptionCard({
    icon,
    title,
    description,
    footer,
    footerLabel,
    selected,
    onSelect,
    index = 0,
}) {
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
                'relative w-full text-left rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8',
                'border-2 transition-all duration-200 min-h-[11.5rem] sm:min-h-[13rem]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                selected
                    ? 'border-primary-500 bg-surface shadow-md'
                    : 'border-border bg-surface hover:border-border-hover hover:bg-surface-hover',
            ].join(' ')}
        >
            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-500 flex items-center justify-center text-white"
                    aria-hidden="true"
                >
                    <Check size={16} strokeWidth={ICON_STROKE} />
                </motion.div>
            )}

            <IconTile
                icon={icon}
                className="w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-5"
                size={22}
                iconClassName={selected ? 'text-primary-400' : 'text-secondary'}
            />

            <h3 className="text-lg sm:text-xl font-bold text-primary mb-1.5 sm:mb-2 pr-8">
                {title}
            </h3>
            <p className="text-sm sm:text-base text-secondary mb-3 sm:mb-4">
                {description}
            </p>
            {footer && (
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    <span className="font-medium text-secondary">{footerLabel}:</span>{' '}
                    {footer}
                </p>
            )}
        </motion.button>
    )
}

export default OnboardingOptionCard