import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { getMyProfile, updateProfile, getCurrentUser } from '../utils/api'

function Dashboard() {
    const { user } = useUser()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [dbUser, setDbUser] = useState(null)

    // Editable fields
    const [formData, setFormData] = useState({
        name: '',
        headline: '',
        about: '',
        skills: [],
        socialLinks: {
            linkedin: '',
            github: '',
            twitter: '',
            website: ''
        }
    })
    const [newSkill, setNewSkill] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user info
                const { data: userData } = await getCurrentUser()
                setDbUser(userData)

                // Get profile
                const { data: profileData } = await getMyProfile()
                setProfile(profileData)
                setFormData({
                    name: profileData.name || '',
                    headline: profileData.headline || '',
                    about: profileData.about || '',
                    skills: profileData.skills || [],
                    socialLinks: profileData.socialLinks || {
                        linkedin: '',
                        github: '',
                        twitter: '',
                        website: ''
                    }
                })
            } catch (err) {
                if (err.response?.status === 404) {
                    // No profile yet, redirect to upload
                    navigate('/upload')
                } else if (err.response?.data?.needsRegistration) {
                    navigate('/username')
                } else {
                    setError('Failed to load profile')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('social.')) {
            const socialKey = name.replace('social.', '')
            setFormData(prev => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [socialKey]: value
                }
            }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }))
            setNewSkill('')
        }
    }

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        try {
            const { data } = await updateProfile(formData)
            setProfile(data.profile)
            setSuccess('Profile updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="spinner" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">
                            Dashboard
                        </h1>
                        <p className="text-dark-400">
                            Edit your portfolio information
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to="/upload"
                            className="btn-secondary text-sm"
                        >
                            Re-upload Resume
                        </Link>
                        {dbUser?.username && (
                            <Link
                                to={`/${dbUser.username}`}
                                className="btn-primary text-sm"
                            >
                                View Portfolio →
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* Portfolio URL */}
                {dbUser?.username && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass rounded-2xl p-4 mb-8 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-dark-400 text-sm mb-1">Your portfolio URL</p>
                            <p className="text-lg font-medium text-primary-300">
                                portlify.techycsr.dev/{dbUser.username}
                            </p>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(`https://portlify.techycsr.dev/${dbUser.username}`)}
                            className="px-4 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 text-sm transition-colors"
                        >
                            Copy Link
                        </button>
                    </motion.div>
                )}

                {/* Success/Error messages */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30"
                    >
                        <p className="text-green-400">{success}</p>
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                    >
                        <p className="text-red-400">{error}</p>
                    </motion.div>
                )}

                {/* Edit Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="glass-card rounded-3xl p-6 md:p-8"
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Headline */}
                        <div>
                            <label className="block text-dark-300 text-sm font-medium mb-2">
                                Headline
                            </label>
                            <input
                                type="text"
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Full Stack Developer"
                            />
                        </div>
                    </div>

                    {/* About */}
                    <div className="mt-6">
                        <label className="block text-dark-300 text-sm font-medium mb-2">
                            About
                        </label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            rows={4}
                            className="input-field resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    {/* Skills */}
                    <div className="mt-6">
                        <label className="block text-dark-300 text-sm font-medium mb-2">
                            Skills
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                className="input-field flex-1"
                                placeholder="Add a skill..."
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="group px-3 py-1.5 rounded-full bg-dark-700 text-dark-200 text-sm flex items-center gap-2"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="text-dark-500 hover:text-red-400 transition-colors"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="mt-6">
                        <label className="block text-dark-300 text-sm font-medium mb-4">
                            Social Links
                        </label>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-dark-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </div>
                                <input
                                    type="url"
                                    name="social.linkedin"
                                    value={formData.socialLinks.linkedin}
                                    onChange={handleChange}
                                    className="input-field flex-1"
                                    placeholder="LinkedIn URL"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-dark-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </div>
                                <input
                                    type="url"
                                    name="social.github"
                                    value={formData.socialLinks.github}
                                    onChange={handleChange}
                                    className="input-field flex-1"
                                    placeholder="GitHub URL"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-dark-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </div>
                                <input
                                    type="url"
                                    name="social.twitter"
                                    value={formData.socialLinks.twitter}
                                    onChange={handleChange}
                                    className="input-field flex-1"
                                    placeholder="Twitter/X URL"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <input
                                    type="url"
                                    name="social.website"
                                    value={formData.socialLinks.website}
                                    onChange={handleChange}
                                    className="input-field flex-1"
                                    placeholder="Personal Website URL"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary disabled:opacity-50"
                        >
                            {saving ? (
                                <span className="flex items-center">
                                    <div className="spinner w-5 h-5 mr-2" />
                                    Saving...
                                </span>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    )
}

export default Dashboard
