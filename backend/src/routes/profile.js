import express from 'express';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import authMiddleware, { getUserFromAuth } from '../middleware/auth.js';
import { parseResumeWithGemini } from '../utils/geminiParser.js';

const router = express.Router();

// Parse resume with AI (returns data without saving)
router.post('/parse', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const { resumeUrl } = req.body;

        if (!resumeUrl) {
            return res.status(400).json({ error: 'Resume URL is required' });
        }

        // Find user
        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Parse resume with Gemini AI
        const parsedData = await parseResumeWithGemini(resumeUrl);

        // Return parsed data for user to review/edit
        res.json({
            message: 'Resume parsed successfully',
            data: parsedData,
            resumeUrl
        });
    } catch (error) {
        console.error('Parse resume error:', error);
        res.status(500).json({ error: error.message || 'Failed to parse resume' });
    }
});

// Create/update profile with parsed data (after user review)
router.post('/create', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const {
            resumeUrl,
            basicDetails,
            skills,
            experience,
            education,
            projects,
            achievements,
            extraCurricular,
            socialLinks,
            customSections
        } = req.body;

        // Find user
        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Build profile data
        const profileData = {
            username: user.username,
            resumeUrl: resumeUrl || '',
            basicDetails: basicDetails || {},
            skills: skills || { technical: [], soft: [], tools: [], languages: [] },
            experience: experience || [],
            education: education || [],
            projects: projects || [],
            achievements: achievements || [],
            extraCurricular: extraCurricular || [],
            socialLinks: socialLinks || {},
            customSections: customSections || [],
            updatedAt: new Date()
        };

        // Update or create profile
        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            profileData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({
            message: 'Profile created successfully',
            profile
        });
    } catch (error) {
        console.error('Create profile error:', error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
});

// Update profile (for editing individual sections)
router.put('/update', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const updates = req.body;

        // Find user
        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find and update profile
        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            { ...updates, updatedAt: new Date() },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            profile
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update profile photo
router.put('/photo', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const { photoUrl } = req.body;

        if (!photoUrl) {
            return res.status(400).json({ error: 'Photo URL is required' });
        }

        // Find user
        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update profile photo
        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            { 'basicDetails.profilePhoto': photoUrl, updatedAt: new Date() },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            message: 'Profile photo updated successfully',
            profilePhoto: photoUrl
        });
    } catch (error) {
        console.error('Update photo error:', error);
        res.status(500).json({ error: 'Failed to update profile photo' });
    }
});

// Get my profile (protected)
router.get('/me', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const profile = await Profile.findOne({ userId: user._id });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found', needsSetup: true });
        }

        res.json(profile);
    } catch (error) {
        console.error('Get my profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Get public profile by username (public - no auth required)
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const profile = await Profile.findOne({
            username: username.toLowerCase(),
            isPublic: true
        }).select('-resumeUrl -userId'); // Don't expose resume URL or user ID

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

export default router;
