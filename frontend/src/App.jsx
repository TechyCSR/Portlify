import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { SignIn, SignUp, ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import UsernameSelection from './pages/UsernameSelection'
import Onboarding from './pages/Onboarding'
import ResumeUpload from './pages/ResumeUpload'
import ProfileEditor from './pages/ProfileEditor'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import Portfolio from './pages/Portfolio'
import ProtectedRoute from './components/ProtectedRoute'

// Clerk appearance config based on theme
const getClerkAppearance = (theme) => ({
    baseTheme: theme === 'dark' ? undefined : undefined,
    variables: {
        colorPrimary: '#6366f1',
        colorBackground: theme === 'dark' ? '#1e1e2a' : '#ffffff',
        colorText: theme === 'dark' ? '#ffffff' : '#0f172a',
        colorTextSecondary: theme === 'dark' ? '#a0a0b0' : '#475569',
        colorInputBackground: theme === 'dark' ? '#1a1a25' : '#f1f5f9',
        colorInputText: theme === 'dark' ? '#ffffff' : '#0f172a',
        colorNeutral: theme === 'dark' ? '#a0a0b0' : '#475569',
        borderRadius: '12px',
        fontFamily: 'Inter, system-ui, sans-serif'
    },
    elements: {
        rootBox: {
            boxShadow: theme === 'dark'
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
        },
        card: {
            backgroundColor: theme === 'dark' ? '#1e1e2a' : '#ffffff',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: 'none'
        },
        headerTitle: {
            color: theme === 'dark' ? '#ffffff' : '#0f172a'
        },
        headerSubtitle: {
            color: theme === 'dark' ? '#a0a0b0' : '#475569'
        },
        socialButtonsBlockButton: {
            backgroundColor: theme === 'dark' ? '#12121a' : '#f8fafc',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            color: theme === 'dark' ? '#ffffff' : '#0f172a',
            '&:hover': {
                backgroundColor: theme === 'dark' ? '#1a1a25' : '#f1f5f9'
            }
        },
        formFieldLabel: {
            color: theme === 'dark' ? '#a0a0b0' : '#475569'
        },
        formFieldInput: {
            backgroundColor: theme === 'dark' ? '#12121a' : '#f8fafc',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            color: theme === 'dark' ? '#ffffff' : '#0f172a',
            '&:focus': {
                borderColor: '#6366f1',
                boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)'
            }
        },
        formButtonPrimary: {
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5, #9333ea)'
            }
        },
        footerActionLink: {
            color: '#6366f1'
        },
        identityPreviewText: {
            color: theme === 'dark' ? '#ffffff' : '#0f172a'
        },
        identityPreviewEditButton: {
            color: '#6366f1'
        },
        formFieldHintText: {
            color: theme === 'dark' ? '#6b6b7b' : '#94a3b8'
        },
        dividerLine: {
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        },
        dividerText: {
            color: theme === 'dark' ? '#6b6b7b' : '#94a3b8'
        },
        userButtonPopoverCard: {
            backgroundColor: theme === 'dark' ? '#1e1e2a' : '#ffffff',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
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
    }
})

// Layout wrapper that conditionally shows navbar
function AppLayout({ children }) {
    const location = useLocation()
    const { theme } = useTheme()

    // Check if current route is a public portfolio (/:username)
    const isPortfolioPage = location.pathname !== '/' &&
        !location.pathname.startsWith('/sign') &&
        !location.pathname.startsWith('/username') &&
        !location.pathname.startsWith('/onboarding') &&
        !location.pathname.startsWith('/upload') &&
        !location.pathname.startsWith('/editor') &&
        !location.pathname.startsWith('/dashboard') &&
        !location.pathname.startsWith('/settings') &&
        !location.pathname.startsWith('/analytics')

    const clerkAppearance = getClerkAppearance(theme)

    return (
        <>
            {/* Background orbs */}
            <div className="bg-orb orb-1" />
            <div className="bg-orb orb-2" />
            <div className="bg-orb orb-3" />

            <div className="min-h-screen relative">
                {!isPortfolioPage && <Navbar clerkAppearance={clerkAppearance} />}
                {children}
            </div>
        </>
    )
}

function SignInPage() {
    const { theme } = useTheme()
    return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                appearance={getClerkAppearance(theme)}
            />
        </div>
    )
}

function SignUpPage() {
    const { theme } = useTheme()
    return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                appearance={getClerkAppearance(theme)}
            />
        </div>
    )
}

function AppRoutes() {
    return (
        <AppLayout>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />

                {/* Protected routes */}
                <Route path="/username" element={
                    <ProtectedRoute>
                        <UsernameSelection />
                    </ProtectedRoute>
                } />
                <Route path="/onboarding" element={
                    <ProtectedRoute>
                        <Onboarding />
                    </ProtectedRoute>
                } />
                <Route path="/upload" element={
                    <ProtectedRoute>
                        <ResumeUpload />
                    </ProtectedRoute>
                } />
                <Route path="/editor" element={
                    <ProtectedRoute>
                        <ProfileEditor />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                    <ProtectedRoute>
                        <Analytics />
                    </ProtectedRoute>
                } />

                {/* Public portfolio route - must be last */}
                <Route path="/:username" element={<Portfolio />} />
            </Routes>
        </AppLayout>
    )
}

function App() {
    return (
        <ThemeProvider>
            <Router>
                <AppRoutes />
            </Router>
        </ThemeProvider>
    )
}

export default App
