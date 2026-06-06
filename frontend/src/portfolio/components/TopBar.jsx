import { Moon, Sun } from 'lucide-react'
import { ICON_STROKE } from '../../components/IconTile'

function TopBar({ theme, onToggleTheme }) {
    return (
        <div className="portfolio-no-print portfolio-surface sticky top-0 z-50 border-b border-[var(--pf-border-subtle)] rounded-none shadow-none">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                <a
                    href="#top"
                    className="font-display font-bold text-sm sm:text-base portfolio-text"
                >
                    Portfolio
                </a>
                <button
                    type="button"
                    onClick={onToggleTheme}
                    className="portfolio-chip inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                    aria-label="Toggle color mode"
                >
                    {theme === 'dark' ? (
                        <Sun size={16} strokeWidth={ICON_STROKE} />
                    ) : (
                        <Moon size={16} strokeWidth={ICON_STROKE} />
                    )}
                    <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>
            </div>
        </div>
    )
}

export default TopBar