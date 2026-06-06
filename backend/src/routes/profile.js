import express from 'express';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import authMiddleware, { getUserFromAuth } from '../middleware/auth.js';
import { parseResumeWithAI } from '../utils/geminiParser.js';
import { validateCloudinaryUrl, validateCloudinaryPhotoUrl } from '../utils/validateUrl.js';
import { pickAllowedProfileFields, getDefaultSkills, getEmptyProfileData } from '../utils/profileFields.js';
import { sanitizeProfileFields } from '../utils/sanitizeProfile.js';

const router = express.Router();

const userNotFoundResponse = () => ({ error: 'User not found', needsRegistration: true });

// Parse resume with AI (returns data without saving)
router.post('/parse', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const { resumeUrl } = req.body;

        if (!resumeUrl) {
            return res.status(400).json({ error: 'Resume URL is required' });
        }

        const urlValidation = validateCloudinaryUrl(resumeUrl);
        if (!urlValidation.valid) {
            return res.status(400).json({ error: urlValidation.error });
        }

        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json(userNotFoundResponse());
        }

        const parsedData = await parseResumeWithAI(resumeUrl);

        res.json({
            message: 'Resume parsed successfully',
            data: parsedData,
            resumeUrl
        });
    } catch (error) {
        console.error('Parse resume error:', error);
        const message = process.env.NODE_ENV === 'production'
            ? 'Failed to parse resume'
            : (error.message || 'Failed to parse resume');
        res.status(500).json({ error: message });
    }
});

// Create/update profile with parsed data (after user review)
router.post('/create', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const allowedFields = pickAllowedProfileFields(req.body);
        const { resumeUrl } = req.body;

        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json(userNotFoundResponse());
        }

        const fieldsToSanitize = {
            resumeUrl: resumeUrl || '',
            ...allowedFields,
            skills: allowedFields.skills || getDefaultSkills()
        };

        const { sanitized, error: sanitizeError } = sanitizeProfileFields(fieldsToSanitize);
        if (sanitizeError) {
            return res.status(400).json({ error: sanitizeError });
        }

        const profileData = {
            username: user.username,
            ...sanitized,
            updatedAt: new Date()
        };

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
        const updates = pickAllowedProfileFields(req.body);

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json(userNotFoundResponse());
        }

        const { sanitized, error: sanitizeError } = sanitizeProfileFields(updates);
        if (sanitizeError) {
            return res.status(400).json({ error: sanitizeError });
        }

        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            { ...sanitized, updatedAt: new Date() },
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

        const photoValidation = validateCloudinaryPhotoUrl(photoUrl);
        if (!photoValidation.valid) {
            return res.status(400).json({ error: photoValidation.error });
        }

        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json(userNotFoundResponse());
        }

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
            return res.status(404).json(userNotFoundResponse());
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
        }).select('-resumeUrl -userId');

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Reset profile data (protected)
router.post('/reset', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json(userNotFoundResponse());
        }

        const emptyData = getEmptyProfileData();

        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            { ...emptyData, updatedAt: new Date() },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        user.preferences = {
            portfolioType: 'technical',
            experienceLevel: 'fresher',
            themePreference: 'modern'
        };
        await user.save();

        res.json({
            message: 'Profile reset successfully',
            profile
        });
    } catch (error) {
        console.error('Reset profile error:', error);
        res.status(500).json({ error: 'Failed to reset profile' });
    }
});

// Update profile visibility (protected)
router.put('/visibility', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const { isPublic } = req.body;

        if (typeof isPublic !== 'boolean') {
            return res.status(400).json({ error: 'isPublic must be a boolean' });
        }

        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json(userNotFoundResponse());
        }

        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            { isPublic, updatedAt: new Date() },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            message: 'Visibility updated successfully',
            isPublic: profile.isPublic
        });
    } catch (error) {
        console.error('Update visibility error:', error);
        res.status(500).json({ error: 'Failed to update visibility' });
    }
});

export default router;