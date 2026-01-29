import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import authMiddleware, { getUserFromAuth } from '../middleware/auth.js';

const router = express.Router();

// Generate signed upload params (protected)
router.get('/signature', authMiddleware, getUserFromAuth, async (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        // Create upload params
        const params = {
            timestamp,
            folder: 'portlify/resumes',
            resource_type: 'raw',
            allowed_formats: 'pdf',
            max_file_size: 10000000 // 10MB limit
        };

        // Generate signature
        const signature = cloudinary.utils.api_sign_request(
            params,
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            folder: params.folder
        });
    } catch (error) {
        console.error('Cloudinary signature error:', error);
        res.status(500).json({ error: 'Failed to generate upload signature' });
    }
});

export default router;
