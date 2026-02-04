import mongoose from 'mongoose';

// Sub-schemas for nested objects
const experienceSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    company: { type: String, default: '' },
    duration: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    achievements: { type: [String], default: [] }
}, { _id: false });

const educationSchema = new mongoose.Schema({
    degree: { type: String, default: '' },
    institution: { type: String, default: '' },
    year: { type: String, default: '' },
    gpa: { type: String, default: '' },
    coursework: { type: [String], default: [] }
}, { _id: false });

const projectSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    demoUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' }
}, { _id: false });

const achievementSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    date: { type: String, default: '' }
}, { _id: false });

const extraCurricularSchema = new mongoose.Schema({
    activity: { type: String, default: '' },
    role: { type: String, default: '' },
    description: { type: String, default: '' }
}, { _id: false });

const customSectionSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    content: { type: String, default: '' }
}, { _id: false });

// New schemas for additional sections
const certificationSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    date: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    credentialId: { type: String, default: '' }
}, { _id: false });

const publicationSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    publisher: { type: String, default: '' },
    date: { type: String, default: '' },
    url: { type: String, default: '' },
    description: { type: String, default: '' }
}, { _id: false });

const volunteeringSchema = new mongoose.Schema({
    organization: { type: String, default: '' },
    role: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' }
}, { _id: false });

// Main profile schema
const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    // Basic Details
    basicDetails: {
        name: { type: String, default: '' },
        headline: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        profilePhoto: { type: String, default: '' }, // Cloudinary URL
        about: { type: String, default: '' }
    },

    // Skills (categorized)
    skills: {
        programmingLanguages: { type: [String], default: [] },
        frameworks: { type: [String], default: [] },
        databases: { type: [String], default: [] },
        tools: { type: [String], default: [] },
        cloudSystems: { type: [String], default: [] },
        softSkills: { type: [String], default: [] }
    },

    // Experience
    experience: {
        type: [experienceSchema],
        default: []
    },

    // Education
    education: {
        type: [educationSchema],
        default: []
    },

    // Projects
    projects: {
        type: [projectSchema],
        default: []
    },

    // Achievements
    achievements: {
        type: [achievementSchema],
        default: []
    },

    // Extra Curricular
    extraCurricular: {
        type: [extraCurricularSchema],
        default: []
    },

    // Certifications (new)
    certifications: {
        type: [certificationSchema],
        default: []
    },

    // Publications (new - for non-technical users)
    publications: {
        type: [publicationSchema],
        default: []
    },

    // Volunteering (new)
    volunteering: {
        type: [volunteeringSchema],
        default: []
    },

    // Social Links
    socialLinks: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' },
        email: { type: String, default: '' }
    },

    // Custom Sections (for unknown sections AI discovers)
    customSections: {
        type: [customSectionSchema],
        default: []
    },

    // Resume URL (private, not exposed in public API)
    resumeUrl: {
        type: String,
        default: ''
    },

    // OG Metadata for social previews
    ogMetadata: {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        image: { type: String, default: '' } // Uses profilePhoto if empty
    },

    // Portfolio settings
    isPublic: {
        type: Boolean,
        default: true
    },

    theme: {
        type: String,
        default: 'modern'
    },

    // Quick analytics (detailed in Analytics model)
    stats: {
        totalViews: { type: Number, default: 0 },
        lastViewed: { type: Date, default: null }
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

profileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
