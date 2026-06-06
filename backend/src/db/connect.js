import mongoose from 'mongoose';

let cached = global.mongoose;
let disconnectHandlerRegistered = false;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

function registerDisconnectHandler() {
    if (disconnectHandlerRegistered) return;
    disconnectHandlerRegistered = true;

    mongoose.connection.on('disconnected', () => {
        cached.conn = null;
        cached.promise = null;
    });
}

function clearCache() {
    cached.conn = null;
    cached.promise = null;
}

export async function connectDB() {
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    if (cached.conn && mongoose.connection.readyState !== 1) {
        clearCache();
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongooseInstance) => {
            registerDisconnectHandler();
            console.log('Connected to MongoDB');
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        clearCache();
        throw error;
    }

    return cached.conn;
}

export function isDbConnected() {
    return mongoose.connection.readyState === 1;
}