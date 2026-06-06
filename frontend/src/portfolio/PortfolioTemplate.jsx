import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { buildPortfolioSections } from './buildSections'
import { getCssVars, getThemeColors } from './theme'
import './portfolio.css'
import TopBar from './components/TopBar'
import ProfileAside from './components/ProfileAside'
import SectionNav from './components/SectionNav'
import SectionContent from './components/SectionContent'
import Footer from './components/Footer'
import PortfolioScrollArea from './components/PortfolioScrollArea'

const sectionVariants = {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
    exit: { opacity: 0, x: -8, transition: { duration: 0.18 } },
}

function PortfolioTemplate({ profile, username }) {
    const { theme, toggleTheme } = useTheme()
    const portfolioTheme = profile?.theme || 'modern'
    const colors = useMemo(() => getThemeColors(portfolioTheme, theme), [portfolioTheme, theme])
    const cssVars = useMemo(() => getCssVars(colors), [colors])
    const sections = useMemo(() => buildPortfolioSections(profile), [profile])
    const [activeSection, setActiveSection] = useState(sections[0]?.id || 'about')
    const contentRef = useRef(null)

    const activeSectionData = useMemo(
        () => sections.find((section) => section.id === activeSection) || sections[0],
        [sections, activeSection]
    )

    useEffect(() => {
        if (sections.length > 0 && !sections.some((section) => section.id === activeSection)) {
            setActiveSection(sections[0].id)
        }
    }, [sections, activeSection])

    useEffect(() => {
        const hash = window.location.hash.replace('#', '')
        if (hash && sections.some((section) => section.id === hash)) {
            setActiveSection(hash)
        }
    }, [sections])

    useEffect(() => {
        const previousHtmlOverflow = document.documentElement.style.overflow
        const previousBodyOverflow = document.body.style.overflow
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow
            document.body.style.overflow = previousBodyOverflow
        }
    }, [])

    const selectSection = useCallback((sectionId) => {
        setActiveSection(sectionId)
        window.history.replaceState(null, '', `#${sectionId}`)
        requestAnimationFrame(() => {
            contentRef.current?.scrollTo({ top: 0, behavior: 'auto' })
        })
    }, [])

    const { basicDetails, socialLinks, resumeUrl } = profile

    return (
        <div
            id="top"
            className="portfolio-root h-dvh flex flex-col overflow-hidden transition-colors duration-300"
            style={cssVars}
        >
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div
                    className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full blur-3xl opacity-[0.04]"
                    style={{ background: colors.accentSoft }}
                />
            </div>

            <TopBar theme={theme} onToggleTheme={toggleTheme} />

            <div className="relative flex-1 min-h-0 overflow-hidden">
                <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 py-4 lg:py-6">
                    <div className="h-full grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 xl:gap-10 min-h-0">
                        <ProfileAside
                            username={username}
                            basicDetails={basicDetails}
                            socialLinks={socialLinks}
                            resumeUrl={resumeUrl}
                            sections={sections}
                            activeSection={activeSection}
                            onNavigate={selectSection}
                        />

                        <div className="min-h-0 flex flex-col overflow-hidden mt-4 lg:mt-0">
                            <SectionNav
                                sections={sections}
                                activeSection={activeSection}
                                onNavigate={selectSection}
                            />

                            <PortfolioScrollArea
                                ref={contentRef}
                                className="mt-4 lg:mt-5"
                                aria-live="polite"
                                role="main"
                            >
                                <AnimatePresence mode="wait">
                                    {activeSectionData && (
                                        <motion.section
                                            key={activeSectionData.id}
                                            id={activeSectionData.id}
                                            className="portfolio-section-content"
                                            variants={sectionVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            aria-labelledby={`${activeSectionData.id}-heading`}
                                        >
                                            <div id={`${activeSectionData.id}-heading`} className="sr-only">
                                                {activeSectionData.label}
                                            </div>
                                            <SectionContent
                                                section={activeSectionData}
                                                basicDetails={basicDetails}
                                            />
                                        </motion.section>
                                    )}
                                </AnimatePresence>
                            </PortfolioScrollArea>

                            <Footer profile={profile} compact />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioTemplate