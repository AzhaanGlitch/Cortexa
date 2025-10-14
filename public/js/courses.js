// Global State Management
const AppState = {
    user: {
        name: 'Learner',
        points: 0,
        level: 1,
        streak: 0,
        coursesCompleted: 0,
        badges: []
    },
    courses: [],
    leaderboard: [],
    achievements: [],
    challenges: []
};

// Initialize state from memory or create default
function initializeAppState() {
    // In a real app, this would load from a backend/database
    // For now, we'll use in-memory state
    
    if (!AppState.user.points) {
        AppState.user = {
            name: 'Learner',
            points: 350,
            level: 3,
            streak: 5,
            coursesCompleted: 2,
            badges: ['starter', 'fast-learner']
        };
    }
    
    // Initialize courses
    AppState.courses = [
        {
            id: 1,
            title: 'JavaScript Fundamentals',
            category: 'programming',
            description: 'Master the basics of JavaScript programming',
            duration: '4 weeks',
            level: 'Beginner',
            lessons: 24,
            points: 500,
            enrolled: 2547,
            progress: 45,
            status: 'in-progress',
            icon: 'fa-js',
            color: 'linear-gradient(135deg, #f7df1e, #f0db4f)',
            objectives: [
                'Understand variables, data types, and operators',
                'Work with functions and scope',
                'Master arrays and objects',
                'Handle events and DOM manipulation'
            ],
            curriculum: [
                { title: 'Introduction to JavaScript', duration: '45 min', icon: 'fa-play-circle' },
                { title: 'Variables and Data Types', duration: '1 hour', icon: 'fa-book' },
                { title: 'Control Flow and Loops', duration: '1.5 hours', icon: 'fa-code' },
                { title: 'Functions Deep Dive', duration: '2 hours', icon: 'fa-cog' }
            ]
        },
        {
            id: 2,
            title: 'React for Beginners',
            category: 'programming',
            description: 'Build modern web applications with React',
            duration: '6 weeks',
            level: 'Intermediate',
            lessons: 32,
            points: 750,
            enrolled: 1823,
            progress: 0,
            status: 'new',
            icon: 'fa-react',
            color: 'linear-gradient(135deg, #61dafb, #21a1c4)',
            objectives: [
                'Understand React components and props',
                'Master state management with hooks',
                'Build reusable UI components',
                'Create full-stack applications'
            ],
            curriculum: [
                { title: 'React Basics', duration: '1 hour', icon: 'fa-play-circle' },
                { title: 'Components and Props', duration: '1.5 hours', icon: 'fa-puzzle-piece' },
                { title: 'State and Lifecycle', duration: '2 hours', icon: 'fa-sync' },
                { title: 'Hooks in Depth', duration: '2 hours', icon: 'fa-link' }
            ]
        },
        {
            id: 3,
            title: 'Python Programming',
            category: 'programming',
            description: 'Learn Python from scratch to advanced',
            duration: '8 weeks',
            level: 'Beginner',
            lessons: 40,
            points: 800,
            enrolled: 3421,
            progress: 100,
            status: 'completed',
            icon: 'fa-python',
            color: 'linear-gradient(135deg, #3776ab, #ffd343)',
            objectives: [
                'Master Python syntax and fundamentals',
                'Work with data structures',
                'Object-oriented programming',
                'File handling and databases'
            ],
            curriculum: [
                { title: 'Python Basics', duration: '1 hour', icon: 'fa-play-circle' },
                { title: 'Data Structures', duration: '2 hours', icon: 'fa-database' },
                { title: 'OOP Concepts', duration: '2.5 hours', icon: 'fa-object-group' },
                { title: 'Advanced Topics', duration: '3 hours', icon: 'fa-rocket' }
            ]
        },
        {
            id: 4,
            title: 'UI/UX Design Principles',
            category: 'design',
            description: 'Create beautiful and functional user interfaces',
            duration: '5 weeks',
            level: 'Beginner',
            lessons: 28,
            points: 600,
            enrolled: 1654,
            progress: 0,
            status: 'new',
            icon: 'fa-pencil-ruler',
            color: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
            objectives: [
                'Understand design principles',
                'Master color theory and typography',
                'Create user-centered designs',
                'Prototype and test designs'
            ],
            curriculum: [
                { title: 'Design Fundamentals', duration: '1 hour', icon: 'fa-paint-brush' },
                { title: 'Color and Typography', duration: '1.5 hours', icon: 'fa-palette' },
                { title: 'User Research', duration: '2 hours', icon: 'fa-users' },
                { title: 'Prototyping', duration: '2 hours', icon: 'fa-drafting-compass' }
            ]
        },
        {
            id: 5,
            title: 'Data Science with Python',
            category: 'data',
            description: 'Analyze data and build machine learning models',
            duration: '10 weeks',
            level: 'Advanced',
            lessons: 48,
            points: 1000,
            enrolled: 2134,
            progress: 15,
            status: 'in-progress',
            icon: 'fa-chart-bar',
            color: 'linear-gradient(135deg, #667eea, #764ba2)',
            objectives: [
                'Master data analysis with pandas',
                'Visualize data effectively',
                'Build ML models with scikit-learn',
                'Deep learning basics with TensorFlow'
            ],
            curriculum: [
                { title: 'Data Analysis Basics', duration: '2 hours', icon: 'fa-table' },
                { title: 'Data Visualization', duration: '2 hours', icon: 'fa-chart-line' },
                { title: 'Machine Learning', duration: '3 hours', icon: 'fa-brain' },
                { title: 'Deep Learning', duration: '4 hours', icon: 'fa-network-wired' }
            ]
        },
        {
            id: 6,
            title: 'Digital Marketing Strategy',
            category: 'marketing',
            description: 'Master online marketing and grow your business',
            duration: '6 weeks',
            level: 'Intermediate',
            lessons: 30,
            points: 650,
            enrolled: 1987,
            progress: 0,
            status: 'new',
            icon: 'fa-bullhorn',
            color: 'linear-gradient(135deg, #f093fb, #f5576c)',
            objectives: [
                'Understand digital marketing channels',
                'Create effective campaigns',
                'Analyze marketing metrics',
                'Optimize for conversions'
            ],
            curriculum: [
                { title: 'Marketing Fundamentals', duration: '1.5 hours', icon: 'fa-lightbulb' },
                { title: 'Social Media Marketing', duration: '2 hours', icon: 'fa-share-alt' },
                { title: 'SEO and Content', duration: '2 hours', icon: 'fa-search' },
                { title: 'Analytics', duration: '2 hours', icon: 'fa-chart-pie' }
            ]
        }
    ];
    
    // Initialize leaderboard
    AppState.leaderboard = [
        { name: 'Alex Thunder', points: 5240, level: 12, avatar: 'AT', rank: 1 },
        { name: 'Sarah Chen', points: 4890, level: 11, avatar: 'SC', rank: 2 },
        { name: 'Marcus Steel', points: 4560, level: 10, avatar: 'MS', rank: 3 },
        { name: 'Emma Watson', points: 3980, level: 9, avatar: 'EW', rank: 4 },
        { name: 'David Kim', points: 3750, level: 9, avatar: 'DK', rank: 5 },
        { name: 'Lisa Park', points: 3420, level: 8, avatar: 'LP', rank: 6 },
        { name: 'You', points: AppState.user.points, level: AppState.user.level, avatar: 'ME', rank: 7, isCurrentUser: true },
        { name: 'John Doe', points: 2890, level: 7, avatar: 'JD', rank: 8 },
        { name: 'Anna Lee', points: 2540, level: 6, avatar: 'AL', rank: 9 },
        { name: 'Mike Ross', points: 2180, level: 6, avatar: 'MR', rank: 10 }
    ];
    
    // Initialize achievements
    AppState.achievements = [
        {
            id: 'starter',
            name: 'Starter',
            description: 'Complete your first lesson',
            icon: 'fa-rocket',
            unlocked: true,
            points: 50
        },
        {
            id: 'fast-learner',
            name: 'Fast Learner',
            description: 'Complete 5 lessons in one day',
            icon: 'fa-bolt',
            unlocked: true,
            points: 100
        },
        {
            id: 'dedicated',
            name: 'Dedicated',
            description: 'Maintain a 7-day streak',
            icon: 'fa-fire',
            unlocked: false,
            points: 150
        },
        {
            id: 'master',
            name: 'Master',
            description: 'Complete 5 courses',
            icon: 'fa-crown',
            unlocked: false,
            points: 300
        },
        {
            id: 'perfectionist',
            name: 'Perfectionist',
            description: 'Score 100% on 10 quizzes',
            icon: 'fa-star',
            unlocked: false,
            points: 200
        },
        {
            id: 'champion',
            name: 'Champion',
            description: 'Reach the top of leaderboard',
            icon: 'fa-trophy',
            unlocked: false,
            points: 500
        }
    ];
    
    // Initialize challenges
    AppState.challenges = [
        {
            id: 1,
            title: 'JavaScript Master',
            description: 'Complete 5 JavaScript questions',
            difficulty: 'easy',
            progress: 2,
            total: 5,
            points: 100,
            icon: 'fa-code',
            timeLeft: '12 hours'
        },
        {
            id: 2,
            title: 'Speed Demon',
            description: 'Complete 3 lessons in under 2 hours',
            difficulty: 'medium',
            progress: 0,
            total: 3,
            points: 200,
            icon: 'fa-clock',
            timeLeft: '8 hours'
        },
        {
            id: 3,
            title: 'Perfect Score',
            description: 'Get 100% on any quiz',
            difficulty: 'hard',
            progress: 0,
            total: 1,
            points: 300,
            icon: 'fa-star',
            timeLeft: '24 hours'
        }
    ];
    
    updateNavPoints();
}

