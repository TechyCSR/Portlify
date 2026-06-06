import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { clerkMiddleware } from '@clerk/express';
import { v2 as cloudinary } from 'cloudinary';
import { validateEnv } from './config/env.js';
import { connectDB, isDbConnected } from './db/connect.js';

import authRoutes from './routes/auth.js';
import cloudinaryRoutes from './routes/cloudinary.js';
import profileRoutes from './routes/profile.js';
import analyticsRoutes from './routes/analytics.js';
import exportRoutes from './routes/export.js';
import paymentRoutes from './routes/payment.js';
import sitemapRoutes from './routes/sitemap.js';

validateEnv();

const app = express();

if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

const parseLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Resume parse limit reached, please try again later' }
});

const analyticsLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many analytics requests' }
});

const usernameCheckLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many username checks' }
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(clerkMiddleware());

app.get('/', (req, res) => {
    res.json({
        message: 'PortlifyAi API is running',
        version: '1.0.0'
    });
});

app.get('/api/health', async (req, res) => {
    try {
        await connectDB();
    } catch (err) {
        console.error('Health check database connection error:', err);
    }

    const dbConnected = isDbConnected();
    if (!dbConnected) {
        return res.status(503).json({ status: 'unhealthy', db: 'disconnected' });
    }
    res.json({ status: 'healthy', db: 'connected' });
});

app.use(async (req, res, next) => {
    try {
        await connectDB();
        if (!isDbConnected()) {
            return res.status(503).json({ error: 'Database unavailable' });
        }
        next();
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(503).json({ error: 'Database unavailable' });
    }
});

app.use('/api/auth/check-username', usernameCheckLimiter);
app.use('/api/analytics/track', analyticsLimiter);
app.use('/api/profile/parse', parseLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/sitemap.xml', sitemapRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : (err.message || 'Internal server error');
    res.status(err.status || 500).json({ error: message });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await connectDB();
        if (!process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

startServer();

export default app;