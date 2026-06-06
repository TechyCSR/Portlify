import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BarChart3,
    ExternalLink,
    Home,
    Pencil,
    Settings,
    Star,
    Upload,
    X,
} from 'lucide-react'
import { ICON_STROKE } from './IconTile'

export const dashboardNavItems = [
    { to: '/dashboard', icon: Home, label: 'Overview', desc: 'Stats & portfolio summary' },
    { to: '/upload', icon: Upload, label: 'Upload Resume', desc: 'Update with new resume' },
    { to: '/editor', icon: Pencil, label: 'Edit Profile', desc: 'Update info, add projects' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', desc: 'Track your visitors' },
    { to: '/premium', icon: Star, label: 'Premium', desc: 'Unlock premium features' },
    { to: '/settings', icon: Settings, label: 'Settings', desc: 'Preferences & export' },
]

function NavLink({ item, isActive, onNavigate }) {
    const Icon = item.icon

    return (
        <Link
            to={item.to}
            onClick={onNavigate}
            className={`group flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isActive
                    ? 'bg-primary-500/10 text-primary'
                    : 'text-secondary hover:text-primary hover:bg-surface-hover'
            }`}
        >
            <Icon
                size={18}
                strokeWidth={ICON_STROKE}
                className={`flex-shrink-0 mt-0.5 ${isActive ? 'text-primary-400' : 'text-secondary group-hover:text-primary'}`}
            />
            <span className="min-w-0">
                <span className="block font-medium text-sm leading-tight">{item.label}</span>
                <span className={`block text-xs mt-0.5 leading-snug ${isActive ? 'text-primary-400/70' : 'text-muted'}`}>
                    {item.desc}
                </span>
            </span>
        </Link>
    )
}

function SidebarContent({ basicDetails, dbUser, currentPath, onNavigate }) {
    return (
        <>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-tertiary/60 mb-5">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {basicDetails?.name?.charAt(0) || dbUser?.username?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary truncate text-sm">
                        {basicDetails?.name || dbUser?.username || 'User'}
                    </p>
                    <p className="text-xs text-muted truncate">@{dbUser?.username || '...'}</p>
                </div>
            </div>

            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Menu
            </p>

            <nav className="space-y-0.5">
                {dashboardNavItems.map((item) => (
                    <NavLink
                        key={item.to}
                        item={item}
                        isActive={currentPath === item.to}
                        onNavigate={onNavigate}
                    />
                ))}
            </nav>

            {dbUser?.username && (
                <div className="mt-6 pt-5 border-t border-border">
                    <Link
                        to={`/${dbUser.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onNavigate}
                        className="btn-primary flex items-center justify-center gap-2 w-full text-sm"
                    >
                        <ExternalLink size={16} strokeWidth={ICON_STROKE} />
                        View Live Portfolio
                    </Link>
                </div>
            )}
        </>
    )
}

function DashboardSidebar({ basicDetails, dbUser, currentPath, open, onClose }) {
    const drawerRef = useRef(null)
    const closeButtonRef = useRef(null)
    const handleNavigate = () => onClose?.()

    useEffect(() => {
        if (!open) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose?.()
                return
            }

            if (event.key !== 'Tab' || !drawerRef.current) return

            const focusable = drawerRef.current.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
            if (focusable.length === 0) return

            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        closeButtonRef.current?.focus()

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [open, onClose])

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-navbar bg-black/40 backdrop-blur-[2px] z-40 md:hidden"
                        onClick={onClose}
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Mobile drawer */}
            <aside
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Dashboard navigation"
                className={`fixed top-navbar left-0 z-50 md:hidden w-[272px] h-below-navbar transition-transform duration-300 ease-out ${
                    open ? 'translate-x-0' : '-translate-x-full pointer-events-none'
                }`}
            >
                <div className="h-full glass-card rounded-none border-y-0 border-l-0 p-4 overflow-y-auto flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-primary">Navigation</p>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
                            aria-label="Close menu"
                        >
                            <X size={18} strokeWidth={ICON_STROKE} />
                        </button>
                    </div>
                    <SidebarContent
                        basicDetails={basicDetails}
                        dbUser={dbUser}
                        currentPath={currentPath}
                        onNavigate={handleNavigate}
                    />
                </div>
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden md:block w-[272px] flex-shrink-0" aria-label="Dashboard navigation">
                <div className="sticky top-[calc(var(--navbar-offset)+1rem)] glass-card rounded-2xl p-4 max-h-[calc(100dvh-var(--navbar-offset)-2rem)] overflow-y-auto">
                    <SidebarContent
                        basicDetails={basicDetails}
                        dbUser={dbUser}
                        currentPath={currentPath}
                        onNavigate={handleNavigate}
                    />
                </div>
            </aside>
        </>
    )
}

export default DashboardSidebar