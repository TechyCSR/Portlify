import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollToTop() {
    const { pathname } = useLocation()

    useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'
        }

        document.documentElement.dataset.routeChanging = 'true'
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

        requestAnimationFrame(() => {
            delete document.documentElement.dataset.routeChanging
        })
    }, [pathname])

    return null
}

export default ScrollToTop