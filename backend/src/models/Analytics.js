import mongoose from 'mongoose';

// Daily stat tracking
const dailyStatSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 }
}, { _id: false });

// Referrer tracking
const referrerSchema = new mongoose.Schema({
    source: { type: String, required: true },
    count: { type: Number, default: 0 }
}, { _id: false });

// Location tracking
const locationSchema = new mongoose.Schema({
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    count: { type: Number, default: 0 }
}, { _id: false });

// Main analytics schema
const analyticsSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    // Overall stats
    totalViews: {
        type: Number,
        default: 0
    },
    uniqueVisitors: {
        type: Number,
        default: 0
    },

    // Visitor IDs for unique tracking (hashed IPs or fingerprints)
    visitorHashes: {
        type: [String],
        default: []
    },

    // Time-based stats
    dailyStats: {
        type: [dailyStatSchema],
        default: []
    },

    // Referrer sources
    referrers: {
        type: [referrerSchema],
        default: []
    },

    // Device breakdown
    devices: {
        desktop: { type: Number, default: 0 },
        mobile: { type: Number, default: 0 },
        tablet: { type: Number, default: 0 }
    },

    // Geographic distribution
    locations: {
        type: [locationSchema],
        default: []
    },

    // Last updated
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Indexes are automatically created by unique:true on username and profileId

// Method to record a view
analyticsSchema.methods.recordView = async function (visitorHash, device, referrer, location) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Increment total views
    this.totalViews += 1;

    // Check for unique visitor
    const isUnique = !this.visitorHashes.includes(visitorHash);
    if (isUnique) {
        this.uniqueVisitors += 1;
        this.visitorHashes.push(visitorHash);
        // Limit stored hashes to prevent unbounded growth
        if (this.visitorHashes.length > 10000) {
            this.visitorHashes = this.visitorHashes.slice(-5000);
        }
    }

    // Update daily stats
    let todayStat = this.dailyStats.find(s =>
        s.date.getTime() === today.getTime()
    );
    if (!todayStat) {
        this.dailyStats.push({
            date: today,
            views: 1,
            uniqueViews: isUnique ? 1 : 0
        });
        // Keep only last 90 days
        if (this.dailyStats.length > 90) {
            this.dailyStats = this.dailyStats.slice(-90);
        }
    } else {
        todayStat.views += 1;
        if (isUnique) todayStat.uniqueViews += 1;
    }

    // Update device stats
    if (device && this.devices[device] !== undefined) {
        this.devices[device] += 1;
    }

    // Update referrer stats
    if (referrer) {
        const existingRef = this.referrers.find(r => r.source === referrer);
        if (existingRef) {
            existingRef.count += 1;
        } else {
            this.referrers.push({ source: referrer, count: 1 });
        }
    }

    // Update location stats
    if (location && location.country) {
        const existingLoc = this.locations.find(
            l => l.country === location.country && l.city === (location.city || '')
        );
        if (existingLoc) {
            existingLoc.count += 1;
        } else {
            this.locations.push({
                country: location.country,
                city: location.city || '',
                count: 1
            });
        }
    }

    this.lastUpdated = Date.now();
    return this.save();
};

// Static method to get or create analytics for a profile
analyticsSchema.statics.getOrCreate = async function (profileId, username) {
    let analytics = await this.findOne({ profileId });
    if (!analytics) {
        analytics = new this({ profileId, username });
        await analytics.save();
    }
    return analytics;
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
