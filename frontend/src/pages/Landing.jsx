import { Link } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

function Landing() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                {/* Floating elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-40 left-10 w-20 h-20 rounded-2xl glass opacity-30"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-60 right-20 w-32 h-32 rounded-full glass opacity-20"
                />
                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        x: [0, 10, 0]
                    }}
                    transition={{ duration: 7, repeat: Infinity }}
                    className="absolute bottom-40 left-1/4 w-16 h-16 rounded-xl glass opacity-25"
                />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-secondary text-sm font-medium">
                                AI-Powered Portfolio Generator
                            </span>
                        </motion.div>

                        {/* Main headline */}
                        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                            <span className="text-primary">Turn Your Resume Into</span>
                            <br />
                            <span className="heading-gradient">A Stunning Portfolio</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto mb-10">
                            Upload your resume. Let AI extract your profile.
                            Get a beautiful, modern portfolio in seconds.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <SignedOut>
                                <Link to="/sign-up">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-primary text-lg px-8 py-4"
                                    >
                                        Get Started Free →
                                    </motion.button>
                                </Link>
                                <Link to="/sign-in">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        className="btn-secondary text-lg px-8 py-4"
                                    >
                                        I have an account
                                    </motion.button>
                                </Link>
                            </SignedOut>
                            <SignedIn>
                                <Link to="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-primary text-lg px-8 py-4"
                                    >
                                        Go to Dashboard →
                                    </motion.button>
                                </Link>
                            </SignedIn>
                        </div>
                    </motion.div>

                    {/* Preview Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative max-w-4xl mx-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-accent-500/30 blur-3xl rounded-3xl" />
                        <div className="relative glass-card rounded-3xl p-2 md:p-3">
                            <div className="rounded-2xl overflow-hidden bg-surface p-6 md:p-8">
                                {/* Mock portfolio preview */}
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 rounded-2xl flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                                        <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                                            JD
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-2xl font-bold text-primary mb-1">John Doe</h3>
                                        <p className="text-secondary mb-3">Full Stack Developer</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['React', 'Node.js', 'Python', 'AWS'].map((skill) => (
                                                <span key={skill} className="px-3 py-1 rounded-lg text-sm font-medium"
                                                    style={{ background: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-secondary">
                            Three simple steps to your perfect portfolio
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                icon: '📄',
                                title: 'Upload Resume',
                                description: 'Drop your PDF resume and let our AI analyze it instantly'
                            },
                            {
                                step: '02',
                                icon: '✨',
                                title: 'AI Magic',
                                description: 'Our AI extracts skills, experience, projects and more'
                            },
                            {
                                step: '03',
                                icon: '🚀',
                                title: 'Go Live',
                                description: 'Review, customize, and publish your portfolio instantly'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="glass-card rounded-2xl p-8 text-center group"
                            >
                                <div className="text-5xl mb-6">{feature.icon}</div>
                                <div className="text-sm font-bold heading-gradient mb-2">{feature.step}</div>
                                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                                <p className="text-secondary">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto glass-card rounded-3xl p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-30" style={{ background: 'var(--gradient-primary)' }} />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
                            Ready to Stand Out?
                        </h2>
                        <p className="text-xl text-secondary mb-8 max-w-xl mx-auto">
                            Join thousands of professionals showcasing their work with Portlify
                        </p>
                        <SignedOut>
                            <Link to="/sign-up">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary text-lg px-10 py-4"
                                >
                                    Create Your Portfolio →
                                </motion.button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link to="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary text-lg px-10 py-4"
                                >
                                    Go to Dashboard →
                                </motion.button>
                            </Link>
                        </SignedIn>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-muted">
                        © 2026 Portlify. Built with ❤️ for professionals.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Landing
