import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { SignIn, SignUp } from '@clerk/clerk-react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Landing from './pages/Landing'
import UsernameSelection from './pages/UsernameSelection'
import Onboarding from './pages/Onboarding'
import ResumeUpload from './pages/ResumeUpload'
import ProfileEditor from './pages/ProfileEditor'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import Premium from './pages/Premium'
import Portfolio from './pages/Portfolio'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import { getClerkAppearance } from './utils/clerkAppearance'

// Layout wrapper that conditionally shows navbar
function AppLayout({ children }) {
    const location = useLocation()

    // Check if current route is a public portfolio (/:username)
    const isPortfolioPage = location.pathname !== '/' &&
        !location.pathname.startsWith('/sign') &&
        !location.pathname.startsWith('/username') &&
        !location.pathname.startsWith('/onboarding') &&
        !location.pathname.startsWith('/upload') &&
        !location.pathname.startsWith('/editor') &&
        !location.pathname.startsWith('/dashboard') &&
        !location.pathname.startsWith('/settings') &&
        !location.pathname.startsWith('/analytics') &&
        !location.pathname.startsWith('/premium')

    return (
        <>
            {/* Background orbs — clipped so they never cause horizontal scroll */}
            <div className="orb-container" aria-hidden="true">
                <div className="bg-orb orb-1" />
                <div className="bg-orb orb-2" />
                <div className="bg-orb orb-3" />
            </div>

            <div className="min-h-screen relative overflow-x-clip">
                {!isPortfolioPage && <Navbar />}
                {children}
            </div>
        </>
    )
}

function SignInPage() {
    const { theme } = useTheme()
    const location = useLocation()
    const redirectUrl = location.state?.from?.pathname || '/dashboard'

    return (
        <div className="min-h-screen flex items-center justify-center pt-navbar">
            <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                forceRedirectUrl={redirectUrl}
                fallbackRedirectUrl="/dashboard"
                appearance={getClerkAppearance(theme)}
            />
        </div>
    )
}

function SignUpPage() {
    const { theme } = useTheme()
    return (
        <div className="min-h-screen flex items-center justify-center pt-navbar">
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
                <Route element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>
                    <Route path="/upload" element={<ResumeUpload />} />
                    <Route path="/editor" element={<ProfileEditor />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/premium" element={<Premium />} />
                </Route>

                {/* Public portfolio route - must be last */}
                <Route path="/:username" element={<Portfolio />} />
            </Routes>
        </AppLayout>
    )
}

function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <Router>
                    <ScrollToTop />
                    <AppRoutes />
                </Router>
            </ToastProvider>
        </ThemeProvider>
    )
}

export default App
