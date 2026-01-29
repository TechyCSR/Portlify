import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { SignIn, SignUp } from '@clerk/clerk-react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import UsernameSelection from './pages/UsernameSelection'
import ResumeUpload from './pages/ResumeUpload'
import ProfileEditor from './pages/ProfileEditor'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import ProtectedRoute from './components/ProtectedRoute'

// Layout wrapper that conditionally shows navbar
function AppLayout({ children }) {
    const location = useLocation()

    // Check if current route is a public portfolio (/:username)
    // Don't show navbar on portfolio pages
    const isPortfolioPage = location.pathname !== '/' &&
        !location.pathname.startsWith('/sign') &&
        !location.pathname.startsWith('/username') &&
        !location.pathname.startsWith('/upload') &&
        !location.pathname.startsWith('/editor') &&
        !location.pathname.startsWith('/dashboard')

    return (
        <>
            {/* Background orbs */}
            <div className="bg-orb orb-1" />
            <div className="bg-orb orb-2" />
            <div className="bg-orb orb-3" />

            <div className="min-h-screen relative">
                {!isPortfolioPage && <Navbar />}
                {children}
            </div>
        </>
    )
}

function AppRoutes() {
    return (
        <AppLayout>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route
                    path="/sign-in/*"
                    element={
                        <div className="min-h-screen flex items-center justify-center pt-20">
                            <SignIn
                                routing="path"
                                path="/sign-in"
                                signUpUrl="/sign-up"
                                appearance={{
                                    variables: {
                                        colorPrimary: '#6366f1',
                                        colorBackground: 'var(--color-surface)',
                                        colorText: 'var(--color-text-primary)',
                                        colorInputBackground: 'var(--color-bg-tertiary)',
                                        colorInputText: 'var(--color-text-primary)',
                                        borderRadius: '12px'
                                    }
                                }}
                            />
                        </div>
                    }
                />
                <Route
                    path="/sign-up/*"
                    element={
                        <div className="min-h-screen flex items-center justify-center pt-20">
                            <SignUp
                                routing="path"
                                path="/sign-up"
                                signInUrl="/sign-in"
                                appearance={{
                                    variables: {
                                        colorPrimary: '#6366f1',
                                        colorBackground: 'var(--color-surface)',
                                        colorText: 'var(--color-text-primary)',
                                        colorInputBackground: 'var(--color-bg-tertiary)',
                                        colorInputText: 'var(--color-text-primary)',
                                        borderRadius: '12px'
                                    }
                                }}
                            />
                        </div>
                    }
                />

                {/* Protected routes */}
                <Route path="/username" element={
                    <ProtectedRoute>
                        <UsernameSelection />
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
