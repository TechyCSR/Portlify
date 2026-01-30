import express from 'express';
import Analytics from '../models/Analytics.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import authMiddleware, { getUserFromAuth } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Helper to generate visitor hash from request
const getVisitorHash = (req) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return crypto.createHash('md5').update(`${ip}-${userAgent}`).digest('hex');
};

// Helper to detect device type
const getDeviceType = (userAgent) => {
    if (!userAgent) return 'desktop';
    const ua = userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/.test(ua)) return 'mobile';
    return 'desktop';
};

// Track portfolio view (public - called when portfolio is viewed)
router.post('/track/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { referrer } = req.body;

        // Find profile
        const profile = await Profile.findOne({ username: username.toLowerCase() });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Get or create analytics
        const analytics = await Analytics.getOrCreate(profile._id, username.toLowerCase());

        // Get visitor info
        const visitorHash = getVisitorHash(req);
        const device = getDeviceType(req.headers['user-agent']);

        // Record the view
        await analytics.recordView(visitorHash, device, referrer, null);

        // Update profile quick stats
        await Profile.findByIdAndUpdate(profile._id, {
            $inc: { 'stats.totalViews': 1 },
            $set: { 'stats.lastViewed': new Date() }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Track view error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get analytics summary (protected)
router.get('/summary', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.clerkUserId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const profile = await Profile.findOne({ userId: user._id });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const analytics = await Analytics.findOne({ profileId: profile._id });
        if (!analytics) {
            return res.json({
                totalViews: 0,
                uniqueVisitors: 0,
                todayViews: 0,
                weekViews: 0,
                monthViews: 0
            });
        }

        // Calculate period stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);

        const todayStats = analytics.dailyStats.find(s => s.date.getTime() === today.getTime());
        const todayViews = todayStats ? todayStats.views : 0;

        const weekViews = analytics.dailyStats
            .filter(s => s.date >= weekAgo)
            .reduce((sum, s) => sum + s.views, 0);

        const monthViews = analytics.dailyStats
            .filter(s => s.date >= monthAgo)
            .reduce((sum, s) => sum + s.views, 0);

        res.json({
            totalViews: analytics.totalViews,
            uniqueVisitors: analytics.uniqueVisitors,
            todayViews,
            weekViews,
            monthViews
        });
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get detailed analytics (protected)
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

        const analytics = await Analytics.findOne({ profileId: profile._id });
        if (!analytics) {
            return res.json({
                totalViews: 0,
                uniqueVisitors: 0,
                dailyStats: [],
                devices: { desktop: 0, mobile: 0, tablet: 0 },
                referrers: [],
                locations: []
            });
        }

        // Get last 30 days of daily stats
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const recentDailyStats = analytics.dailyStats
            .filter(s => s.date >= thirtyDaysAgo)
            .sort((a, b) => a.date - b.date);

        // Top 10 referrers
        const topReferrers = [...analytics.referrers]
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Top 10 locations
        const topLocations = [...analytics.locations]
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        res.json({
            totalViews: analytics.totalViews,
            uniqueVisitors: analytics.uniqueVisitors,
            dailyStats: recentDailyStats,
            devices: analytics.devices,
            referrers: topReferrers,
            locations: topLocations,
            lastUpdated: analytics.lastUpdated
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
