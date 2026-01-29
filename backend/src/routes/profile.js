import express from 'express';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import authMiddleware, { getUserFromAuth } from '../middleware/auth.js';
import { parseResume } from '../utils/resumeParser.js';

const router = express.Router();

// Create/update profile with resume parsing (protected)
router.post('/create', authMiddleware, getUserFromAuth, async (req, res) => {
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

        // Parse resume
        let parsedData;
        try {
            parsedData = await parseResume(resumeUrl);
        } catch (parseError) {
            console.error('Parse error:', parseError);
            // Return empty profile structure if parsing fails
            parsedData = {
                name: '',
                headline: '',
                about: '',
                skills: [],
                experience: [],
                education: []
            };
        }

        // Update or create profile
        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            {
                ...parsedData,
                resumeUrl,
                username: user.username,
                updatedAt: new Date()
            },
            { new: true, upsert: true }
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

// Update profile (protected)
router.put('/update', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const { name, headline, about, skills, experience, education, socialLinks, isPublic } = req.body;

        // Find user
        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find and update profile
        const profile = await Profile.findOne({ userId: user._id });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Update only provided fields
        if (name !== undefined) profile.name = name;
        if (headline !== undefined) profile.headline = headline;
        if (about !== undefined) profile.about = about;
        if (skills !== undefined) profile.skills = skills;
        if (experience !== undefined) profile.experience = experience;
        if (education !== undefined) profile.education = education;
        if (socialLinks !== undefined) profile.socialLinks = socialLinks;
        if (isPublic !== undefined) profile.isPublic = isPublic;

        await profile.save();

        res.json({
            message: 'Profile updated successfully',
            profile
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
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
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Get my profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Get public profile by username (public)
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
