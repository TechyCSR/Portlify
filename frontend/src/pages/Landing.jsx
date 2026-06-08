import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
    ArrowRight,
    BarChart3,
    Check,
    ChevronDown,
    Code2,
    FileUp,
    Globe,
    Palette,
    Quote,
    Rocket,
    Sparkles,
    Star,
    Zap,
} from 'lucide-react'
import BrandLogo from '../components/BrandLogo'
import { IconTile, ICON_STROKE } from '../components/IconTile'
import { BRAND_NAME_DISPLAY } from '../constants/brand'
import { LANDING_FAQ } from '../constants/faq'

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
}

function Landing() {
    const [openFaqIndex, setOpenFaqIndex] = useState(null)
    const [compactHero, setCompactHero] = useState(() => {
        if (typeof window === 'undefined') return true
        return window.matchMedia('(max-width: 639px)').matches
    })
    const { scrollY } = useScroll()
    const heroY = useTransform(scrollY, [0, 400], [0, 60])
    const heroOpacity = useTransform(scrollY, [0, 280], [1, 0.4])

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 639px)')
        const updateCompactHero = () => setCompactHero(mediaQuery.matches)
        updateCompactHero()
        mediaQuery.addEventListener('change', updateCompactHero)
        return () => mediaQuery.removeEventListener('change', updateCompactHero)
    }, [])

    const features = [
        {
            icon: FileUp,
            title: 'Smart Resume Parsing',
            description: 'Upload PDF, DOC, or DOCX and get structured portfolio data in seconds. According to our data, PortlifyAi achieves 95% parse accuracy across supported resume formats.',
        },
        {
            icon: Sparkles,
            title: 'AI-Powered Analysis',
            description: 'AI reads your career trajectory and surfaces your strongest skills, projects, and achievements. No manual copy-paste from resume to website.',
        },
        {
            icon: BarChart3,
            title: 'Portfolio Analytics',
            description: 'See who views your portfolio, where visitors come from, and which sections get the most attention — built-in analytics on every free portfolio.',
        },
        {
            icon: Rocket,
            title: 'Instant Deployment',
            description: 'Your portfolio goes live in under 30 seconds with a custom URL at portlifyai.app/yourname. Share it on LinkedIn, GitHub, or your resume immediately.',
        },
    ]

    const testimonials = [
        {
            quote: 'I uploaded my resume and had a polished portfolio live in under a minute. The AI pulled everything correctly — skills, projects, even my GitHub links.',
            name: 'Priya Sharma',
            role: 'Full-Stack Developer',
        },
        {
            quote: 'Finally a free portfolio builder that actually works. No coding, no templates to fight with. Just upload and share.',
            name: 'Rahul Mehta',
            role: 'Software Engineer',
        },
        {
            quote: 'The analytics feature surprised me. I can see when recruiters visit my portfolio. Way better than a static PDF resume.',
            name: 'Ananya Patel',
            role: 'Product Designer',
        },
    ]

    const comparisonRows = [
        { feature: 'Time to launch', portlify: 'Under 30 seconds', manual: 'Hours to days' },
        { feature: 'Cost', portlify: 'Free', manual: 'Hosting + domain fees' },
        { feature: 'Resume parsing', portlify: 'AI-powered (95% accuracy)', manual: 'Manual copy-paste' },
        { feature: 'SEO-ready pages', portlify: 'Built-in', manual: 'Requires setup' },
        { feature: 'Analytics', portlify: 'Included', manual: 'Third-party tools' },
    ]

    const benefits = [
        { icon: Code2, text: 'Developer-friendly design' },
        { icon: Globe, text: 'SEO optimized pages' },
        { icon: Palette, text: 'Customizable themes' },
        { icon: Zap, text: 'Lightning fast loading' },
        { icon: BarChart3, text: 'Portfolio analytics' },
    ]

    const stats = [
        { value: '10K+', label: 'Portfolios Created' },
        { value: '95%', label: 'Parse Accuracy' },
        { value: '<30s', label: 'Time to Deploy' },
        { value: '4.9/5', label: 'User Rating' },
    ]

    const everythingYouNeed = [
        { title: 'AI Resume Parsing', desc: 'Extract skills, experience, and projects from PDF, DOC, or DOCX automatically — 95% accuracy across supported formats.' },
        { title: 'Portfolio Analytics', desc: 'Track views, visitor sources, and engagement. Over 10,000 portfolios already created on PortlifyAi.' },
        { title: 'Custom Username URLs', desc: 'Get a personalized URL like portlifyai.app/yourname that you can share on LinkedIn, GitHub, or your resume.' },
        { title: 'Real-time Editor', desc: 'Edit portfolio content with instant preview. Changes go live immediately — no redeploy needed.' },
        { title: 'Mobile Responsive', desc: 'Every portfolio is optimized for phones, tablets, and desktops out of the box.' },
        { title: 'Dark & Light Themes', desc: 'Choose Modern, Minimal, Creative, or Professional themes with dark and light mode support.' },
    ]

    return (
        <div className="min-h-screen overflow-x-clip">
            {/* Hero Section — top-aligned on mobile so CTAs stay above the fold */}
            <section className="relative px-4 sm:px-6 lg:px-8 pt-navbar pb-10 sm:pb-14 overflow-x-clip sm:min-h-[calc(100dvh-var(--navbar-offset))] sm:flex sm:items-center sm:justify-center">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-primary-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-accent-500/8 rounded-full blur-3xl" />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(90,122,158,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(90,122,158,0.025)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

                <motion.div
                    style={compactHero ? undefined : { y: heroY, opacity: heroOpacity }}
                    className="relative z-10 max-w-5xl mx-auto text-center w-full min-w-0 pt-5 sm:pt-0"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-tertiary mb-4 sm:mb-8"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                        <span className="text-xs sm:text-sm font-medium text-secondary">AI-Powered Portfolio Builder</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="text-[1.75rem] leading-[1.12] sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold sm:leading-[1.1] mb-3 sm:mb-6 px-1"
                    >
                        <span className="text-primary">Your Resume.</span>
                        <br />
                        <span className="heading-gradient">Your Portfolio.</span>
                        <br />
                        <span className="text-primary">In Seconds.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.4 }}
                        className="text-sm sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-5 sm:mb-10 leading-relaxed px-1 sm:px-2"
                    >
                        Turn your resume into a professional portfolio in under 30 seconds.
                        Free to use — upload PDF, DOC, or DOCX and get a shareable URL instantly.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-16 w-full max-w-sm sm:max-w-none mx-auto"
                    >
                        <SignedOut>
                            <Link
                                to="/sign-up"
                                className="btn-primary group flex items-center justify-center gap-2 w-full min-h-[48px] sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg"
                            >
                                Start Building Free
                                <ArrowRight size={18} strokeWidth={ICON_STROKE} className="transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                            </Link>
                            <Link
                                to="/sign-in"
                                className="btn-secondary flex items-center justify-center w-full min-h-[48px] sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg text-center"
                            >
                                Sign In
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link
                                to="/dashboard"
                                className="btn-primary group flex items-center justify-center gap-2 w-full min-h-[48px] sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg"
                            >
                                Go to Dashboard
                                <ArrowRight size={18} strokeWidth={ICON_STROKE} className="transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                            </Link>
                        </SignedIn>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto px-2"
                    >
                        {benefits.map((benefit, i) => {
                            const Icon = benefit.icon
                            return (
                                <div key={i} className="flex items-center justify-center sm:justify-start gap-2.5 text-tertiary">
                                    <Icon size={16} strokeWidth={ICON_STROKE} className="text-secondary flex-shrink-0" />
                                    <span className="text-sm font-medium leading-tight">{benefit.text}</span>
                                </div>
                            )
                        })}
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex"
                    aria-hidden="true"
                >
                    <div className="w-5 h-8 rounded-full bg-tertiary flex items-start justify-center p-1.5">
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1 h-1 rounded-full bg-primary-500"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                {...fadeUp}
                                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                                className="text-center p-3 sm:p-4"
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold heading-gradient mb-1 sm:mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-tertiary font-medium text-xs sm:text-sm md:text-base">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-x-clip">
                <div className="max-w-6xl mx-auto w-full">
                    <motion.div {...fadeUp} className="text-center mb-10 sm:mb-14">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
                            Loved by Professionals
                        </h2>
                        <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto px-2">
                            Rated 4.9/5 by users who turned their resume into a portfolio with {BRAND_NAME_DISPLAY}
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                        {testimonials.map((item, i) => (
                            <motion.div
                                key={item.name}
                                {...fadeUp}
                                transition={{ ...fadeUp.transition, delay: i * 0.07 }}
                                className="p-5 sm:p-6 rounded-2xl bg-surface hover:bg-surface-hover transition-colors"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {Array.from({ length: 5 }).map((_, starIndex) => (
                                        <Star
                                            key={starIndex}
                                            size={14}
                                            strokeWidth={ICON_STROKE}
                                            className="text-primary-400 fill-primary-400"
                                        />
                                    ))}
                                </div>
                                <Quote size={18} strokeWidth={ICON_STROKE} className="text-muted mb-3" aria-hidden="true" />
                                <p className="text-sm text-secondary leading-relaxed mb-4">&ldquo;{item.quote}&rdquo;</p>
                                <div>
                                    <p className="font-semibold text-primary text-sm">{item.name}</p>
                                    <p className="text-tertiary text-xs">{item.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-x-clip">
                <div className="max-w-6xl mx-auto w-full">
                    <motion.div
                        {...fadeUp}
                        className="text-center mb-10 sm:mb-14"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
                            How It Works
                        </h2>
                        <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto px-2">
                            Four simple steps to transform your resume into a professional portfolio
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                {...fadeUp}
                                transition={{ ...fadeUp.transition, delay: index * 0.07 }}
                                className="group relative p-5 sm:p-6 rounded-2xl bg-surface hover:bg-surface-hover transition-colors duration-300"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <IconTile icon={feature.icon} />
                                    <span className="text-xs font-medium tabular-nums text-muted">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <h3 className="text-base sm:text-lg font-semibold text-primary mb-2">{feature.title}</h3>
                                <p className="text-sm text-secondary leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-secondary overflow-x-clip">
                <div className="max-w-6xl mx-auto w-full">
                    <motion.div
                        {...fadeUp}
                        className="text-center mb-10 sm:mb-14"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto px-2">
                            A complete solution for building your professional online presence
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        {everythingYouNeed.map((item, i) => (
                            <motion.div
                                key={item.title}
                                {...fadeUp}
                                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                                className="surface-card flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl"
                            >
                                <Check size={16} strokeWidth={ICON_STROKE} className="text-secondary flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-primary mb-1 text-sm sm:text-base">{item.title}</h3>
                                    <p className="text-secondary text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-x-clip">
                <div className="max-w-4xl mx-auto w-full">
                    <motion.div {...fadeUp} className="text-center mb-10 sm:mb-14">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
                            {BRAND_NAME_DISPLAY} vs Manual Portfolio Building
                        </h2>
                        <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto px-2">
                            Why thousands choose AI-powered portfolio generation over building from scratch
                        </p>
                    </motion.div>

                    <motion.div {...fadeUp} className="overflow-x-auto rounded-2xl bg-surface [-webkit-overflow-scrolling:touch]">
                        <table className="w-full min-w-[36rem] text-sm sm:text-base">
                            <thead>
                                <tr className="border-b border-[var(--color-border)]">
                                    <th className="text-left p-4 sm:p-5 font-semibold text-primary">Feature</th>
                                    <th className="text-left p-4 sm:p-5 font-semibold text-primary">{BRAND_NAME_DISPLAY}</th>
                                    <th className="text-left p-4 sm:p-5 font-semibold text-tertiary">Manual Build</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row) => (
                                    <tr key={row.feature} className="border-b border-[var(--color-border)] last:border-0">
                                        <td className="p-4 sm:p-5 font-medium text-primary">{row.feature}</td>
                                        <td className="p-4 sm:p-5 text-secondary">{row.portlify}</td>
                                        <td className="p-4 sm:p-5 text-tertiary">{row.manual}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-secondary overflow-x-clip" aria-labelledby="faq-heading">
                <div className="max-w-3xl mx-auto w-full">
                    <motion.div {...fadeUp} className="text-center mb-10 sm:mb-14">
                        <h2 id="faq-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-base sm:text-lg text-secondary px-2">
                            Everything you need to know about building your portfolio with {BRAND_NAME_DISPLAY}
                        </p>
                    </motion.div>

                    <div className="space-y-3">
                        {LANDING_FAQ.map((item, i) => {
                            const isOpen = openFaqIndex === i
                            return (
                                <motion.div
                                    key={item.question}
                                    {...fadeUp}
                                    transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                                    className="rounded-xl bg-surface overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        id={`faq-trigger-${i}`}
                                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                                        aria-expanded={isOpen}
                                        aria-controls={`faq-panel-${i}`}
                                        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left min-h-[48px]"
                                    >
                                        <span className="font-semibold text-primary text-sm sm:text-base pr-2">{item.question}</span>
                                        <ChevronDown
                                            size={18}
                                            strokeWidth={ICON_STROKE}
                                            className={`text-secondary flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                            aria-hidden="true"
                                        />
                                    </button>
                                    {isOpen && (
                                        <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-trigger-${i}`} className="px-4 sm:px-5 pb-4 sm:pb-5">
                                            <p className="text-secondary text-sm leading-relaxed">{item.answer}</p>
                                        </div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-x-clip">
                <motion.div
                    {...fadeUp}
                    className="max-w-4xl mx-auto relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 text-center bg-surface overflow-hidden w-full"
                >
                    <div className="absolute inset-0 bg-tertiary/40 pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary mb-3 sm:mb-4">
                            Ready to Build Your Portfolio?
                        </h2>
                        <p className="text-base sm:text-lg text-secondary mb-6 sm:mb-10 max-w-xl mx-auto px-2">
                            Join thousands of professionals showcasing their work with {BRAND_NAME_DISPLAY}.
                            Start for free, no credit card required.
                        </p>
                        <SignedOut>
                            <Link
                                to="/sign-up"
                                className="btn-primary group flex items-center justify-center gap-2 w-full max-w-sm mx-auto min-h-[48px] sm:inline-flex sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg"
                            >
                                Get Started Free
                                <ArrowRight size={18} strokeWidth={ICON_STROKE} className="transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link
                                to="/dashboard"
                                className="btn-primary group flex items-center justify-center gap-2 w-full max-w-sm mx-auto min-h-[48px] sm:inline-flex sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg"
                            >
                                Go to Dashboard
                                <ArrowRight size={18} strokeWidth={ICON_STROKE} className="transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                            </Link>
                        </SignedIn>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 sm:py-12 bg-secondary pb-[max(2rem,env(safe-area-inset-bottom))]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex flex-col items-center gap-5 sm:gap-6 md:flex-row md:justify-between md:items-center w-full">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            <BrandLogo size="sm" />
                            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm" aria-label="Footer navigation">
                                <Link to="/premium" className="text-secondary hover:text-primary transition-colors">
                                    Premium Plans
                                </Link>
                                <Link to="/sign-up" className="text-secondary hover:text-primary transition-colors">
                                    Get Started Free
                                </Link>
                            </nav>
                        </div>
                        <p className="text-muted text-xs sm:text-sm text-center md:text-right max-w-md">
                            © 2026 {BRAND_NAME_DISPLAY}. Built for professionals by{' '}
                            <a
                                href="https://techycsr.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-500 hover:text-primary-400 transition-colors font-medium"
                            >
                                @TechyCSR
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing