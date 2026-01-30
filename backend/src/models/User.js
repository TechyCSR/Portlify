import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 3,
    maxlength: 7,
    match: /^[a-z0-9_-]+$/
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  // User Preferences (set during onboarding)
  preferences: {
    portfolioType: {
      type: String,
      enum: ['technical', 'non-technical'],
      default: 'technical'
    },
    experienceLevel: {
      type: String,
      enum: ['fresher', 'experienced'],
      default: 'fresher'
    },
    themePreference: {
      type: String,
      enum: ['modern', 'minimal', 'creative', 'professional'],
      default: 'modern'
    }
  },

  // Onboarding status
  onboardingCompleted: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;
