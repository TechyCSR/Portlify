import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getMyProfile } from '../utils/api'
import { hasCompletedProfileSetup, isMissingProfileError } from '../utils/profileSetup'
import { ErrorState, LoadingState } from '../components/AsyncState'

function PostAuthRedirect() {
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [retryCount, setRetryCount] = useState(0)

    const resolveDestination = useCallback(async (cancelledRef) => {
        setError('')

        try {
            const { data: user } = await getCurrentUser()

            if (!user?.username) {
                if (!cancelledRef.current) navigate('/username', { replace: true })
                return
            }

            if (!user.onboardingCompleted) {
                if (!cancelledRef.current) navigate('/onboarding', { replace: true })
                return
            }

            try {
                const { data: profile } = await getMyProfile()
                if (!cancelledRef.current) {
                    navigate(hasCompletedProfileSetup(profile) ? '/dashboard' : '/upload', { replace: true })
                }
            } catch (err) {
                if (cancelledRef.current) return
                if (isMissingProfileError(err)) {
                    navigate('/upload', { replace: true })
                } else {
                    setError(err.response?.data?.error || 'Failed to load your profile. Please try again.')
                }
            }
        } catch (err) {
            if (cancelledRef.current) return
            if (err.response?.data?.needsRegistration) {
                navigate('/username', { replace: true })
            } else {
                setError(err.response?.data?.error || 'Failed to load your account. Please try again.')
            }
        }
    }, [navigate])

    useEffect(() => {
        const cancelledRef = { current: false }
        resolveDestination(cancelledRef)

        return () => {
            cancelledRef.current = true
        }
    }, [resolveDestination, retryCount])

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={() => setRetryCount((count) => count + 1)}
            />
        )
    }

    return <LoadingState message="Getting things ready..." />
}

export default PostAuthRedirect