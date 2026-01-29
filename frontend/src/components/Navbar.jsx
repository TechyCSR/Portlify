import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

function Navbar() {
    const { user } = useUser()

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass-dark"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="font-display font-bold text-xl heading-gradient">
                            Portlify
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-4">
                        <SignedOut>
                            <Link to="/sign-in" className="text-dark-300 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link to="/sign-up" className="btn-primary text-sm">
                                Get Started
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <Link
                                to="/dashboard"
                                className="text-dark-300 hover:text-white transition-colors"
                            >
                                Dashboard
                            </Link>
                            {user?.username && (
                                <Link
                                    to={`/${user.username}`}
                                    className="text-dark-300 hover:text-white transition-colors"
                                >
                                    My Portfolio
                                </Link>
                            )}
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: 'w-10 h-10 ring-2 ring-primary-500/50'
                                    }
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar
