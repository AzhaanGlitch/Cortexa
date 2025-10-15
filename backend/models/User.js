const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    level: {
        type: Number,
        default: 1,
        min: 1
    },
    streak: {
        type: Number,
        default: 0,
        min: 0
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    achievements: [{
        achievementId: {
            type: String,
            required: true
        },
        unlockedAt: {
            type: Date,
            default: Date.now
        }
    }],
    enrolledCourses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        completedLessons: [{
            type: Number
        }],
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        completedAt: Date
    }],
    quizScores: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        lessonId: Number,
        score: Number,
        correctAnswers: Number,
        totalQuestions: Number,
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    dailyChallenges: [{
        challengeId: String,
        progress: Number,
        completedAt: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level from points
userSchema.methods.calculateLevel = function() {
    this.level = Math.floor(this.points / 1000) + 1;
    return this.level;
};

// Method to add points and update level
userSchema.methods.addPoints = async function(points) {
    this.points += points;
    this.calculateLevel();
    await this.save();
    return this.points;
};

// Method to unlock achievement
userSchema.methods.unlockAchievement = async function(achievementId) {
    const exists = this.achievements.find(a => a.achievementId === achievementId);
    if (!exists) {
        this.achievements.push({ achievementId });
        await this.save();
        return true;
    }
    return false;
};

// Method to update streak
userSchema.methods.updateStreak = async function() {
    const now = new Date();
    const lastActive = new Date(this.lastActive);
    const daysDiff = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
        // Consecutive day
        this.streak += 1;
    } else if (daysDiff > 1) {
        // Streak broken
        this.streak = 1;
    }
    // If same day, don't change streak
    
    this.lastActive = now;
    await this.save();
    return this.streak;
};

module.exports = mongoose.model('User', userSchema);