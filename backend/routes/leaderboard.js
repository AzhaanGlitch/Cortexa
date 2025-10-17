const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/leaderboard
// @desc    Get global leaderboard
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { limit = 50, period = 'all' } = req.query;

        let query = {};

        // Filter by time period (for future implementation)
        if (period === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            query.lastActive = { $gte: weekAgo };
        } else if (period === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            query.lastActive = { $gte: monthAgo };
        }

        const users = await User.find(query)
            .select('username avatar points level streak')
            .sort({ points: -1 })
            .limit(parseInt(limit));

        // Add rank to each user
        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            id: user._id,
            username: user.username,
            avatar: user.avatar,
            points: user.points,
            level: user.level,
            streak: user.streak
        }));

        res.json({
            success: true,
            count: leaderboard.length,
            leaderboard
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/leaderboard/rank/:userId
// @desc    Get user's rank
// @access  Public
router.get('/rank/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Count users with more points
        const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;

        res.json({
            success: true,
            rank,
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

module.exports = router;