// Global State Management with Backend Integration
const AppState = {
    user: null,
    courses: [],
    leaderboard: [],
    achievements: [],
    challenges: []
};

const API_URL = 'http://localhost:5000/api';

// Initialize app state from backend
async function initializeAppState() {
    try {
        // Check if authenticated
        if (!auth.isAuthenticated()) {
            console.log('User not authenticated, skipping app state init');
            return;
        }

        console.log('Initializing app state...');

        // Get current user data from backend
        try {
            const userData = await auth.apiRequest('/auth/me');
            AppState.user = userData.user;
            console.log('User data loaded from backend:', AppState.user);
            updateNavPoints();
        } catch (error) {
            console.error('Failed to load user data:', error);
            // Fallback to localStorage but mark as incomplete
            const storedUser = auth.getCurrentUser();
            if (storedUser) {
                AppState.user = storedUser;
                console.log('Using stored user data as fallback:', AppState.user);
            } else {
                auth.logout();
                return;
            }
        }

        // Load courses
        try {
            const coursesData = await auth.apiRequest('/courses');
            AppState.courses = coursesData.courses || [];
            console.log('Courses loaded:', AppState.courses.length);
        } catch (error) {
            console.error('Failed to load courses:', error);
            AppState.courses = [];
        }

        // Load leaderboard
        try {
            const leaderboardData = await auth.apiRequest('/leaderboard');
            AppState.leaderboard = leaderboardData.leaderboard || [];
            console.log('Leaderboard loaded:', AppState.leaderboard.length);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            AppState.leaderboard = [];
        }

        // Initialize achievements
        AppState.achievements = [
            {
                id: 'starter',
                name: 'Starter',
                description: 'Complete your first lesson',
                icon: 'fa-rocket',
                unlocked: AppState.user && AppState.user.achievements ? AppState.user.achievements.some(a => a.achievementId === 'starter') : false,
                points: 50
            },
            {
                id: 'fast-learner',
                name: 'Fast Learner',
                description: 'Complete 5 lessons in one day',
                icon: 'fa-bolt',
                unlocked: AppState.user && AppState.user.achievements ? AppState.user.achievements.some(a => a.achievementId === 'fast-learner') : false,
                points: 100
            },
            {
                id: 'dedicated',
                name: 'Dedicated',
                description: 'Maintain a 7-day streak',
                icon: 'fa-fire',
                unlocked: AppState.user && AppState.user.achievements ? AppState.user.achievements.some(a => a.achievementId === 'dedicated') : false,
                points: 150
            },
            {
                id: 'master',
                name: 'Master',
                description: 'Complete 5 courses',
                icon: 'fa-crown',
                unlocked: AppState.user && AppState.user.achievements ? AppState.user.achievements.some(a => a.achievementId === 'master') : false,
                points: 300
            },
            {
                id: 'perfectionist',
                name: 'Perfectionist',
                description: 'Score 100% on 10 quizzes',
                icon: 'fa-star',
                unlocked: AppState.user && AppState.user.achievements ? AppState.user.achievements.some(a => a.achievementId === 'perfectionist') : false,
                points: 200
            },
            {
                id: 'champion',
                name: 'Champion',
                description: 'Reach the top of leaderboard',
                icon: 'fa-trophy',
                unlocked: AppState.user && AppState.user.achievements ? AppState.user.achievements.some(a => a.achievementId === 'champion') : false,
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
                progress: 0,
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

        console.log('App state initialized successfully');

    } catch (error) {
        console.error('Error initializing app state:', error);
    }
}

// Update navigation points display
function updateNavPoints() {
    const navPointsEl = document.getElementById('navPoints');
    if (navPointsEl && AppState.user) {
        navPointsEl.textContent = AppState.user.points || 0;
    }
}

// Update user points
async function updateUserPoints(points) {
    try {
        const response = await auth.apiRequest('/users/points', {
            method: 'PUT',
            body: JSON.stringify({ points })
        });

        AppState.user.points = response.points;
        AppState.user.level = response.level;
        updateNavPoints();
        checkLevelUp();
        showToast(`+${points} points earned!`, 'success');
    } catch (error) {
        console.error('Error updating points:', error);
        showToast(error.message, 'error');
    }
}

// Calculate level from points
function calculateLevel(points) {
    return Math.floor(points / 1000) + 1;
}

// Check if user leveled up
function checkLevelUp() {
    if (!AppState.user) return;
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
async function checkBadgeUnlock(badgeId) {
    try {
        const badge = AppState.achievements.find(a => a.id === badgeId);
        if (badge && !badge.unlocked) {
            const response = await auth.apiRequest('/users/achievements', {
                method: 'POST',
                body: JSON.stringify({ achievementId: badgeId, points: badge.points })
            });

            if (response.unlocked) {
                badge.unlocked = true;
                showBadgeUnlock(badge);
                updateUserPoints(badge.points);
            }
        }
    } catch (error) {
        console.error('Error unlocking badge:', error);
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
        bgClass = 'bg-warning text-dark';
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

// Filter courses by category
function filterCoursesByCategory(category) {
    if (category === 'all') {
        return AppState.courses;
    }
    return AppState.courses.filter(course => course.category === category);
}

// Search courses
function searchCourses(query) {
    const lowerQuery = query.toLowerCase();
    return AppState.courses.filter(course => 
        course.title.toLowerCase().includes(lowerQuery) ||
        (course.description && course.description.toLowerCase().includes(lowerQuery)) ||
        (course.category && course.category.toLowerCase().includes(lowerQuery))
    );
}

// Get course by ID
function getCourseById(id) {
    return AppState.courses.find(course => course._id === id || course.id === id);
}

// Start course (enroll)
async function startCourse(courseId) {
    try {
        await auth.apiRequest('/users/enroll', {
            method: 'POST',
            body: JSON.stringify({ courseId })
        });
        showToast('Enrolled successfully!', 'success');
        window.location.href = `/learn.html?course=${courseId}`;
    } catch (error) {
        if (error.message && error.message.includes('already enrolled')) {
            window.location.href = `/learn.html?course=${courseId}`;
        } else {
            showToast(error.message || 'Failed to enroll', 'error');
        }
    }
}

// Complete lesson
async function completeLesson(courseId, lessonId, score, correctAnswers, totalQuestions) {
    try {
        const response = await auth.apiRequest('/users/progress', {
            method: 'PUT',
            body: JSON.stringify({ 
                courseId, 
                lessonId, 
                score, 
                correctAnswers, 
                totalQuestions 
            })
        });

        AppState.user.points = response.points;
        AppState.user.level = response.level;
        updateNavPoints();
        showToast('Lesson completed! Points earned!', 'success');

        if (score === 100) {
            checkBadgeUnlock('perfectionist');
        }

        return response;
    } catch (error) {
        console.error('Error completing lesson:', error);
        showToast(error.message || 'Failed to complete lesson', 'error');
    }
}

// Get activity data
function getActivityData() {
    return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [45, 60, 30, 75, 90, 50, 65]
    };
}

// Update leaderboard rankings
function updateLeaderboardRankings() {
    if (AppState.leaderboard && AppState.leaderboard.length > 0) {
        AppState.leaderboard.sort((a, b) => b.points - a.points);
    }
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get rank class
function getRankClass(rank) {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'default';
}

// Debounce function
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded - Initializing app');
    
    // Initialize app state if user is authenticated
    if (auth.isAuthenticated()) {
        await initializeAppState();
    }
    
    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || href === '/' + currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Add logout button click handler
    const logoutBtns = document.querySelectorAll('[data-logout]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                auth.logout();
            }
        });
    });
});

// Export functions
window.AppState = AppState;
window.updateUserPoints = updateUserPoints;
window.checkBadgeUnlock = checkBadgeUnlock;
window.showToast = showToast;
window.filterCoursesByCategory = filterCoursesByCategory;
window.searchCourses = searchCourses;
window.getCourseById = getCourseById;
window.startCourse = startCourse;
window.completeLesson = completeLesson;
window.getActivityData = getActivityData;
window.updateLeaderboardRankings = updateLeaderboardRankings;
window.formatNumber = formatNumber;
window.getRankClass = getRankClass;
window.debounce = debounce;
window.initializeAppState = initializeAppState;