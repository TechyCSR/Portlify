import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicProfile, API_URL } from '../utils/api'
import { useTheme } from '../context/ThemeContext'
import { getThemeColors } from '../portfolio/theme'
import PortfolioTemplate from '../portfolio/PortfolioTemplate'
import LoadingState from '../portfolio/components/LoadingState'
import ErrorState from '../portfolio/components/ErrorState'
import { applySiteSeo, buildPortfolioSeo, resetSiteSeo } from '../utils/seo'
import { getTrackingReferrer } from '../utils/referrer'

function Portfolio() {
    const { username } = useParams()
    const { theme } = useTheme()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const fallbackColors = useMemo(() => getThemeColors('modern', theme), [theme])

    useEffect(() => {
        let cancelled = false

        const fetchProfile = async () => {
            setLoading(true)
            setError('')

            try {
                const { data } = await getPublicProfile(username)
                if (cancelled) return

                setProfile(data)
                applySiteSeo(buildPortfolioSeo(data, username))

                const viewKey = `viewed_${username}`
                if (!sessionStorage.getItem(viewKey)) {
                    sessionStorage.setItem(viewKey, '1')
                    fetch(`${API_URL}/api/analytics/track/${encodeURIComponent(username)}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ referrer: getTrackingReferrer() }),
                    }).catch(() => {})
                }
            } catch (err) {
                if (cancelled) return
                setError(err.response?.status === 404 ? 'Profile not found' : 'Failed to load profile')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchProfile()

        return () => {
            cancelled = true
            resetSiteSeo()
        }
    }, [username])

    if (loading) {
        return <LoadingState colors={fallbackColors} />
    }

    if (error || !profile) {
        return <ErrorState colors={fallbackColors} message={error || 'Profile not found'} />
    }

    return <PortfolioTemplate profile={profile} username={username} />
}

export default Portfolio