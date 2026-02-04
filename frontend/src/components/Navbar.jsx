import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, UserCog, Upload, BarChart2, Sparkles, Settings } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
    const { theme } = useTheme()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Clerk appearance for UserButton based on theme
    const userButtonAppearance = {
        elements: {
            avatarBox: 'w-10 h-10 ring-2 ring-primary-500/30 ring-offset-2 ring-offset-transparent',
            userButtonPopoverCard: {
                backgroundColor: theme === 'dark' ? '#1e1e2a' : '#ffffff',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: theme === 'dark'
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
            },
            userButtonPopoverActionButton: {
                color: theme === 'dark' ? '#ffffff' : '#0f172a',
                '&:hover': {
                    backgroundColor: theme === 'dark' ? '#12121a' : '#f1f5f9'
                }
            },
            userButtonPopoverActionButtonText: {
                color: theme === 'dark' ? '#ffffff' : '#0f172a'
            },
            userButtonPopoverActionButtonIcon: {
                color: theme === 'dark' ? '#a0a0b0' : '#475569'
            },
            userPreviewMainIdentifier: {
                color: theme === 'dark' ? '#ffffff' : '#0f172a'
            },
            userPreviewSecondaryIdentifier: {
                color: theme === 'dark' ? '#a0a0b0' : '#475569'
            }
        },
        variables: {
            colorPrimary: '#6366f1',
            colorBackground: theme === 'dark' ? '#1e1e2a' : '#ffffff',
            colorText: theme === 'dark' ? '#ffffff' : '#0f172a'
        }
    }

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 glass"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ background: 'var(--gradient-primary)' }}
                        >
                            <span className="text-white font-bold text-xl">P</span>
                        </motion.div>
                        <span className="font-display font-bold text-xl heading-gradient">
                            Portlify
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-3">
                        <ThemeToggle />

                        <SignedOut>
                            <Link
                                to="/sign-in"
                                className="px-4 py-2 text-secondary hover:text-primary transition-colors font-medium"
                            >
                                Sign In
                            </Link>
                            <Link to="/sign-up" className="btn-primary text-sm">
                                Get Started
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <Link
                                to="/dashboard"
                                className="px-4 py-2 text-secondary hover:text-primary transition-colors font-medium"
                            >
                                Dashboard
                            </Link>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={userButtonAppearance}
                            />
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-all"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-border overflow-hidden"
                        style={{ background: 'var(--color-surface)' }}
                    >
                        <div className="px-4 py-4 space-y-3">
                            <SignedOut>
                                <Link
                                    to="/sign-in"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:text-primary hover:bg-white/5 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign In
                                </Link>
                                <Link
                                    to="/sign-up"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white font-medium"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Get Started
                                </Link>
                            </SignedOut>

                            <SignedIn>
                                {/* User Account Section */}
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={userButtonAppearance}
                                    />
                                    <span className="text-primary text-sm font-medium">My Account</span>
                                </div>

                                {/* Dashboard Navigation Links */}
                                <div className="space-y-1">
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:text-primary hover:bg-white/5 transition-all"
                                    >
                                        <LayoutDashboard size={20} />
                                        Overview
                                    </Link>
                                    <Link
                                        to="/editor"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:text-primary hover:bg-white/5 transition-all"
                                    >
                                        <UserCog size={20} />
                                        Edit Profile
                                    </Link>
                                    <Link
                                        to="/upload"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:text-primary hover:bg-white/5 transition-all"
                                    >
                                        <Upload size={20} />
                                        Upload Resume
                                    </Link>
                                    <Link
                                        to="/analytics"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:text-primary hover:bg-white/5 transition-all"
                                    >
                                        <BarChart2 size={20} />
                                        Analytics
                                    </Link>
                                    <Link
                                        to="/premium"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:text-primary hover:bg-white/5 transition-all"
                                    >
                                        <Sparkles size={20} />
                                        Premium
                                    </Link>
                                    <Link
                                        to="/settings"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:text-primary hover:bg-white/5 transition-all"
                                    >
                                        <Settings size={20} />
                                        Settings
                                    </Link>
                                </div>
                            </SignedIn>

                            {/* Theme Toggle in Mobile Menu */}
                            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5">
                                <span className="text-secondary text-sm font-medium">Theme</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar
