const express = require('express');
const router = express.Router();
const User = require('./models/User');
const Course = require('./models/Course');
const { protect } = require('../middleware/auth');

// @route   PUT /api/users/points
// @desc    Update user points
// @access  Private
router.put('/points', protect, async (req, res) => {
    const { points } = req.body;

    if (!points || points < 0) {
        return res.status(400).json({
            success: false,
            message: 'Please provide valid points'
        });
    }

    try {
        const user = await User.findById(req.user.id);
        await user.addPoints(points);

        res.json({
            success: true,
            points: user.points,
            level: user.level
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/users/achievements
// @desc    Unlock achievement
// @access  Private
router.post('/achievements', protect, async (req, res) => {
    const { achievementId, points } = req.body;

    if (!achievementId) {
        return res.status(400).json({
            success: false,
            message: 'Achievement ID is required'
        });
    }

    try {
        const user = await User.findById(req.user.id);
        const unlocked = await user.unlockAchievement(achievementId);

        if (unlocked && points) {
            await user.addPoints(points);
        }

        res.json({
            success: true,
            unlocked,
            message: unlocked ? 'Achievement unlocked!' : 'Achievement already unlocked',
            achievements: user.achievements,
            points: user.points
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/users/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/enroll', protect, async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({
            success: false,
            message: 'Course ID is required'
        });
    }

    try {
        const user = await User.findById(req.user.id);
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if already enrolled
        const alreadyEnrolled = user.enrolledCourses.find(
            c => c.courseId.toString() === courseId
        );

        if (alreadyEnrolled) {
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this course'
            });
        }

        // Enroll user
        user.enrolledCourses.push({
            courseId,
            progress: 0,
            completedLessons: []
        });

        // Update course enrollment count
        course.enrolledCount += 1;

        await user.save();
        await course.save();

        res.json({
            success: true,
            message: 'Enrolled successfully',
            enrolledCourses: user.enrolledCourses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/users/progress
// @desc    Update course progress
// @access  Private
router.put('/progress', protect, async (req, res) => {
    const { courseId, lessonId, score, correctAnswers, totalQuestions } = req.body;

    if (!courseId || lessonId === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Course ID and Lesson ID are required'
        });
    }

    try {
        const user = await User.findById(req.user.id);
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Find enrolled course
        const enrolledCourse = user.enrolledCourses.find(
            c => c.courseId.toString() === courseId
        );

        if (!enrolledCourse) {
            return res.status(400).json({
                success: false,
                message: 'Not enrolled in this course'
            });
        }

        // Add lesson to completed if not already completed
        if (!enrolledCourse.completedLessons.includes(lessonId)) {
            enrolledCourse.completedLessons.push(lessonId);
        }

        // Update progress
        const totalLessons = course.lessons.length;
        enrolledCourse.progress = Math.round(
            (enrolledCourse.completedLessons.length / totalLessons) * 100
        );

        // Check if course completed
        if (enrolledCourse.progress >= 100 && !enrolledCourse.completedAt) {
            enrolledCourse.completedAt = new Date();
            // Award course completion points
            await user.addPoints(course.points);
        }

        // Save quiz score
        if (score !== undefined) {
            user.quizScores.push({
                courseId,
                lessonId,
                score,
                correctAnswers,
                totalQuestions
            });
        }

        await user.save();

        res.json({
            success: true,
            message: 'Progress updated',
            progress: enrolledCourse.progress,
            completedLessons: enrolledCourse.completedLessons,
            points: user.points,
            level: user.level
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -email')
            .populate('enrolledCourses.courseId', 'title category icon');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                avatar: user.avatar,
                points: user.points,
                level: user.level,
                streak: user.streak,
                achievements: user.achievements,
                enrolledCourses: user.enrolledCourses
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;