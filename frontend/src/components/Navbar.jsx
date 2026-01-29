import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
    const { theme } = useTheme()

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

                    {/* Navigation */}
                    <div className="flex items-center space-x-3">
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
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar
