const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['programming', 'design', 'business', 'data', 'marketing'],
        lowercase: true
    },
    level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    duration: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true,
        min: 0
    },
    icon: {
        type: String,
        default: 'fa-book'
    },
    color: {
        type: String,
        default: 'linear-gradient(135deg, #0066ff, #00d4ff)'
    },
    lessons: [{
        lessonNumber: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        duration: String,
        icon: String,
        content: String,
        quiz: [{
            question: String,
            options: [String],
            correctAnswer: Number
        }]
    }],
    objectives: [{
        type: String
    }],
    enrolledCount: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Method to get total lessons
courseSchema.virtual('totalLessons').get(function() {
    return this.lessons.length;
});

module.exports = mongoose.model('Course', courseSchema);