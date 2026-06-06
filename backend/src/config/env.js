const REQUIRED_ALWAYS = [
    'MONGODB_URI',
    'CLERK_SECRET_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'OLLAMA_API_KEY'
];

const REQUIRED_PRODUCTION = [
    'FRONTEND_URL',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
];

export function validateEnv() {
    const missing = REQUIRED_ALWAYS.filter((key) => !process.env[key]);

    if (process.env.NODE_ENV === 'production') {
        missing.push(...REQUIRED_PRODUCTION.filter((key) => !process.env[key]));
    }

    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
}