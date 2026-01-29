import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UploadZone from '../components/UploadZone'
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload'
import { parseResume, getCurrentUser } from '../utils/api'

function ResumeUpload() {
    const navigate = useNavigate()
    const { upload, uploading, progress, error: uploadError } = useCloudinaryUpload()
    const [status, setStatus] = useState('idle') // idle, uploading, parsing, success, error
    const [error, setError] = useState('')
    const [parsingMessage, setParsingMessage] = useState('')

    // Check if user has registered username
    useEffect(() => {
        const checkUser = async () => {
            try {
                await getCurrentUser()
            } catch (err) {
                if (err.response?.data?.needsRegistration) {
                    navigate('/username')
                }
            }
        }
        checkUser()
    }, [navigate])

    const handleFileSelect = async (file) => {
        setError('')
        setStatus('uploading')

        try {
            // Upload to Cloudinary
            const { url } = await upload(file)

            setStatus('parsing')
            setParsingMessage('Analyzing your resume with AI...')

            // Parse with Gemini AI
            const { data } = await parseResume(url)

            setParsingMessage('Extracting your skills and experience...')

            // Store parsed data and resume URL in session storage for editor
            sessionStorage.setItem('parsedResumeData', JSON.stringify({
                ...data.data,
                resumeUrl: url
            }))

            setStatus('success')
            setParsingMessage('Done! Redirecting to editor...')

            // Redirect to profile editor
            setTimeout(() => {
                navigate('/editor')
            }, 1500)
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Upload failed')
            setStatus('error')
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-display font-bold text-white mb-3">
                        Upload Your Resume
                    </h1>
                    <p className="text-dark-400">
                        Our AI will analyze your resume and extract all the important details
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {status === 'idle' || status === 'error' ? (
                        <UploadZone
                            onFileSelect={handleFileSelect}
                            uploading={false}
                            progress={0}
                        />
                    ) : status === 'uploading' ? (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <div className="spinner mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Uploading Resume...
                            </h3>
                            <p className="text-dark-400">{progress}% complete</p>
                        </div>
                    ) : status === 'parsing' ? (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-primary-500/30 border-t-primary-500"
                            />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                AI Processing...
                            </h3>
                            <p className="text-dark-400">
                                {parsingMessage}
                            </p>
                            <div className="mt-6 flex justify-center gap-2">
                                {['Skills', 'Experience', 'Education', 'Projects'].map((item, i) => (
                                    <motion.span
                                        key={item}
                                        initial={{ opacity: 0.3 }}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                        className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm"
                                    >
                                        {item}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    ) : status === 'success' ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card rounded-2xl p-12 text-center"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Resume Analyzed!
                            </h3>
                            <p className="text-dark-400 mb-4">
                                {parsingMessage}
                            </p>
                            <div className="flex justify-center gap-2 flex-wrap">
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                                    ✓ Profile Extracted
                                </span>
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                                    ✓ Skills Identified
                                </span>
                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                                    ✓ Projects Found
                                </span>
                            </div>
                        </motion.div>
                    ) : null}

                    {/* Error message */}
                    {(error || uploadError) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                        >
                            <p className="text-red-400 text-center">
                                {error || uploadError}
                            </p>
                            <button
                                onClick={() => {
                                    setError('')
                                    setStatus('idle')
                                }}
                                className="mt-4 w-full py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Tips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 glass rounded-2xl p-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                        Tips for Best Results
                    </h3>
                    <ul className="space-y-3 text-dark-400">
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-primary-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Include links to your projects, GitHub, and LinkedIn in your resume
                        </li>
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-primary-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Use clear section headers like "Experience", "Education", "Projects"
                        </li>
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-primary-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            You'll be able to review and edit all extracted information
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    )
}

export default ResumeUpload
