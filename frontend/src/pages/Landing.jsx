import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

function Landing() {
    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-8">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                            <span className="text-sm text-dark-300">Launching in 2025</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold mb-6 leading-tight">
                            <span className="heading-gradient">Transform Your Resume</span>
                            <br />
                            <span className="text-white">Into a Stunning Portfolio</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-10">
                            Upload your resume and let AI create a beautiful, shareable portfolio page in seconds.
                            Stand out to recruiters with your personalized online presence.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <SignedOut>
                                <Link to="/sign-up" className="btn-primary text-lg px-8 py-4">
                                    Get Started Free
                                </Link>
                                <Link to="/sign-in" className="btn-secondary text-lg px-8 py-4">
                                    Sign In
                                </Link>
                            </SignedOut>
                            <SignedIn>
                                <Link to="/upload" className="btn-primary text-lg px-8 py-4">
                                    Upload Resume
                                </Link>
                                <Link to="/dashboard" className="btn-secondary text-lg px-8 py-4">
                                    Go to Dashboard
                                </Link>
                            </SignedIn>
                        </div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-16 relative"
                    >
                        <div className="glass-card rounded-3xl p-4 md:p-8 max-w-4xl mx-auto">
                            <div className="aspect-video rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center overflow-hidden">
                                {/* Mock portfolio preview */}
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white">JD</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">John Doe</h3>
                                    <p className="text-primary-300 mb-4">Full Stack Developer</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {['React', 'Node.js', 'TypeScript', 'MongoDB'].map(skill => (
                                            <span key={skill} className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-8 -left-8 w-32 h-32 rounded-2xl glass animate-float hidden md:block" />
                        <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-2xl glass animate-float hidden md:block" style={{ animationDelay: '-3s' }} />
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-bold heading-gradient mb-4">
                            How It Works
                        </h2>
                        <p className="text-dark-300 text-lg">
                            Three simple steps to your professional portfolio
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Upload Resume',
                                description: 'Simply drag and drop your PDF resume. Our AI will extract all the important details.',
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                )
                            },
                            {
                                step: '02',
                                title: 'Customize',
                                description: 'Edit your parsed information, add social links, and personalize your portfolio.',
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                )
                            },
                            {
                                step: '03',
                                title: 'Share',
                                description: 'Get your unique portfolio URL and share it with the world. Stand out from the crowd.',
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                )
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card rounded-2xl p-8 text-center group hover:scale-105 transition-transform duration-300"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <span className="text-5xl font-display font-bold text-dark-700 group-hover:text-dark-600 transition-colors">
                                    {feature.step}
                                </span>
                                <h3 className="text-xl font-bold text-white mt-4 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-dark-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto glass-card rounded-3xl p-12 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                        Ready to Build Your Portfolio?
                    </h2>
                    <p className="text-dark-300 text-lg mb-8">
                        Join thousands of professionals who have already created their stunning portfolios.
                    </p>
                    <SignedOut>
                        <Link to="/sign-up" className="btn-primary text-lg px-10 py-4 inline-block">
                            Start Free Today
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <Link to="/upload" className="btn-primary text-lg px-10 py-4 inline-block">
                            Upload Your Resume
                        </Link>
                    </SignedIn>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <span className="text-white font-bold">P</span>
                        </div>
                        <span className="font-display font-bold heading-gradient">Portlify</span>
                    </div>
                    <p className="text-dark-500 text-sm">
                        © 2025 Portlify. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Landing
