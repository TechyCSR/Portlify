import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applySiteSeo } from '../utils/seo'
import { getAppUrl } from '../utils/appUrl'
import {
    isPortfolioRoute,
    isPrivateRoute,
    getPrivateRouteTitle,
    resolvePageSeo,
} from '../constants/seo'

function SeoManager() {
    const { pathname } = useLocation()

    useEffect(() => {
        if (isPortfolioRoute(pathname)) return

        const siteUrl = getAppUrl().replace(/\/$/, '')
        const canonical = `${siteUrl}${pathname === '/' ? '/' : pathname}`

        if (isPrivateRoute(pathname)) {
            applySiteSeo({
                title: getPrivateRouteTitle(pathname),
                robots: 'noindex, nofollow',
                canonical,
            })
            return
        }

        const pageSeo = resolvePageSeo(pathname)
        applySiteSeo({
            ...pageSeo,
            canonical,
        })
    }, [pathname])

    return null
}

export default SeoManager