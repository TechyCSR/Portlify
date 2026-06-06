import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)'

const PortfolioScrollArea = forwardRef(function PortfolioScrollArea(
    { children, className = '', innerClassName = '', ...props },
    ref
) {
    const scrollRef = useRef(null)
    const [canScrollUp, setCanScrollUp] = useState(false)
    const [canScrollDown, setCanScrollDown] = useState(false)
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window === 'undefined') return true
        return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
    })

    const setRefs = useCallback((node) => {
        scrollRef.current = node
        if (typeof ref === 'function') {
            ref(node)
        } else if (ref) {
            ref.current = node
        }
    }, [ref])

    useEffect(() => {
        const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
        const syncViewport = () => setIsDesktop(mediaQuery.matches)

        syncViewport()
        mediaQuery.addEventListener('change', syncViewport)
        return () => mediaQuery.removeEventListener('change', syncViewport)
    }, [])

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current
        if (!el || !isDesktop) {
            setCanScrollUp(false)
            setCanScrollDown(false)
            return
        }

        const { scrollTop, clientHeight, scrollHeight } = el
        setCanScrollUp(scrollTop > 6)
        setCanScrollDown(scrollTop + clientHeight < scrollHeight - 6)
    }, [isDesktop])

    useEffect(() => {
        if (!isDesktop) {
            setCanScrollUp(false)
            setCanScrollDown(false)
            return undefined
        }

        const el = scrollRef.current
        if (!el) return undefined

        updateScrollState()

        const handleScroll = () => updateScrollState()
        el.addEventListener('scroll', handleScroll, { passive: true })

        const resizeObserver = new ResizeObserver(updateScrollState)
        resizeObserver.observe(el)

        const mutationObserver = new MutationObserver(updateScrollState)
        mutationObserver.observe(el, { childList: true, subtree: true })

        return () => {
            el.removeEventListener('scroll', handleScroll)
            resizeObserver.disconnect()
            mutationObserver.disconnect()
        }
    }, [updateScrollState, children, isDesktop])

    return (
        <div className={`portfolio-scroll-area relative ${className}`}>
            {isDesktop && canScrollUp && (
                <div className="portfolio-scroll-fade portfolio-scroll-fade-top portfolio-mobile-scroll-fade" aria-hidden="true" />
            )}

            <div
                ref={setRefs}
                className={`portfolio-scroll portfolio-section-panel lg:h-full lg:overflow-y-auto ${innerClassName}`}
                {...props}
            >
                {children}
            </div>

            {isDesktop && canScrollDown && (
                <div className="portfolio-scroll-fade portfolio-scroll-fade-bottom portfolio-mobile-scroll-fade" aria-hidden="true" />
            )}
        </div>
    )
})

export default PortfolioScrollArea