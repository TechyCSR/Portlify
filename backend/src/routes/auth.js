import express from 'express';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import authMiddleware, { getUserFromAuth } from '../middleware/auth.js';

const router = express.Router();

// Check username availability (public)
router.get('/check-username', async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Validate username format
        const usernameRegex = /^[a-z0-9_-]{3,30}$/;
        if (!usernameRegex.test(username.toLowerCase())) {
            return res.status(400).json({
                available: false,
                error: 'Username must be 3-30 characters, lowercase letters, numbers, underscores, or hyphens only'
            });
        }

        // Check reserved usernames
        const reserved = ['admin', 'api', 'auth', 'dashboard', 'login', 'signup', 'profile', 'settings', 'upload'];
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
            email: email.toLowerCase()
        });

        await user.save();

        // Create empty profile
        const profile = new Profile({
            userId: user._id,
            username: user.username
        });

        await profile.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
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
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
