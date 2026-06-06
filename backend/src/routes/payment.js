import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import authMiddleware, { getUserFromAuth } from '../middleware/auth.js';
import { validateHttpsUrl } from '../utils/validateUrl.js';

const router = express.Router();

const PREMIUM_AMOUNT = 1100;

let razorpayInstance = null;

function getRazorpay() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        return null;
    }

    if (!razorpayInstance) {
        razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
        });
    }

    return razorpayInstance;
}

function paymentNotConfigured(res) {
    return res.status(503).json({
        error: 'Payment service is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
    });
}

function signaturesMatch(expected, actual) {
    if (typeof expected !== 'string' || typeof actual !== 'string') {
        return false;
    }

    const expectedBuf = Buffer.from(expected, 'utf8');
    const actualBuf = Buffer.from(actual, 'utf8');

    if (expectedBuf.length !== actualBuf.length) {
        return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

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
        const razorpay = getRazorpay();
        if (!razorpay) {
            return paymentNotConfigured(res);
        }

        const user = await User.findOne({ clerkId: req.clerkUserId });

        if (!user) {
            return res.status(404).json({ error: 'User not found', needsRegistration: true });
        }

        if (user.isPremium) {
            return res.status(400).json({ error: 'You are already a premium member' });
        }

        const options = {
            amount: PREMIUM_AMOUNT,
            currency: 'INR',
            receipt: `prem_${Date.now()}`,
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
        const razorpay = getRazorpay();
        if (!razorpay) {
            return paymentNotConfigured(res);
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment verification data' });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (!signaturesMatch(expectedSignature, razorpay_signature)) {
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        const existingUser = await User.findOne({ clerkId: req.clerkUserId });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found', needsRegistration: true });
        }

        if (existingUser.isPremium && existingUser.premiumDetails?.orderId === razorpay_order_id) {
            return res.json({
                success: true,
                message: 'Premium membership already active',
                isPremium: true
            });
        }

        const order = await razorpay.orders.fetch(razorpay_order_id);

        if (Number(order.amount) !== PREMIUM_AMOUNT) {
            return res.status(400).json({ error: 'Invalid payment amount' });
        }

        if (order.notes?.userId !== existingUser._id.toString()) {
            return res.status(403).json({ error: 'Payment order does not belong to this user' });
        }

        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        if (payment.status !== 'captured') {
            return res.status(400).json({ error: 'Payment has not been completed' });
        }

        if (payment.order_id !== razorpay_order_id) {
            return res.status(400).json({ error: 'Payment does not match order' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { clerkId: req.clerkUserId, isPremium: false },
            {
                $set: {
                    isPremium: true,
                    premiumDetails: {
                        activatedAt: new Date(),
                        paymentId: razorpay_payment_id,
                        orderId: razorpay_order_id
                    }
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            const currentUser = await User.findOne({ clerkId: req.clerkUserId });
            if (currentUser?.isPremium && currentUser.premiumDetails?.orderId === razorpay_order_id) {
                return res.json({
                    success: true,
                    message: 'Premium membership already active',
                    isPremium: true
                });
            }
            return res.status(400).json({ error: 'You are already a premium member' });
        }

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

        if (!user.isPremium) {
            return res.status(403).json({ error: 'Premium membership required for custom branding' });
        }

        let brandingUrl = '';
        if (url) {
            const safeUrl = validateHttpsUrl(url);
            if (!safeUrl) {
                return res.status(400).json({ error: 'Branding URL must be a valid HTTPS link' });
            }
            brandingUrl = safeUrl;
        }

        const profile = await Profile.findOneAndUpdate(
            { userId: user._id },
            {
                customBranding: {
                    enabled: enabled !== undefined ? enabled : true,
                    text: text || '',
                    url: brandingUrl
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