// Update navigation points display
function updateNavPoints() {
    const navPointsEl = document.getElementById('navPoints');
    if (navPointsEl) {
        navPointsEl.textContent = AppState.user.points;
    }
}

// Update user points
function updateUserPoints(points) {
    AppState.user.points += points;
    updateNavPoints();
    checkLevelUp();
    showToast(`+${points} points earned!`, 'success');
}

// Calculate level from points
function calculateLevel(points) {
    return Math.floor(points / 1000) + 1;
}

// Calculate points needed for next level
function calculateNextLevelPoints(level) {
    return level * 1000;
}

// Check if user leveled up
function checkLevelUp() {
    const newLevel = calculateLevel(AppState.user.points);
    if (newLevel > AppState.user.level) {
        AppState.user.level = newLevel;
        showLevelUpModal(newLevel);
    }
}

// Show level up modal
function showLevelUpModal(level) {
    showToast(`🎉 Level Up! You're now level ${level}!`, 'success', 5000);
}

// Check for badge unlock
function checkBadgeUnlock(badgeId) {
    const badge = AppState.achievements.find(a => a.id === badgeId);
    if (badge && !badge.unlocked) {
        badge.unlocked = true;
        AppState.user.badges.push(badgeId);
        showBadgeUnlock(badge);
        updateUserPoints(badge.points);
    }
}

