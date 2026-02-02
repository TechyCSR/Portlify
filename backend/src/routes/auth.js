import express from 'express';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Analytics from '../models/Analytics.js';
import authMiddleware, { getUserFromAuth } from '../middleware/auth.js';

const router = express.Router();

// Check username availability (public)
router.get('/check-username', async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Validate username format - max 8 characters
        const usernameRegex = /^[a-z0-9_-]{3,8}$/;
        if (!usernameRegex.test(username.toLowerCase())) {
            return res.status(400).json({
                available: false,
                error: 'Username must be 3-8 characters, lowercase letters, numbers, underscores, or hyphens only'
            });
        }

        // Check reserved usernames
        const reserved = ['admin', 'api', 'auth', 'dash', 'login', 'signup', 'user', 'help', 'app'];
        if (reserved.includes(username.toLowerCase())) {
            return res.status(400).json({ available: false, error: 'This username is reserved' });
        }

        const existingUser = await User.findOne({ username: username.toLowerCase() });

        res.json({
            available: !existingUser,
            username: username.toLowerCase()
        });
    } catch (error) {
        console.error('Check username error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Register user with username (protected)
router.post('/register', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const { username, email } = req.body;
        const clerkId = req.clerkUserId;

        if (!username || !email) {
            return res.status(400).json({ error: 'Username and email are required' });
        }

        // Validate username format
        const usernameRegex = /^[a-z0-9_-]{3,7}$/;
        if (!usernameRegex.test(username.toLowerCase())) {
            return res.status(400).json({
                error: 'Username must be 3-7 characters, lowercase letters, numbers, underscores, or hyphens only'
            });
        }

        // Check if user already exists with this Clerk ID
        const existingUser = await User.findOne({ clerkId });
        if (existingUser) {
            return res.status(400).json({ error: 'User already registered', user: existingUser });
        }

        // Check username availability again
        const usernameTaken = await User.findOne({ username: username.toLowerCase() });
        if (usernameTaken) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        // Create user
        const user = new User({
            clerkId,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            onboardingCompleted: false
        });

        await user.save();

        // Create empty profile
        const profile = new Profile({
            userId: user._id,
            username: user.username
        });

        await profile.save();

        // Create analytics entry
        await Analytics.getOrCreate(profile._id, user.username);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                onboardingCompleted: user.onboardingCompleted
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user (protected)
router.get('/me', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.clerkUserId });

        if (!user) {
            return res.status(404).json({ error: 'User not found', needsRegistration: true });
        }

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            preferences: user.preferences,
            onboardingCompleted: user.onboardingCompleted,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user preferences (protected)
router.get('/preferences', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.clerkUserId });

        if (!user) {
            return res.status(404).json({ error: 'User not found', needsRegistration: true });
        }

        res.json({
            preferences: user.preferences,
            onboardingCompleted: user.onboardingCompleted
        });
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Save user preferences (protected) - used during onboarding
router.post('/preferences', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const { portfolioType, experienceLevel, themePreference } = req.body;

        const user = await User.findOne({ clerkId: req.clerkUserId });

        if (!user) {
            return res.status(404).json({ error: 'User not found', needsRegistration: true });
        }

        // Update preferences
        if (portfolioType) user.preferences.portfolioType = portfolioType;
        if (experienceLevel) user.preferences.experienceLevel = experienceLevel;
        if (themePreference) user.preferences.themePreference = themePreference;

        user.onboardingCompleted = true;

        await user.save();

        // Also update profile theme
        await Profile.findOneAndUpdate(
            { userId: user._id },
            { theme: themePreference || 'modern' }
        );

        res.json({
            message: 'Preferences saved successfully',
            preferences: user.preferences,
            onboardingCompleted: user.onboardingCompleted
        });
    } catch (error) {
        console.error('Save preferences error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update preferences (protected) - used from settings page
router.put('/preferences', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const { portfolioType, experienceLevel, themePreference } = req.body;

        console.log('Updating preferences for user:', req.clerkUserId);
        console.log('Request body:', req.body);

        const user = await User.findOne({ clerkId: req.clerkUserId });

        if (!user) {
            console.log('User not found for clerkId:', req.clerkUserId);
            return res.status(404).json({ error: 'User not found', needsRegistration: true });
        }

        // Update only provided preferences
        if (portfolioType) user.preferences.portfolioType = portfolioType;
        if (experienceLevel) user.preferences.experienceLevel = experienceLevel;
        if (themePreference) {
            user.preferences.themePreference = themePreference;
            // Also update profile theme
            try {
                await Profile.findOneAndUpdate(
                    { userId: user._id },
                    { theme: themePreference }
                );
            } catch (profileError) {
                console.error('Error updating profile theme:', profileError);
                // Continue with saving user preferences even if profile update fails
            }
        }

        await user.save();

        console.log('Preferences updated successfully for user:', user.username);

        res.json({
            message: 'Preferences updated successfully',
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: error.message || 'Failed to update preferences' });
    }
});

export default router;
