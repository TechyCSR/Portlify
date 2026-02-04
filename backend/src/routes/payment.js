import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import authMiddleware, { getUserFromAuth } from '../middleware/auth.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Premium price in paise (11 INR = 1100 paise)
const PREMIUM_AMOUNT = 1100;

// Get premium status (protected)
router.get('/status', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.clerkUserId });

        if (!user) {
            return res.status(404).json({ error: 'User not found', needsRegistration: true });
        }

        res.json({
            isPremium: user.isPremium,
            premiumDetails: user.premiumDetails
        });
    } catch (error) {
        console.error('Get premium status error:', error);
        res.status(500).json({ error: 'Failed to get premium status' });
    }
});

// Create Razorpay order (protected)
router.post('/create-order', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.clerkUserId });

        if (!user) {
            return res.status(404).json({ error: 'User not found', needsRegistration: true });
        }

        // Check if already premium
        if (user.isPremium) {
            return res.status(400).json({ error: 'You are already a premium member' });
        }

        // Create Razorpay order
        const options = {
            amount: PREMIUM_AMOUNT,
            currency: 'INR',
            receipt: `premium_${user._id}_${Date.now()}`,
            notes: {
                userId: user._id.toString(),
                username: user.username,
                email: user.email
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
});

// Verify payment and activate premium (protected)
router.post('/verify', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment verification data' });
        }

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        // Update user to premium
        const user = await User.findOneAndUpdate(
            { clerkId: req.clerkUserId },
            {
                isPremium: true,
                premiumDetails: {
                    activatedAt: new Date(),
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`Premium activated for user: ${user.username}`);

        res.json({
            success: true,
            message: 'Premium membership activated successfully!',
            isPremium: true
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// Update custom branding (premium only)
router.put('/branding', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const { text, url, enabled } = req.body;

        const user = await User.findOne({ clerkId: req.clerkUserId });

        if (!user) {
            return res.status(404).json({ error: 'User not found', needsRegistration: true });
        }

        // Check premium status
        if (!user.isPremium) {
            return res.status(403).json({ error: 'Premium membership required for custom branding' });
        }

        // Update profile branding
        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            {
                customBranding: {
                    enabled: enabled !== undefined ? enabled : true,
                    text: text || '',
                    url: url || ''
                }
            },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            message: 'Custom branding updated successfully',
            customBranding: profile.customBranding
        });
    } catch (error) {
        console.error('Update branding error:', error);
        res.status(500).json({ error: 'Failed to update custom branding' });
    }
});

// Get custom branding (protected)
router.get('/branding', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.clerkUserId });

        if (!user) {
            return res.status(404).json({ error: 'User not found', needsRegistration: true });
        }

        const profile = await Profile.findOne({ userId: user._id });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            isPremium: user.isPremium,
            customBranding: profile.customBranding || { enabled: false, text: '', url: '' }
        });
    } catch (error) {
        console.error('Get branding error:', error);
        res.status(500).json({ error: 'Failed to get custom branding' });
    }
});

export default router;
