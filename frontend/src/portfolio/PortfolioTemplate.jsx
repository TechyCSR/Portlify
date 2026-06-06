import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { buildPortfolioSections } from './buildSections'
import { getCssVars, getThemeColors } from './theme'
import './portfolio.css'
import TopBar from './components/TopBar'
import ProfileAside from './components/ProfileAside'
import SectionNav from './components/SectionNav'
import SectionContent from './components/SectionContent'
import Footer from './components/Footer'

function PortfolioTemplate({ profile, username }) {
    const { theme, toggleTheme } = useTheme()
    const portfolioTheme = profile?.theme || 'modern'
    const colors = useMemo(() => getThemeColors(portfolioTheme, theme), [portfolioTheme, theme])
    const cssVars = useMemo(() => getCssVars(colors), [colors])
    const sections = useMemo(() => buildPortfolioSections(profile), [profile])
    const [activeSection, setActiveSection] = useState(sections[0]?.id || 'about')

    useEffect(() => {
        if (sections.length > 0 && !sections.some((section) => section.id === activeSection)) {
            setActiveSection(sections[0].id)
        }
    }, [sections, activeSection])

    useEffect(() => {
        const sectionIds = sections.map((section) => section.id)
        if (sectionIds.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

                if (visible[0]?.target?.id) {
                    setActiveSection(visible[0].target.id)
                }
            },
            {
                rootMargin: '-20% 0px -55% 0px',
                threshold: [0.1, 0.25, 0.5],
            }
        )

        sectionIds.forEach((id) => {
            const element = document.getElementById(id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [sections])

    const scrollToSection = useCallback((sectionId) => {
        const element = document.getElementById(sectionId)
        if (!element) return
        setActiveSection(sectionId)
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [])

    const { basicDetails, socialLinks, resumeUrl } = profile

    return (
        <div
            id="top"
            className="portfolio-root min-h-screen transition-colors duration-300"
            style={cssVars}
        >
            <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div
                    className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full blur-3xl opacity-[0.04]"
                    style={{ background: colors.accentSoft }}
                />
            </div>

            <TopBar theme={theme} onToggleTheme={toggleTheme} />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 xl:gap-10 lg:items-start">
                    <ProfileAside
                        username={username}
                        basicDetails={basicDetails}
                        socialLinks={socialLinks}
                        resumeUrl={resumeUrl}
                        sections={sections}
                        activeSection={activeSection}
                        onNavigate={scrollToSection}
                    />

                    <div className="min-w-0">
                        <SectionNav
                            sections={sections}
                            activeSection={activeSection}
                            onNavigate={scrollToSection}
                        />

                        <main className="space-y-12 sm:space-y-14 lg:space-y-16 mt-6 lg:mt-0">
                            {sections.map((section) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="portfolio-section"
                                    aria-labelledby={`${section.id}-heading`}
                                >
                                    <div id={`${section.id}-heading`} className="sr-only">
                                        {section.label}
                                    </div>
                                    <SectionContent section={section} basicDetails={basicDetails} />
                                </section>
                            ))}
                        </main>
                    </div>
                </div>
            </div>

            <Footer profile={profile} />
        </div>
    )
}

export default PortfolioTemplate