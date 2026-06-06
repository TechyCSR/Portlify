import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, LogIn, Menu, UserPlus, X } from 'lucide-react'
import { ICON_STROKE } from './IconTile'
import { dashboardNavItems } from './DashboardSidebar'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'
import { useDashboardNavBridge } from '../context/DashboardNavBridge'
import { getUserButtonAppearance } from '../utils/clerkAppearance'
import BrandLogo from './BrandLogo'
import { BRAND_NAME_DISPLAY } from '../constants/brand'

const DASHBOARD_PATHS = dashboardNavItems.map((item) => item.to)
const MOBILE_MENU_ID = 'navbar-mobile-menu'
const MOBILE_ACTION_SLOT = 'inline-flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center'

function isDashboardPath(pathname) {
    return DASHBOARD_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function NavLink({ to, children, onClick, className = '', isActive = false }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                isActive
                    ? 'text-primary bg-primary-500/10'
                    : 'text-secondary hover:text-primary hover:bg-surface-hover'
            } ${className}`}
        >
            {children}
        </Link>
    )
}

function MobileNavLink({ to, children, onClick, icon: Icon, isActive = false }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors min-h-[44px] ${
                isActive
                    ? 'text-primary bg-primary-500/10'
                    : 'text-secondary hover:text-primary hover:bg-surface-hover'
            }`}
        >
            {Icon && <Icon size={18} strokeWidth={ICON_STROKE} className="flex-shrink-0" />}
            <span className="font-medium">{children}</span>
        </Link>
    )
}

function Navbar() {
    const { theme } = useTheme()
    const location = useLocation()
    const menuButtonRef = useRef(null)
    const dashboardNav = useDashboardNavBridge()
    const openDashboardSidebar = dashboardNav?.openSidebar
    const closeDashboardSidebar = dashboardNav?.closeSidebar
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const onDashboard = isDashboardPath(location.pathname)
    const userButtonAppearance = getUserButtonAppearance(theme)
    const usesDashboardDrawer = onDashboard && Boolean(dashboardNav)
    const drawerOpen = usesDashboardDrawer && dashboardNav.sidebarOpen
    const showMobileMenuButton = !onDashboard
    const menuOpen = usesDashboardDrawer ? drawerOpen : mobileMenuOpen

    const closeMobileMenu = () => setMobileMenuOpen(false)

    const toggleMobileMenu = () => {
        if (usesDashboardDrawer) {
            if (dashboardNav.sidebarOpen) {
                closeDashboardSidebar?.()
            } else {
                openDashboardSidebar?.()
            }
            return
        }

        setMobileMenuOpen((open) => !open)
    }

    useLayoutEffect(() => {
        closeMobileMenu()
        closeDashboardSidebar?.()
        setScrolled(window.scrollY > 8)
    }, [location.pathname, closeDashboardSidebar])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (!mobileMenuOpen || usesDashboardDrawer) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeMobileMenu()
                menuButtonRef.current?.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [mobileMenuOpen, usesDashboardDrawer])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 navbar-safe-top">
            <nav
                aria-label="Main navigation"
                className={`glass border-x-0 border-t-0 transition-shadow duration-300 ${
                    scrolled ? 'navbar-scrolled' : ''
                }`}
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center gap-2 h-16 min-w-0">
                        <Link
                            to="/"
                            className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
                            aria-label={`${BRAND_NAME_DISPLAY} home`}
                        >
                            <BrandLogo
                                size="sm"
                                className="transition-transform group-hover:scale-[1.02] min-w-0"
                                nameClassName="max-[420px]:hidden"
                            />
                        </Link>

                        {/* Desktop */}
                        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                            <ThemeToggle />

                            <SignedOut>
                                <NavLink to="/sign-in">Sign In</NavLink>
                                <Link to="/sign-up" className="btn-primary text-sm ml-1">
                                    Get Started
                                </Link>
                            </SignedOut>

                            <SignedIn>
                                <NavLink
                                    to="/dashboard"
                                    isActive={onDashboard}
                                    className="inline-flex items-center gap-2"
                                >
                                    <LayoutDashboard size={16} strokeWidth={ICON_STROKE} />
                                    Dashboard
                                </NavLink>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={userButtonAppearance}
                                />
                            </SignedIn>
                        </div>

                        {/* Mobile */}
                        <div className="flex md:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            <ThemeToggle className="min-h-[44px] min-w-[44px] flex items-center justify-center" />

                            <SignedIn>
                                {!onDashboard && (
                                    <Link
                                        to="/dashboard"
                                        className="btn-primary inline-flex min-h-[44px] items-center justify-center gap-1.5 px-3 sm:px-4 text-sm whitespace-nowrap"
                                        aria-label="Go to dashboard"
                                    >
                                        <LayoutDashboard size={16} strokeWidth={ICON_STROKE} className="flex-shrink-0" />
                                        <span className="max-[360px]:hidden">Dashboard</span>
                                    </Link>
                                )}

                                <div className="flex items-center justify-center min-h-[44px] min-w-[44px]">
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={userButtonAppearance}
                                    />
                                </div>
                            </SignedIn>

                            {showMobileMenuButton ? (
                                <SignedOut>
                                    <button
                                        ref={menuButtonRef}
                                        type="button"
                                        onClick={toggleMobileMenu}
                                        className={`${MOBILE_ACTION_SLOT} rounded-xl text-secondary hover:text-primary hover:bg-surface-hover transition-colors`}
                                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                                        aria-expanded={menuOpen}
                                        aria-controls={MOBILE_MENU_ID}
                                    >
                                        {menuOpen
                                            ? <X size={22} strokeWidth={ICON_STROKE} />
                                            : <Menu size={22} strokeWidth={ICON_STROKE} />}
                                    </button>
                                </SignedOut>
                            ) : (
                                <button
                                    ref={menuButtonRef}
                                    type="button"
                                    onClick={toggleMobileMenu}
                                    className={`${MOBILE_ACTION_SLOT} rounded-xl text-secondary hover:text-primary hover:bg-surface-hover transition-colors`}
                                    aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
                                    aria-expanded={menuOpen}
                                >
                                    {menuOpen
                                        ? <X size={22} strokeWidth={ICON_STROKE} />
                                        : <Menu size={22} strokeWidth={ICON_STROKE} />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {showMobileMenuButton && mobileMenuOpen && (
                        <motion.div
                            id={MOBILE_MENU_ID}
                            role="navigation"
                            aria-label="Mobile menu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-border overflow-hidden bg-surface"
                        >
                            <div className="px-3 sm:px-4 py-4 space-y-2 max-h-below-navbar overflow-y-auto overscroll-contain">
                                <SignedOut>
                                    <MobileNavLink
                                        to="/sign-in"
                                        onClick={closeMobileMenu}
                                        icon={LogIn}
                                        isActive={location.pathname.startsWith('/sign-in')}
                                    >
                                        Sign In
                                    </MobileNavLink>
                                    <Link
                                        to="/sign-up"
                                        onClick={closeMobileMenu}
                                        className="btn-primary flex items-center justify-center gap-2 w-full min-h-[44px] text-sm"
                                    >
                                        <UserPlus size={18} strokeWidth={ICON_STROKE} />
                                        Get Started
                                    </Link>
                                </SignedOut>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    )
}

export default Navbar