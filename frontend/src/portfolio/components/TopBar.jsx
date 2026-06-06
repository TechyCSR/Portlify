import { Link } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import BrandLogo from '../../components/BrandLogo'
import { ICON_STROKE } from '../../components/IconTile'
import { BRAND_NAME_DISPLAY } from '../../constants/brand'

function TopBar({ theme, onToggleTheme }) {
    return (
        <div className="portfolio-no-print portfolio-surface flex-shrink-0 z-50 border-b border-[var(--pf-border-subtle)] rounded-none shadow-none">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                <Link
                    to="/"
                    className="group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
                    aria-label={`${BRAND_NAME_DISPLAY} home`}
                >
                    <BrandLogo
                        size="sm"
                        nameClassName="portfolio-text"
                        className="transition-transform group-hover:scale-[1.02]"
                    />
                </Link>
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