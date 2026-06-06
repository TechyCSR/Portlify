import { Link } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
    ArrowRight,
    BarChart3,
    Check,
    Code2,
    FileUp,
    Globe,
    Palette,
    Rocket,
    Sparkles,
    Zap,
} from 'lucide-react'
import { IconTile, ICON_STROKE } from '../components/IconTile'

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
}

function Landing() {
    const { scrollY } = useScroll()
    const heroY = useTransform(scrollY, [0, 400], [0, 60])
    const heroOpacity = useTransform(scrollY, [0, 280], [1, 0.4])

    const features = [
        {
            icon: FileUp,
            title: 'Smart Resume Parsing',
            description: 'Drop your PDF and our AI instantly extracts skills, experience, projects, and contact details with high accuracy.',
        },
        {
            icon: Sparkles,
            title: 'AI-Powered Analysis',
            description: 'Advanced machine learning models understand your career trajectory and highlight your strongest achievements.',
        },
        {
            icon: BarChart3,
            title: 'Portfolio Analytics',
            description: 'Track views, visitor insights, and engagement metrics to understand how your portfolio is performing.',
        },
        {
            icon: Rocket,
            title: 'Instant Deployment',
            description: 'Your portfolio goes live immediately with a custom URL. Share it anywhere with zero configuration needed.',
        },
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
        { title: 'AI Resume Parsing', desc: 'Intelligent extraction of skills, experience, and projects from any PDF resume.' },
        { title: 'Portfolio Analytics', desc: 'Track views, visitor insights, and engagement metrics for your portfolio.' },
        { title: 'Custom Domains', desc: 'Get a personalized URL for your portfolio that you can share anywhere.' },
        { title: 'Real-time Editor', desc: 'Edit your portfolio content directly with instant preview updates.' },
        { title: 'Mobile Responsive', desc: 'Your portfolio looks perfect on every device, from phones to desktops.' },
        { title: 'Dark & Light Themes', desc: 'Beautiful design in both dark and light modes for maximum readability.' },
    ]

    return (
        <div className="min-h-screen overflow-x-clip">
            {/* Hero Section */}
            <section className="relative min-h-[calc(100dvh-var(--navbar-offset))] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-navbar overflow-x-clip">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-primary-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-accent-500/8 rounded-full blur-3xl" />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(90,122,158,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(90,122,158,0.025)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 max-w-5xl mx-auto text-center w-full"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary mb-8"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                        <span className="text-sm font-medium text-secondary">AI-Powered Portfolio Builder</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-4 sm:mb-6"
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
                        className="text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2"
                    >
                        Upload your resume and let AI transform it into a stunning,
                        professional portfolio that showcases your skills and experience.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 w-full max-w-md sm:max-w-none mx-auto px-4 sm:px-0"
                    >
                        <SignedOut>
                            <Link to="/sign-up" className="btn-primary group flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                                Start Building Free
                                <ArrowRight size={18} strokeWidth={ICON_STROKE} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <Link to="/sign-in" className="btn-secondary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg text-center">
                                Sign In
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link to="/dashboard" className="btn-primary group flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                                Go to Dashboard
                                <ArrowRight size={18} strokeWidth={ICON_STROKE} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </SignedIn>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto px-2"
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
                                className="flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-surface hover:bg-surface-hover transition-colors"
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
                            Join thousands of professionals showcasing their work with Portlify.
                            Start for free, no credit card required.
                        </p>
                        <SignedOut>
                            <Link to="/sign-up" className="btn-primary group inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg">
                                Get Started Free
                                <ArrowRight size={18} strokeWidth={ICON_STROKE} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link to="/dashboard" className="btn-primary group inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg">
                                Go to Dashboard
                                <ArrowRight size={18} strokeWidth={ICON_STROKE} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </SignedIn>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 sm:py-12 bg-secondary">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-500">
                                <span className="text-white font-bold text-sm">P</span>
                            </div>
                            <span className="font-display font-semibold heading-gradient">Portlify</span>
                        </div>
                        <p className="text-muted text-xs sm:text-sm text-center md:text-right">
                            © 2026 Portlify. Built for professionals by{' '}
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