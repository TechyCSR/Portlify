import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UploadZone from '../components/UploadZone'
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload'
import { createProfile, getCurrentUser } from '../utils/api'

function ResumeUpload() {
    const navigate = useNavigate()
    const { upload, uploading, progress, error: uploadError } = useCloudinaryUpload()
    const [status, setStatus] = useState('idle') // idle, uploading, parsing, success, error
    const [error, setError] = useState('')
    const [parsedProfile, setParsedProfile] = useState(null)

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

            // Send to backend for parsing
            const { data } = await createProfile({ resumeUrl: url })

            setParsedProfile(data.profile)
            setStatus('success')

            // Redirect to dashboard after delay
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
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
                        We'll automatically extract your information and create your portfolio
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
                            <div className="spinner mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Parsing Your Resume...
                            </h3>
                            <p className="text-dark-400">
                                Extracting your skills, experience, and education
                            </p>
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
                                Profile Created!
                            </h3>
                            <p className="text-dark-400 mb-6">
                                We extracted {parsedProfile?.skills?.length || 0} skills from your resume
                            </p>
                            <p className="text-sm text-primary-400">
                                Redirecting to dashboard...
                            </p>
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
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Tips for Best Results
                    </h3>
                    <ul className="space-y-3 text-dark-400">
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-primary-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Use a clean, text-based resume format (avoid graphics-heavy designs)
                        </li>
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-primary-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Include clear section headers like "Experience", "Education", "Skills"
                        </li>
                        <li className="flex items-start">
                            <svg className="w-5 h-5 text-primary-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            You can always edit the extracted information later
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    )
}

export default ResumeUpload
