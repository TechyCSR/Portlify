import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
    title: String,
    company: String,
    duration: String,
    description: String
}, { _id: false });

const educationSchema = new mongoose.Schema({
    degree: String,
    institution: String,
    year: String
}, { _id: false });

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
        lowercase: true,
        index: true
    },
    name: {
        type: String,
        default: ''
    },
    headline: {
        type: String,
        default: ''
    },
    about: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    experience: {
        type: [experienceSchema],
        default: []
    },
    education: {
        type: [educationSchema],
        default: []
    },
    resumeUrl: {
        type: String,
        default: ''
    },
    socialLinks: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' }
    },
    isPublic: {
        type: Boolean,
        default: true
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