// Show badge unlock notification
function showBadgeUnlock(badge) {
    showToast(`🏆 Badge Unlocked: ${badge.name}!`, 'success', 5000);
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white border-0 show`;
    toast.setAttribute('role', 'alert');
    
    let bgClass = 'bg-primary';
    let icon = 'fa-info-circle';
    
    if (type === 'success') {
        bgClass = 'bg-success';
        icon = 'fa-check-circle';
    } else if (type === 'error') {
        bgClass = 'bg-danger';
        icon = 'fa-exclamation-circle';
    } else if (type === 'warning') {
        bgClass = 'bg-warning';
        icon = 'fa-exclamation-triangle';
    }
    
    toast.classList.add(bgClass);
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${icon} me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Format duration
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Get rank class
function getRankClass(rank) {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'default';
}

// Sort and update leaderboard rankings
function updateLeaderboardRankings() {
    AppState.leaderboard.sort((a, b) => b.points - a.points);
    AppState.leaderboard.forEach((user, index) => {
        user.rank = index + 1;
    });
}

// Filter courses by category
function filterCoursesByCategory(category) {
    if (category === 'all') {
        return AppState.courses;
    }
    return AppState.courses.filter(course => course.category === category);
}

// Filter courses by status
function filterCoursesByStatus(status) {
    if (status === 'all') {
        return AppState.courses;
    }
    return AppState.courses.filter(course => course.status === status);
}

// Search courses
function searchCourses(query) {
    const lowerQuery = query.toLowerCase();
    return AppState.courses.filter(course => 
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery) ||
        course.category.toLowerCase().includes(lowerQuery)
    );
}

// Get course by ID
function getCourseById(id) {
    return AppState.courses.find(course => course.id === parseInt(id));
}

// Start course
function startCourse(courseId) {
    const course = getCourseById(courseId);
    if (course) {
        // In a real app, this would navigate to the course page
        window.location.href = `learn.html?course=${courseId}`;
    }
}

// Complete lesson
function completeLesson(courseId, lessonId) {
    const course = getCourseById(courseId);
    if (course) {
        // Update progress
        const lessonsCompleted = Math.floor((course.progress / 100) * course.lessons) + 1;
        course.progress = Math.min(100, (lessonsCompleted / course.lessons) * 100);
        
        // Award points
        const pointsEarned = Math.floor(course.points / course.lessons);
        updateUserPoints(pointsEarned);
        
        // Check if course completed
        if (course.progress >= 100) {
            course.status = 'completed';
            AppState.user.coursesCompleted++;
            showToast(`🎉 Course completed: ${course.title}!`, 'success', 5000);
            checkBadgeUnlock('master');
        }
    }
}

// Get activity data for chart (last 7 days)
function getActivityData() {
    // Simulated data - in real app, this would come from backend
    return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [45, 60, 30, 75, 90, 50, 65]
    };
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get progress color
function getProgressColor(progress) {
    if (progress < 30) return '#ef4444';
    if (progress < 70) return '#f59e0b';
    return '#10b981';
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeAppState();
    
    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Export functions for use in other scripts
window.AppState = AppState;
window.updateUserPoints = updateUserPoints;
window.checkBadgeUnlock = checkBadgeUnlock;
window.showToast = showToast;
window.filterCoursesByCategory = filterCoursesByCategory;
window.filterCoursesByStatus = filterCoursesByStatus;
window.searchCourses = searchCourses;
window.getCourseById = getCourseById;
window.startCourse = startCourse;
window.completeLesson = completeLesson;
window.getActivityData = getActivityData;
window.updateLeaderboardRankings = updateLeaderboardRankings;
window.formatNumber = formatNumber;
window.formatDuration = formatDuration;
window.getRankClass = getRankClass;
window.debounce = debounce;