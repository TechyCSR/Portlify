import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

const PortfolioScrollArea = forwardRef(function PortfolioScrollArea(
    { children, className = '', innerClassName = '', ...props },
    ref
) {
    const scrollRef = useRef(null)
    const [canScrollUp, setCanScrollUp] = useState(false)
    const [canScrollDown, setCanScrollDown] = useState(false)

    const setRefs = useCallback((node) => {
        scrollRef.current = node
        if (typeof ref === 'function') {
            ref(node)
        } else if (ref) {
            ref.current = node
        }
    }, [ref])

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current
        if (!el) return

        const { scrollTop, clientHeight, scrollHeight } = el
        setCanScrollUp(scrollTop > 6)
        setCanScrollDown(scrollTop + clientHeight < scrollHeight - 6)
    }, [])

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

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
    }, [updateScrollState, children])

    return (
        <div className={`portfolio-scroll-area relative flex-1 min-h-0 ${className}`}>
            {canScrollUp && (
                <div className="portfolio-scroll-fade portfolio-scroll-fade-top" aria-hidden="true" />
            )}

            <div
                ref={setRefs}
                className={`portfolio-scroll portfolio-section-panel h-full overflow-y-auto ${innerClassName}`}
                {...props}
            >
                {children}
            </div>

            {canScrollDown && (
                <div className="portfolio-scroll-fade portfolio-scroll-fade-bottom" aria-hidden="true" />
            )}
        </div>
    )
})

export default PortfolioScrollArea