// Dashboard specific functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

function initializeDashboard() {
    // Wait for AppState to be populated
    setTimeout(() => {
        updateWelcomeBanner();
        loadContinueCourses();
        loadRecentAchievements();
        loadMiniLeaderboard();
        initializeActivityChart();
        updateLevelProgress();
    }, 500);
}

// Update welcome banner with user stats
function updateWelcomeBanner() {
    const userName = document.getElementById('userName');
    const totalPoints = document.getElementById('totalPoints');
    const coursesCompleted = document.getElementById('coursesCompleted');
    const currentStreak = document.getElementById('currentStreak');
    
    if (!AppState.user) {
        console.warn('User data not available yet');
        return;
    }

    if (userName) userName.textContent = AppState.user.username || 'Learner';
    if (totalPoints) totalPoints.textContent = AppState.user.points || 0;
    if (coursesCompleted) {
        const completed = AppState.user.enrolledCourses ? 
            AppState.user.enrolledCourses.filter(c => c.completedAt).length : 0;
        coursesCompleted.textContent = completed;
    }
    if (currentStreak) currentStreak.textContent = AppState.user.streak || 0;
}

// Load courses in progress
function loadContinueCourses() {
    const container = document.getElementById('continueCoursesContainer');
    if (!container) return;
    
    if (!AppState.courses || AppState.courses.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-book-open fa-3x mb-3" style="color: var(--text-muted);"></i>
                    <h5>No courses available</h5>
                    <p style="color: var(--text-secondary);">Loading courses...</p>
                </div>
            </div>
        `;
        return;
    }

    // Filter user's enrolled courses
    const userEnrolledIds = AppState.user && AppState.user.enrolledCourses ? 
        AppState.user.enrolledCourses.map(e => e.courseId) : [];

    const inProgressCourses = AppState.courses
        .filter(c => userEnrolledIds.includes(c._id || c.id))
        .slice(0, 2);
    
    if (inProgressCourses.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-book-open fa-3x mb-3" style="color: var(--text-muted);"></i>
                    <h5>No courses in progress</h5>
                    <p style="color: var(--text-secondary);">Start a new course to begin learning!</p>
                    <a href="courses.html" class="btn btn-primary mt-3">
                        <i class="fas fa-plus me-2"></i>Browse Courses
                    </a>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = inProgressCourses.map(course => {
        const enrolledCourse = AppState.user.enrolledCourses.find(
            e => (e.courseId === course._id || e.courseId === course.id)
        );
        const progress = enrolledCourse ? enrolledCourse.progress : 0;

        return `
            <div class="col-md-6 mb-3">
                <div class="course-card" onclick="startCourse('${course._id || course.id}')">
                    <div class="course-card-image" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="course-card-body">
                        <span class="course-category">${course.category || 'course'}</span>
                        <h5>${course.title}</h5>
                        <p>${course.description}</p>
                        <div class="course-progress">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="small" style="color: var(--text-secondary);">Progress</span>
                                <span class="small fw-bold">${Math.round(progress)}%</span>
                            </div>
                            <div class="progress-bar-slim">
                                <div class="progress-bar-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        <button class="btn btn-primary w-100 mt-3">
                            <i class="fas fa-play me-2"></i>Continue Learning
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Load recent achievements
function loadRecentAchievements() {
    const container = document.getElementById('recentAchievements');
    if (!container) return;
    
    const recentAchievements = AppState.achievements.slice(0, 4);
    
    container.innerHTML = recentAchievements.map(achievement => `
        <div class="achievement-card ${achievement.unlocked ? '' : 'locked'}">
            <div class="achievement-icon">
                <i class="fas ${achievement.icon}"></i>
            </div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
            ${achievement.unlocked ? 
                `<div class="mt-2"><span class="badge bg-success">Unlocked</span></div>` :
                `<div class="mt-2"><span class="badge" style="background: var(--bg-tertiary);">${achievement.points} pts</span></div>`
            }
        </div>
    `).join('');
}

// Load mini leaderboard
function loadMiniLeaderboard() {
    const container = document.getElementById('miniLeaderboard');
    if (!container) return;
    
    if (!AppState.leaderboard || AppState.leaderboard.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">Loading leaderboard...</p>';
        return;
    }

    updateLeaderboardRankings();
    const topUsers = AppState.leaderboard.slice(0, 5);
    
    container.innerHTML = topUsers.map(user => `
        <div class="leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}">
            <div class="leaderboard-rank ${getRankClass(user.rank)}">
                ${user.rank <= 3 ? '<i class="fas fa-trophy"></i>' : user.rank}
            </div>
            <div class="leaderboard-avatar">
                ${user.avatar || user.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${user.username || user.name}</div>
                <div class="leaderboard-stats">
                    <span><i class="fas fa-star" style="color: var(--accent-warning);"></i> ${formatNumber(user.points)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize activity chart
function initializeActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    try {
        const ctx = canvas.getContext('2d');
        const activityData = getActivityData();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: activityData.labels,
                datasets: [{
                    label: 'Minutes Learned',
                    data: activityData.data,
                    borderColor: 'var(--accent-primary)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: 'var(--accent-primary)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'var(--bg-tertiary)',
                        titleColor: 'var(--text-primary)',
                        bodyColor: 'var(--text-secondary)',
                        borderColor: 'var(--border-color)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'var(--border-color)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'var(--text-muted)',
                            font: { size: 12 },
                            callback: function(value) {
                                return value + 'm';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: 'var(--text-muted)',
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Chart initialization error:', error);
    }
}

// Update level progress
function updateLevelProgress() {
    const userLevel = document.getElementById('userLevel');
    const levelProgressBar = document.getElementById('levelProgressBar');
    const currentLevelPoints = document.getElementById('currentLevelPoints');
    const nextLevelPoints = document.getElementById('nextLevelPoints');
    const pointsToNextLevel = document.getElementById('pointsToNextLevel');
    
    if (!userLevel || !AppState.user) return;
    
    const level = AppState.user.level || 1;
    const points = AppState.user.points || 0;
    const currentLevelBase = (level - 1) * 1000;
    const nextLevelBase = level * 1000;
    const progressInLevel = Math.max(0, points - currentLevelBase);
    const progressPercentage = Math.min(100, (progressInLevel / 1000) * 100);
    const remaining = Math.max(0, nextLevelBase - points);
    
    userLevel.textContent = level;
    levelProgressBar.style.width = `${progressPercentage}%`;
    currentLevelPoints.textContent = `${progressInLevel} XP`;
    nextLevelPoints.textContent = '1000 XP';
    pointsToNextLevel.textContent = remaining;
}