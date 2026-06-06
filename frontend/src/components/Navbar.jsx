import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, LogIn, Menu, UserPlus, X } from 'lucide-react'
import { ICON_STROKE } from './IconTile'
import { dashboardNavItems } from './DashboardSidebar'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const onDashboard = isDashboardPath(location.pathname)
    const userButtonAppearance = getUserButtonAppearance(theme)
    const showMobileMenu = !onDashboard

    const closeMobileMenu = () => setMobileMenuOpen(false)
    const toggleMobileMenu = () => setMobileMenuOpen((open) => !open)

    useLayoutEffect(() => {
        closeMobileMenu()
        setScrolled(window.scrollY > 8)
    }, [location.pathname])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (!mobileMenuOpen) return

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
    }, [mobileMenuOpen])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 navbar-safe-top">
            <nav
                aria-label="Main navigation"
                className={`glass border-x-0 border-t-0 transition-shadow duration-300 ${
                    scrolled ? 'navbar-scrolled' : ''
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to="/"
                            className="flex items-center gap-3 group min-w-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
                            aria-label={`${BRAND_NAME_DISPLAY} home`}
                        >
                            <BrandLogo className="transition-transform group-hover:scale-[1.02]" />
                        </Link>

                        {/* Desktop */}
                        <div className="hidden md:flex items-center gap-2">
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

                        {/* Mobile — fixed-width action slots prevent layout shift on route change */}
                        <div className="flex md:hidden items-center gap-2">
                            <ThemeToggle />

                            <SignedIn>
                                <UserButton
                                    afterSignOutUrl="/"
                                    appearance={userButtonAppearance}
                                />
                            </SignedIn>

                            {showMobileMenu ? (
                                <button
                                    ref={menuButtonRef}
                                    type="button"
                                    onClick={toggleMobileMenu}
                                    className={`${MOBILE_ACTION_SLOT} rounded-xl text-secondary hover:text-primary hover:bg-surface-hover transition-colors`}
                                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                                    aria-expanded={mobileMenuOpen}
                                    aria-controls={MOBILE_MENU_ID}
                                >
                                    {mobileMenuOpen
                                        ? <X size={22} strokeWidth={ICON_STROKE} />
                                        : <Menu size={22} strokeWidth={ICON_STROKE} />}
                                </button>
                            ) : (
                                <span className={MOBILE_ACTION_SLOT} aria-hidden="true" />
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {showMobileMenu && mobileMenuOpen && (
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
                            <div className="px-4 py-4 space-y-1 max-h-below-navbar overflow-y-auto">
                                <SignedOut>
                                    <MobileNavLink
                                        to="/sign-in"
                                        onClick={closeMobileMenu}
                                        icon={LogIn}
                                        isActive={location.pathname.startsWith('/sign-in')}
                                    >
                                        Sign In
                                    </MobileNavLink>
                                    <MobileNavLink
                                        to="/sign-up"
                                        onClick={closeMobileMenu}
                                        icon={UserPlus}
                                        isActive={location.pathname.startsWith('/sign-up')}
                                    >
                                        Get Started
                                    </MobileNavLink>
                                </SignedOut>

                                <SignedIn>
                                    <p className="px-4 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                                        Menu
                                    </p>

                                    <MobileNavLink
                                        to="/dashboard"
                                        onClick={closeMobileMenu}
                                        icon={LayoutDashboard}
                                        isActive={location.pathname === '/dashboard'}
                                    >
                                        Dashboard
                                    </MobileNavLink>

                                    <div className="space-y-0.5">
                                        {dashboardNavItems
                                            .filter((item) => item.to !== '/dashboard')
                                            .map((item) => (
                                                <MobileNavLink
                                                    key={item.to}
                                                    to={item.to}
                                                    onClick={closeMobileMenu}
                                                    icon={item.icon}
                                                    isActive={location.pathname === item.to}
                                                >
                                                    {item.label}
                                                </MobileNavLink>
                                            ))}
                                    </div>
                                </SignedIn>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    )
}

export default Navbar