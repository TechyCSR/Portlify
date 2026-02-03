import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { createProfile, updateProfile, getCurrentUser, getMyProfile } from '../utils/api'
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload'
import { useToast } from '../context/ToastContext'
import {
    User, Briefcase, GraduationCap, Code, Award,
    Share2, FileText, Globe, BookOpen, Heart,
    Users, Plus, Trash2, Save, ChevronLeft,
    Camera, MapPin, Mail, Phone, Link as LinkIcon,
    Linkedin, Github, Twitter
} from 'lucide-react'

function ProfileEditor() {
    const navigate = useNavigate()
    const { isLoaded, isSignedIn } = useUser()
    const { upload: uploadPhoto, uploading: photoUploading } = useCloudinaryUpload()
    const toast = useToast()
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [activeSection, setActiveSection] = useState('basic')
    const [resumeUrl, setResumeUrl] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)

    // Form data state
    const [formData, setFormData] = useState({
        basicDetails: {
            name: '',
            headline: '',
            email: '',
            phone: '',
            location: '',
            profilePhoto: '',
            about: ''
        },
        skills: {
            technical: [],
            soft: [],
            tools: [],
            languages: []
        },
        experience: [],
        education: [],
        projects: [],
        achievements: [],
        certifications: [],
        publications: [],
        volunteering: [],
        references: [],
        extraCurricular: [],
        socialLinks: {
            linkedin: '',
            github: '',
            twitter: '',
            website: '',
            email: ''
        },
        customSections: []
    })

    // Load data from API or sessionStorage
    useEffect(() => {
        // Wait for Clerk to be fully loaded before making API calls
        if (!isLoaded) return

        // If not signed in, redirect to home
        if (!isSignedIn) {
            navigate('/')
            return
        }

        const loadProfileData = async () => {
            try {
                // First check if user is registered
                await getCurrentUser()
            } catch (err) {
                if (err.response?.data?.needsRegistration) {
                    navigate('/username')
                    return
                }
            }

            // IMPORTANT: Check sessionStorage FIRST for fresh resume uploads
            const storedData = sessionStorage.getItem('parsedResumeData')
            if (storedData) {
                try {
                    const parsed = JSON.parse(storedData)
                    console.log('Loading from sessionStorage (resume upload):', parsed)
                    setResumeUrl(parsed.resumeUrl || '')
                    setFormData(prev => ({
                        ...prev,
                        basicDetails: { ...prev.basicDetails, ...parsed.basicDetails },
                        skills: { ...prev.skills, ...parsed.skills },
                        experience: parsed.experience || [],
                        education: parsed.education || [],
                        projects: parsed.projects || [],
                        achievements: parsed.achievements || [],
                        certifications: parsed.certifications || [],
                        publications: parsed.publications || [],
                        volunteering: parsed.volunteering || [],
                        references: parsed.references || [],
                        extraCurricular: parsed.extraCurricular || [],
                        socialLinks: { ...prev.socialLinks, ...parsed.socialLinks },
                        customSections: parsed.customSections || []
                    }))
                    setIsEditing(false) // This is a new profile from resume
                    setLoading(false)
                    toast.success('Resume data loaded! Review and save your profile.')
                    return
                } catch (e) {
                    console.error('Failed to parse stored data:', e)
                }
            }

            // Try to load from API (for editing existing profile)
            try {
                const { data: profileData } = await getMyProfile()
                if (profileData && profileData.basicDetails?.name) {
                    // Only consider it a valid existing profile if it has actual data
                    setIsEditing(true)
                    setResumeUrl(profileData.resumeUrl || '')
                    setFormData(prev => ({
                        ...prev,
                        basicDetails: { ...prev.basicDetails, ...profileData.basicDetails },
                        skills: { ...prev.skills, ...profileData.skills },
                        experience: profileData.experience || [],
                        education: profileData.education || [],
                        projects: profileData.projects || [],
                        achievements: profileData.achievements || [],
                        certifications: profileData.certifications || [],
                        publications: profileData.publications || [],
                        volunteering: profileData.volunteering || [],
                        references: profileData.references || [],
                        extraCurricular: profileData.extraCurricular || [],
                        socialLinks: { ...prev.socialLinks, ...profileData.socialLinks },
                        customSections: profileData.customSections || []
                    }))
                }
            } catch (err) {
                // No existing profile, user will start fresh
                console.log('No existing profile found')
            }

            setLoading(false)
        }

        loadProfileData()
    }, [navigate, isLoaded, isSignedIn])

    // Handle basic details change
    const handleBasicChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            basicDetails: { ...prev.basicDetails, [field]: value }
        }))
    }

    // Handle social links change
    const handleSocialChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [field]: value }
        }))
    }

    // Handle skills change
    const handleSkillsChange = (category, skills) => {
        setFormData(prev => ({
            ...prev,
            skills: { ...prev.skills, [category]: skills }
        }))
    }

    // Add skill to category
    const addSkill = (category, skill) => {
        if (skill.trim() && !formData.skills[category].includes(skill.trim())) {
            handleSkillsChange(category, [...formData.skills[category], skill.trim()])
        }
    }

    // Remove skill from category
    const removeSkill = (category, skillToRemove) => {
        handleSkillsChange(category, formData.skills[category].filter(s => s !== skillToRemove))
    }

    // Handle array fields (experience, education, projects, etc.)
    const updateArrayItem = (field, index, updates) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? { ...item, ...updates } : item)
        }))
    }

    const addArrayItem = (field, newItem) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], newItem]
        }))
    }

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }

    // Upload profile photo
    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const { url } = await uploadPhoto(file)
            handleBasicChange('profilePhoto', url)
        } catch (err) {
            setError('Failed to upload photo')
        }
    }

    // Save profile
    const handleSave = async () => {
        setSaving(true)
        setError('')

        const loadingToast = toast.loading('Saving your profile...')

        try {
            const profileData = {
                resumeUrl,
                ...formData
            }

            if (isEditing) {
                await updateProfile(profileData)
            } else {
                await createProfile(profileData)
            }

            // Clear stored data
            sessionStorage.removeItem('parsedResumeData')

            toast.dismiss(loadingToast)
            toast.success('Profile saved successfully!')

            // Navigate to dashboard
            setTimeout(() => navigate('/dashboard'), 500)
        } catch (err) {
            toast.dismiss(loadingToast)
            toast.error(err.response?.data?.error || 'Failed to save profile')
            setError(err.response?.data?.error || 'Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    const sections = [
        { id: 'basic', label: 'Basic Info', icon: <User size={18} /> },
        { id: 'skills', label: 'Skills', icon: <Code size={18} /> },
        { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
        { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
        { id: 'projects', label: 'Projects', icon: <Globe size={18} /> },
        { id: 'achievements', label: 'Achievements', icon: <Award size={18} /> },
        { id: 'certifications', label: 'Certifications', icon: <FileText size={18} /> },
        { id: 'publications', label: 'Publications', icon: <BookOpen size={18} /> },
        { id: 'volunteering', label: 'Volunteering', icon: <Heart size={18} /> },
        { id: 'references', label: 'References', icon: <Users size={18} /> },
        { id: 'extra', label: 'Extra Curricular', icon: <Share2 size={18} /> },
        { id: 'custom', label: 'Custom Sections', icon: <Plus size={18} /> },
        { id: 'social', label: 'Social Links', icon: <LinkIcon size={18} /> }
    ]

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="spinner" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    {/* Back button */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-secondary hover:text-primary mb-6 transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>

                    <div className="text-center">
                        <h1 className="text-3xl font-display font-bold text-primary mb-2">
                            {isEditing ? 'Edit Your Profile' : 'Review Your Profile'}
                        </h1>
                        <p className="text-secondary">
                            {isEditing
                                ? 'Update your information and save changes to your portfolio.'
                                : 'AI has extracted your information. Review and edit before generating your portfolio.'
                            }
                        </p>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:w-64 flex-shrink-0"
                    >
                        <div className="glass-card rounded-2xl p-4 sticky top-24">
                            <nav className="space-y-1">
                                {sections.map(section => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeSection === section.id
                                            ? 'text-white'
                                            : 'text-secondary hover:text-primary'
                                            }`}
                                        style={activeSection === section.id ? { background: 'var(--gradient-primary)' } : { background: 'transparent' }}
                                    >
                                        <span className="text-lg">{section.icon}</span>
                                        <span className="font-medium">{section.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1"
                    >
                        <div className="glass-card rounded-3xl p-6 md:p-8">
                            {/* Basic Info Section */}
                            {activeSection === 'basic' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-primary mb-6">Basic Information</h2>

                                    {/* Profile Photo */}
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center overflow-hidden ring-4 ring-white/10">
                                                {formData.basicDetails.profilePhoto ? (
                                                    <img src={formData.basicDetails.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-3xl font-bold text-primary">
                                                        {formData.basicDetails.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </span>
                                                )}
                                            </div>
                                            <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center cursor-pointer hover:bg-primary-400 transition-colors shadow-lg">
                                                <Camera size={14} className="text-white" />
                                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={photoUploading} />
                                            </label>
                                        </div>
                                        <div>
                                            <p className="text-primary font-medium">Profile Photo</p>
                                            <p className="text-secondary text-sm">Click the camera to upload</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-secondary text-sm font-medium mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.basicDetails.name}
                                                onChange={(e) => handleBasicChange('name', e.target.value)}
                                                className="input-field"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-secondary text-sm font-medium mb-2">Headline</label>
                                            <input
                                                type="text"
                                                value={formData.basicDetails.headline}
                                                onChange={(e) => handleBasicChange('headline', e.target.value)}
                                                className="input-field"
                                                placeholder="Full Stack Developer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-secondary text-sm font-medium mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={formData.basicDetails.email}
                                                onChange={(e) => handleBasicChange('email', e.target.value)}
                                                className="input-field"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-secondary text-sm font-medium mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.basicDetails.phone}
                                                onChange={(e) => handleBasicChange('phone', e.target.value)}
                                                className="input-field"
                                                placeholder="+1 234 567 8900"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-secondary text-sm font-medium mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={formData.basicDetails.location}
                                                onChange={(e) => handleBasicChange('location', e.target.value)}
                                                className="input-field"
                                                placeholder="San Francisco, CA"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-secondary text-sm font-medium mb-2">About</label>
                                            <textarea
                                                value={formData.basicDetails.about}
                                                onChange={(e) => handleBasicChange('about', e.target.value)}
                                                rows={4}
                                                className="input-field resize-none"
                                                placeholder="Brief professional summary..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Skills Section */}
                            {activeSection === 'skills' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-primary mb-6">Skills</h2>

                                    {[
                                        { key: 'technical', label: 'Technical Skills', placeholder: 'React, Node.js, Python...' },
                                        { key: 'tools', label: 'Tools & Platforms', placeholder: 'Git, Docker, AWS...' },
                                        { key: 'soft', label: 'Soft Skills', placeholder: 'Leadership, Communication...' },
                                        { key: 'languages', label: 'Languages', placeholder: 'English, Spanish...' }
                                    ].map(category => (
                                        <div key={category.key}>
                                            <label className="block text-secondary text-sm font-medium mb-2">{category.label}</label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {formData.skills[category.key].map((skill, i) => (
                                                    <span key={i} className="px-3 py-1.5 rounded-full bg-primary-500/20 text-primary-300 text-sm flex items-center gap-2">
                                                        {skill}
                                                        <button onClick={() => removeSkill(category.key, skill)} className="text-primary-400 hover:text-red-400">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="input-field flex-1"
                                                    placeholder={category.placeholder}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            addSkill(category.key, e.target.value)
                                                            e.target.value = ''
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={(e) => {
                                                        const input = e.target.previousSibling
                                                        addSkill(category.key, input.value)
                                                        input.value = ''
                                                    }}
                                                    className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Experience Section */}
                            {activeSection === 'experience' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary">Experience</h2>
                                        <button
                                            onClick={() => addArrayItem('experience', { title: '', company: '', duration: '', location: '', description: '', achievements: [] })}
                                            className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors text-sm"
                                        >
                                            + Add Experience
                                        </button>
                                    </div>

                                    {formData.experience.map((exp, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border space-y-4">
                                            <div className="flex justify-between items-start">
                                                <span className="text-secondary text-sm">Experience {index + 1}</span>
                                                <button onClick={() => removeArrayItem('experience', index)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={exp.title}
                                                    onChange={(e) => updateArrayItem('experience', index, { title: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Job Title"
                                                />
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => updateArrayItem('experience', index, { company: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Company Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={exp.duration}
                                                    onChange={(e) => updateArrayItem('experience', index, { duration: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Jan 2023 - Present"
                                                />
                                                <input
                                                    type="text"
                                                    value={exp.location}
                                                    onChange={(e) => updateArrayItem('experience', index, { location: e.target.value })}
                                                    className="input-field"
                                                    placeholder="City, Country"
                                                />
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => updateArrayItem('experience', index, { description: e.target.value })}
                                                    className="input-field resize-none md:col-span-2"
                                                    rows={2}
                                                    placeholder="Role description..."
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {formData.experience.length === 0 && (
                                        <p className="text-tertiary text-center py-8">No experience added yet. Click "Add Experience" to start.</p>
                                    )}
                                </div>
                            )}

                            {/* Education Section */}
                            {activeSection === 'education' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary">Education</h2>
                                        <button
                                            onClick={() => addArrayItem('education', { degree: '', institution: '', year: '', gpa: '', coursework: [] })}
                                            className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors text-sm"
                                        >
                                            + Add Education
                                        </button>
                                    </div>

                                    {formData.education.map((edu, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border space-y-4">
                                            <div className="flex justify-between items-start">
                                                <span className="text-secondary text-sm">Education {index + 1}</span>
                                                <button onClick={() => removeArrayItem('education', index)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={edu.degree}
                                                    onChange={(e) => updateArrayItem('education', index, { degree: e.target.value })}
                                                    className="input-field md:col-span-2"
                                                    placeholder="Bachelor of Science in Computer Science"
                                                />
                                                <input
                                                    type="text"
                                                    value={edu.institution}
                                                    onChange={(e) => updateArrayItem('education', index, { institution: e.target.value })}
                                                    className="input-field"
                                                    placeholder="University Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={edu.year}
                                                    onChange={(e) => updateArrayItem('education', index, { year: e.target.value })}
                                                    className="input-field"
                                                    placeholder="2020 - 2024"
                                                />
                                                <input
                                                    type="text"
                                                    value={edu.gpa}
                                                    onChange={(e) => updateArrayItem('education', index, { gpa: e.target.value })}
                                                    className="input-field"
                                                    placeholder="GPA: 3.8/4.0"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {formData.education.length === 0 && (
                                        <p className="text-tertiary text-center py-8">No education added yet.</p>
                                    )}
                                </div>
                            )}

                            {/* Projects Section */}
                            {activeSection === 'projects' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary">Projects</h2>
                                        <button
                                            onClick={() => addArrayItem('projects', { title: '', description: '', techStack: [], demoUrl: '', githubUrl: '' })}
                                            className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors text-sm"
                                        >
                                            + Add Project
                                        </button>
                                    </div>

                                    {formData.projects.map((proj, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border space-y-4">
                                            <div className="flex justify-between items-start">
                                                <span className="text-secondary text-sm">Project {index + 1}</span>
                                                <button onClick={() => removeArrayItem('projects', index)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={proj.title}
                                                    onChange={(e) => updateArrayItem('projects', index, { title: e.target.value })}
                                                    className="input-field md:col-span-2"
                                                    placeholder="Project Name"
                                                />
                                                <textarea
                                                    value={proj.description}
                                                    onChange={(e) => updateArrayItem('projects', index, { description: e.target.value })}
                                                    className="input-field resize-none md:col-span-2"
                                                    rows={2}
                                                    placeholder="What does this project do?"
                                                />
                                                <input
                                                    type="url"
                                                    value={proj.demoUrl}
                                                    onChange={(e) => updateArrayItem('projects', index, { demoUrl: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Live Demo URL"
                                                />
                                                <input
                                                    type="url"
                                                    value={proj.githubUrl}
                                                    onChange={(e) => updateArrayItem('projects', index, { githubUrl: e.target.value })}
                                                    className="input-field"
                                                    placeholder="GitHub URL"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {formData.projects.length === 0 && (
                                        <p className="text-tertiary text-center py-8">No projects added yet.</p>
                                    )}
                                </div>
                            )}

                            {/* Achievements Section */}
                            {activeSection === 'achievements' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary">Achievements</h2>
                                        <button
                                            onClick={() => addArrayItem('achievements', { title: '', description: '', date: '' })}
                                            className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors text-sm"
                                        >
                                            + Add Achievement
                                        </button>
                                    </div>

                                    {formData.achievements.map((ach, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border space-y-4">
                                            <div className="flex justify-between items-start">
                                                <span className="text-secondary text-sm">Achievement {index + 1}</span>
                                                <button onClick={() => removeArrayItem('achievements', index)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={ach.title}
                                                    onChange={(e) => updateArrayItem('achievements', index, { title: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Award or Achievement"
                                                />
                                                <input
                                                    type="text"
                                                    value={ach.date}
                                                    onChange={(e) => updateArrayItem('achievements', index, { date: e.target.value })}
                                                    className="input-field"
                                                    placeholder="2023"
                                                />
                                                <textarea
                                                    value={ach.description}
                                                    onChange={(e) => updateArrayItem('achievements', index, { description: e.target.value })}
                                                    className="input-field resize-none md:col-span-2"
                                                    rows={2}
                                                    placeholder="Description..."
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {formData.achievements.length === 0 && (
                                        <p className="text-tertiary text-center py-8">No achievements added yet.</p>
                                    )}
                                </div>
                            )}

                            {/* Certifications Section */}
                            {activeSection === 'certifications' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary">Certifications</h2>
                                        <button
                                            onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '', url: '' })}
                                            className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors text-sm flex items-center gap-2"
                                        >
                                            <Plus size={16} /> Add Certification
                                        </button>
                                    </div>

                                    {formData.certifications.map((cert, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border space-y-4 relative group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-secondary text-sm">Certification {index + 1}</span>
                                                <button onClick={() => removeArrayItem('certifications', index)} className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-1.5 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={cert.name}
                                                    onChange={(e) => updateArrayItem('certifications', index, { name: e.target.value })}
                                                    className="input-field md:col-span-2"
                                                    placeholder="Certification Name (e.g. AWS Solutions Architect)"
                                                />
                                                <input
                                                    type="text"
                                                    value={cert.issuer}
                                                    onChange={(e) => updateArrayItem('certifications', index, { issuer: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Issuing Organization"
                                                />
                                                <input
                                                    type="text"
                                                    value={cert.date}
                                                    onChange={(e) => updateArrayItem('certifications', index, { date: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Date Issued"
                                                />
                                                <input
                                                    type="url"
                                                    value={cert.url}
                                                    onChange={(e) => updateArrayItem('certifications', index, { url: e.target.value })}
                                                    className="input-field md:col-span-2"
                                                    placeholder="Credential URL"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {formData.certifications.length === 0 && (
                                        <p className="text-tertiary text-center py-8">No certifications added. Showcase your credentials!</p>
                                    )}
                                </div>
                            )}

                            {/* Publications Section */}
                            {activeSection === 'publications' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary">Publications</h2>
                                        <button
                                            onClick={() => addArrayItem('publications', { title: '', publisher: '', date: '', url: '' })}
                                            className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors text-sm flex items-center gap-2"
                                        >
                                            <Plus size={16} /> Add Publication
                                        </button>
                                    </div>

                                    {formData.publications.map((pub, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border space-y-4 relative group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-secondary text-sm">Publication {index + 1}</span>
                                                <button onClick={() => removeArrayItem('publications', index)} className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-1.5 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={pub.title}
                                                    onChange={(e) => updateArrayItem('publications', index, { title: e.target.value })}
                                                    className="input-field md:col-span-2"
                                                    placeholder="Paper/Article Title"
                                                />
                                                <input
                                                    type="text"
                                                    value={pub.publisher}
                                                    onChange={(e) => updateArrayItem('publications', index, { publisher: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Publisher / Journal"
                                                />
                                                <input
                                                    type="text"
                                                    value={pub.date}
                                                    onChange={(e) => updateArrayItem('publications', index, { date: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Publication Date"
                                                />
                                                <input
                                                    type="url"
                                                    value={pub.url}
                                                    onChange={(e) => updateArrayItem('publications', index, { url: e.target.value })}
                                                    className="input-field md:col-span-2"
                                                    placeholder="Link to Publication"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {formData.publications.length === 0 && (
                                        <p className="text-tertiary text-center py-8">No publications added yet.</p>
                                    )}
                                </div>
                            )}

                            {/* Volunteering Section */}
                            {activeSection === 'volunteering' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary">Volunteering</h2>
                                        <button
                                            onClick={() => addArrayItem('volunteering', { role: '', organization: '', date: '', description: '' })}
                                            className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors text-sm flex items-center gap-2"
                                        >
                                            <Plus size={16} /> Add Experience
                                        </button>
                                    </div>

                                    {formData.volunteering.map((vol, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border space-y-4 relative group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-secondary text-sm">Volunteering {index + 1}</span>
                                                <button onClick={() => removeArrayItem('volunteering', index)} className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-1.5 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={vol.role}
                                                    onChange={(e) => updateArrayItem('volunteering', index, { role: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Role (e.g. Mentor)"
                                                />
                                                <input
                                                    type="text"
                                                    value={vol.organization}
                                                    onChange={(e) => updateArrayItem('volunteering', index, { organization: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Organization"
                                                />
                                                <input
                                                    type="text"
                                                    value={vol.date}
                                                    onChange={(e) => updateArrayItem('volunteering', index, { date: e.target.value })}
                                                    className="input-field md:col-span-2"
                                                    placeholder="Dates"
                                                />
                                                <textarea
                                                    value={vol.description}
                                                    onChange={(e) => updateArrayItem('volunteering', index, { description: e.target.value })}
                                                    className="input-field md:col-span-2 resize-none"
                                                    rows={3}
                                                    placeholder="Describe your volunteering contribution..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {formData.volunteering.length === 0 && (
                                        <p className="text-tertiary text-center py-8">No volunteering experience added.</p>
                                    )}
                                </div>
                            )}

                            {/* References Section */}
                            {activeSection === 'references' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary">References</h2>
                                        <button
                                            onClick={() => addArrayItem('references', { name: '', relationship: '', contact: '' })}
                                            className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors text-sm flex items-center gap-2"
                                        >
                                            <Plus size={16} /> Add Reference
                                        </button>
                                    </div>

                                    {formData.references.map((ref, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border space-y-4 relative group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-secondary text-sm">Reference {index + 1}</span>
                                                <button onClick={() => removeArrayItem('references', index)} className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-1.5 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={ref.name}
                                                    onChange={(e) => updateArrayItem('references', index, { name: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Reference Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={ref.relationship}
                                                    onChange={(e) => updateArrayItem('references', index, { relationship: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Relationship (e.g. Former Manager)"
                                                />
                                                <input
                                                    type="text"
                                                    value={ref.contact}
                                                    onChange={(e) => updateArrayItem('references', index, { contact: e.target.value })}
                                                    className="input-field md:col-span-2"
                                                    placeholder="Contact Info (Email or Phone)"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {formData.references.length === 0 && (
                                        <p className="text-tertiary text-center py-8">No references added.</p>
                                    )}
                                </div>
                            )}

                            {/* Custom Sections */}
                            {activeSection === 'custom' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary">Custom Sections</h2>
                                        <button
                                            onClick={() => addArrayItem('customSections', { title: 'New Section', content: '' })}
                                            className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors text-sm flex items-center gap-2"
                                        >
                                            <Plus size={16} /> Add Custom Section
                                        </button>
                                    </div>

                                    <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-6">
                                        <div className="flex items-start gap-3 text-sm text-secondary">
                                            <BookOpen size={16} className="mt-0.5 text-primary-400" />
                                            <p>Use custom sections for anything else! Hobbies, Teaching, Languages (extended), or specific domain knowledge. Markdown is supported.</p>
                                        </div>
                                    </div>

                                    {formData.customSections.map((sec, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border space-y-4 relative group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-secondary text-sm">Custom Section {index + 1}</span>
                                                <button onClick={() => removeArrayItem('customSections', index)} className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-1.5 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-secondary text-sm font-medium mb-2">Section Title</label>
                                                    <input
                                                        type="text"
                                                        value={sec.title}
                                                        onChange={(e) => updateArrayItem('customSections', index, { title: e.target.value })}
                                                        className="input-field font-bold"
                                                        placeholder="e.g. Speaking Engagements"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-secondary text-sm font-medium mb-2">Content</label>
                                                    <textarea
                                                        value={sec.content}
                                                        onChange={(e) => updateArrayItem('customSections', index, { content: e.target.value })}
                                                        className="input-field resize-none h-40"
                                                        placeholder="Describe your achievements in this area..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.customSections.length === 0 && (
                                        <p className="text-tertiary text-center py-8">No custom sections added.</p>
                                    )}
                                </div>
                            )}

                            {/* Extra Curricular Section */}
                            {activeSection === 'extra' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary">Extra Curricular</h2>
                                        <button
                                            onClick={() => addArrayItem('extraCurricular', { activity: '', role: '', description: '' })}
                                            className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors text-sm"
                                        >
                                            + Add Activity
                                        </button>
                                    </div>

                                    {formData.extraCurricular.map((extra, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border space-y-4">
                                            <div className="flex justify-between items-start">
                                                <span className="text-secondary text-sm">Activity {index + 1}</span>
                                                <button onClick={() => removeArrayItem('extraCurricular', index)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={extra.activity}
                                                    onChange={(e) => updateArrayItem('extraCurricular', index, { activity: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Activity or Club"
                                                />
                                                <input
                                                    type="text"
                                                    value={extra.role}
                                                    onChange={(e) => updateArrayItem('extraCurricular', index, { role: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Role or Position"
                                                />
                                                <textarea
                                                    value={extra.description}
                                                    onChange={(e) => updateArrayItem('extraCurricular', index, { description: e.target.value })}
                                                    className="input-field resize-none md:col-span-2"
                                                    rows={2}
                                                    placeholder="What did you do?"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {formData.extraCurricular.length === 0 && (
                                        <p className="text-tertiary text-center py-8">No activities added yet.</p>
                                    )}
                                </div>
                            )}

                            {/* Social Links Section */}
                            {activeSection === 'social' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-primary mb-6">Social Links</h2>

                                    {[
                                        { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={20} />, placeholder: 'https://linkedin.com/in/username' },
                                        { key: 'github', label: 'GitHub', icon: <Github size={20} />, placeholder: 'https://github.com/username' },
                                        { key: 'twitter', label: 'Twitter / X', icon: <Twitter size={20} />, placeholder: 'https://twitter.com/username' },
                                        { key: 'website', label: 'Personal Website', icon: <Globe size={20} />, placeholder: 'https://yourwebsite.com' },
                                        { key: 'email', label: 'Email', icon: <Mail size={20} />, placeholder: 'email@example.com' }
                                    ].map(social => (
                                        <div key={social.key} className="flex items-center gap-4">
                                            <span className="text-primary opacity-80">{social.icon}</span>
                                            <div className="flex-1">
                                                <label className="block text-secondary text-sm font-medium mb-2">{social.label}</label>
                                                <input
                                                    type={social.key === 'email' ? 'email' : 'url'}
                                                    value={formData.socialLinks[social.key]}
                                                    onChange={(e) => handleSocialChange(social.key, e.target.value)}
                                                    className="input-field"
                                                    placeholder={social.placeholder}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Error & Save */}
                        {error && (
                            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                <p className="text-red-400 text-center">{error}</p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={() => navigate('/upload')}
                                className="btn-secondary"
                            >
                                ← Back to Upload
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn-primary"
                            >
                                {saving ? (
                                    <span className="flex items-center">
                                        <div className="spinner w-5 h-5 mr-2" />
                                        Saving...
                                    </span>
                                ) : (
                                    'Save & Generate Portfolio →'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default ProfileEditor
