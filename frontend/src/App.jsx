import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import UsernameSelection from './pages/UsernameSelection'
import ResumeUpload from './pages/ResumeUpload'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <Router>
            {/* Background orbs */}
            <div className="bg-orb orb-1" />
            <div className="bg-orb orb-2" />
            <div className="bg-orb orb-3" />

            <div className="min-h-screen relative">
                <Navbar />

                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Landing />} />
                    <Route
                        path="/sign-in/*"
                        element={
                            <div className="min-h-screen flex items-center justify-center pt-20">
                                <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
                            </div>
                        }
                    />
                    <Route
                        path="/sign-up/*"
                        element={
                            <div className="min-h-screen flex items-center justify-center pt-20">
                                <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
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
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    {/* Public portfolio route - must be last */}
                    <Route path="/:username" element={<Portfolio />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
