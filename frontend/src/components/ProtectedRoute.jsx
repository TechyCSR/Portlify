import { useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const { isLoaded, isSignedIn } = useAuth()
    const location = useLocation()

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner" />
            </div>
        )
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute
