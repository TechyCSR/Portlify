import { Link } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Icon components for professional look
const ArrowRightIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
)

const CheckIcon = () => (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
)

const UploadIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
)

const SparklesIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
)

const RocketIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
)

const CodeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
)

const GlobeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
)

const PaletteIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
)

const BoltIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
)

const ChartIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
)

const AnalyticsSmallIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
)

function Landing() {
    const { scrollY } = useScroll()
    const heroY = useTransform(scrollY, [0, 500], [0, 150])
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

    const features = [
        {
            icon: <UploadIcon />,
            title: 'Smart Resume Parsing',
            description: 'Drop your PDF and our AI instantly extracts skills, experience, projects, and contact details with high accuracy.',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <SparklesIcon />,
            title: 'AI-Powered Analysis',
            description: 'Advanced machine learning models understand your career trajectory and highlight your strongest achievements.',
            gradient: 'from-violet-500 to-purple-500'
        },
        {
            icon: <ChartIcon />,
            title: 'Portfolio Analytics',
            description: 'Track views, visitor insights, and engagement metrics to understand how your portfolio is performing.',
            gradient: 'from-emerald-500 to-teal-500'
        },
        {
            icon: <RocketIcon />,
            title: 'Instant Deployment',
            description: 'Your portfolio goes live immediately with a custom URL. Share it anywhere with zero configuration needed.',
            gradient: 'from-rose-500 to-pink-500'
        }
    ]

    const benefits = [
        { icon: <CodeIcon />, text: 'Developer-friendly design' },
        { icon: <GlobeIcon />, text: 'SEO optimized pages' },
        { icon: <PaletteIcon />, text: 'Customizable themes' },
        { icon: <BoltIcon />, text: 'Lightning fast loading' },
        { icon: <AnalyticsSmallIcon />, text: 'Portfolio analytics' }
    ]

    const stats = [
        { value: '10K+', label: 'Portfolios Created' },
        { value: '95%', label: 'Parse Accuracy' },
        { value: '<30s', label: 'Time to Deploy' },
        { value: '4.9/5', label: 'User Rating' }
    ]

    return (
        <div className="min-h-screen overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-16">
                {/* Animated gradient background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 max-w-5xl mx-auto text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 mb-8"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-medium text-primary-400">AI-Powered Portfolio Builder</span>
                    </motion.div>

                    {/* Main headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-4 sm:mb-6"
                    >
                        <span className="text-primary">Your Resume.</span>
                        <br />
                        <span className="heading-gradient">Your Portfolio.</span>
                        <br />
                        <span className="text-primary">In Seconds.</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2"
                    >
                        Upload your resume and let AI transform it into a stunning,
                        professional portfolio that showcases your skills and experience.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 w-full px-4 sm:px-0"
                    >
                        <SignedOut>
                            <Link to="/sign-up" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-white text-base sm:text-lg shadow-xl shadow-primary-500/25 transition-all"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    Start Building Free
                                    <ArrowRightIcon />
                                </motion.button>
                            </Link>
                            <Link to="/sign-in" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-secondary border border-border hover:border-primary-500/50 transition-all"
                                >
                                    Sign In
                                </motion.button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link to="/dashboard" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-white text-base sm:text-lg shadow-xl shadow-primary-500/25 transition-all"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    Go to Dashboard
                                    <ArrowRightIcon />
                                </motion.button>
                            </Link>
                        </SignedIn>
                    </motion.div>

                    {/* Benefits row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap justify-center gap-y-4 gap-x-8 sm:gap-6 px-4 w-fit sm:w-full mx-auto"
                    >
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 text-tertiary">
                                <span className="text-primary-400 w-5 h-5 flex-shrink-0 flex items-center justify-center">{benefit.icon}</span>
                                <span className="text-sm font-medium text-left leading-tight">{benefit.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-2"
                    >
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-primary-500"
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-y" style={{ borderColor: 'var(--color-border)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
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
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10 sm:mb-16"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
                            How It Works
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto px-2">
                            Four simple steps to transform your resume into a professional portfolio
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group relative p-5 sm:p-6 md:p-8 rounded-2xl border transition-all duration-300"
                                style={{
                                    background: 'var(--glass-bg)',
                                    borderColor: 'var(--color-border)',
                                }}
                            >
                                {/* Step number */}
                                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white"
                                    style={{ background: 'var(--gradient-primary)' }}>
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>

                                <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">{feature.title}</h3>
                                <p className="text-sm sm:text-base text-secondary leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10 sm:mb-16"
                    >
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto px-2">
                            A complete solution for building your professional online presence
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        {[
                            { title: 'AI Resume Parsing', desc: 'Intelligent extraction of skills, experience, and projects from any PDF resume.' },
                            { title: 'Portfolio Analytics', desc: 'Track views, visitor insights, and engagement metrics for your portfolio.' },
                            { title: 'Custom Domains', desc: 'Get a personalized URL for your portfolio that you can share anywhere.' },
                            { title: 'Real-time Editor', desc: 'Edit your portfolio content directly with instant preview updates.' },
                            { title: 'Mobile Responsive', desc: 'Your portfolio looks perfect on every device, from phones to desktops.' },
                            { title: 'Dark & Light Themes', desc: 'Beautiful design in both dark and light modes for maximum readability.' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border"
                                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                            >
                                <div className="flex-shrink-0">
                                    <CheckIcon />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary mb-1 text-sm sm:text-base">{item.title}</h3>
                                    <p className="text-secondary text-xs sm:text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto relative rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 text-center overflow-hidden"
                    style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)' }}
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 opacity-20" style={{ background: 'var(--gradient-primary)' }} />

                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
                            Ready to Build Your Portfolio?
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-secondary mb-6 sm:mb-10 max-w-xl mx-auto px-2">
                            Join thousands of professionals showcasing their work with Portlify.
                            Start for free, no credit card required.
                        </p>
                        <SignedOut>
                            <Link to="/sign-up">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold text-white text-base sm:text-lg shadow-xl shadow-primary-500/25"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    Get Started Free
                                    <ArrowRightIcon />
                                </motion.button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link to="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-2 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold text-white text-base sm:text-lg shadow-xl shadow-primary-500/25"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    Go to Dashboard
                                    <ArrowRightIcon />
                                </motion.button>
                            </Link>
                        </SignedIn>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 sm:py-12 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
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
                                className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
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
