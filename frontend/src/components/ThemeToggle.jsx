import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme()

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`relative p-2 rounded-xl bg-surface border border-border hover:border-primary-500/50 transition-colors ${className}`}
            aria-label="Toggle theme"
        >
            <div className="relative w-6 h-6">
                {/* Sun icon */}
                <motion.svg
                    initial={false}
                    animate={{
                        scale: theme === 'light' ? 1 : 0,
                        rotate: theme === 'light' ? 0 : 90,
                        opacity: theme === 'light' ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 w-6 h-6 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </motion.svg>

                {/* Moon icon */}
                <motion.svg
                    initial={false}
                    animate={{
                        scale: theme === 'dark' ? 1 : 0,
                        rotate: theme === 'dark' ? 0 : -90,
                        opacity: theme === 'dark' ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 w-6 h-6 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </motion.svg>
            </div>
        </motion.button>
    )
}

export default ThemeToggle
