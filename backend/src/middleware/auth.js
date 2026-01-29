import { clerkClient, requireAuth } from '@clerk/express';

// Middleware to require authentication
export const authMiddleware = requireAuth();

// Extract user info from Clerk session
export const getUserFromAuth = async (req, res, next) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.clerkUserId = req.auth.userId;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export default authMiddleware;
