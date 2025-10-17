// Dashboard specific functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

function initializeDashboard() {
    updateWelcomeBanner();
    loadContinueCourses();
    loadRecentAchievements();
    loadMiniLeaderboard();
    initializeActivityChart();
    updateLevelProgress();
}

// Update welcome banner with user stats
function updateWelcomeBanner() {
    const userName = document.getElementById('userName');
    const totalPoints = document.getElementById('totalPoints');
    const coursesCompleted = document.getElementById('coursesCompleted');
    const currentStreak = document.getElementById('currentStreak');
    
    if (userName) userName.textContent = AppState.user.name;
    if (totalPoints) totalPoints.textContent = formatNumber(AppState.user.points);
    if (coursesCompleted) coursesCompleted.textContent = AppState.user.coursesCompleted;
    if (currentStreak) currentStreak.textContent = AppState.user.streak;
}

// Load courses in progress
function loadContinueCourses() {
    const container = document.getElementById('continueCoursesContainer');
    if (!container) return;
    
    const inProgressCourses = AppState.courses.filter(c => c.status === 'in-progress').slice(0, 2);
    
    if (inProgressCourses.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-book-open fa-3x mb-3 text-muted"></i>
                    <h5>No courses in progress</h5>
                    <p class="text-muted">Start a new course to begin learning!</p>
                    <a href="courses.html" class="btn btn-primary mt-3">
                        <i class="fas fa-plus me-2"></i>Browse Courses
                    </a>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = inProgressCourses.map(course => `
        <div class="col-md-6 mb-3">
            <div class="course-card" onclick="startCourse(${course.id})">
                <div class="course-card-image" style="background: ${course.color}; height: 150px;">
                    <i class="fas ${course.icon}"></i>
                </div>
                <div class="course-card-body">
                    <span class="course-category">${course.category}</span>
                    <h5>${course.title}</h5>
                    <p>${course.description}</p>
                    <div class="course-progress">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="small text-muted">Progress</span>
                            <span class="small fw-bold">${Math.round(course.progress)}%</span>
                        </div>
                        <div class="progress-bar-slim">
                            <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
                        </div>
                    </div>
                    <button class="btn btn-primary w-100 mt-3">
                        <i class="fas fa-play me-2"></i>Continue Learning
                    </button>
                </div>
            </div>
        </div>
    `).join('');
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
                `<div class="mt-2"><span class="badge bg-secondary">${achievement.points} pts</span></div>`
            }
        </div>
    `).join('');
}

// Load mini leaderboard
function loadMiniLeaderboard() {
    const container = document.getElementById('miniLeaderboard');
    if (!container) return;
    
    updateLeaderboardRankings();
    const topUsers = AppState.leaderboard.slice(0, 5);
    
    container.innerHTML = topUsers.map(user => `
        <div class="leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}">
            <div class="leaderboard-rank ${getRankClass(user.rank)}">
                ${user.rank <= 3 ? '<i class="fas fa-trophy"></i>' : user.rank}
            </div>
            <div class="leaderboard-avatar">
                ${user.avatar}
            </div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${user.name}</div>
                <div class="leaderboard-stats">
                    <span><i class="fas fa-star text-warning"></i> ${formatNumber(user.points)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize activity chart
function initializeActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const activityData = getActivityData();
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: activityData.labels,
            datasets: [{
                label: 'Minutes Learned',
                data: activityData.data,
                borderColor: '#0066ff',
                backgroundColor: 'rgba(0, 102, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#0066ff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 8
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
                    backgroundColor: '#1e2339',
                    titleColor: '#fff',
                    bodyColor: '#a0aec0',
                    borderColor: '#2d3748',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} minutes`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#2d3748',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#a0aec0',
                        font: {
                            size: 12
                        },
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
                        color: '#a0aec0',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Update level progress
function updateLevelProgress() {
    const userLevel = document.getElementById('userLevel');
    const levelProgressBar = document.getElementById('levelProgressBar');
    const currentLevelPoints = document.getElementById('currentLevelPoints');
    const nextLevelPoints = document.getElementById('nextLevelPoints');
    const pointsToNextLevel = document.getElementById('pointsToNextLevel');
    
    if (!userLevel) return;
    
    const level = AppState.user.level;
    const points = AppState.user.points;
    const currentLevelBase = (level - 1) * 1000;
    const nextLevelBase = level * 1000;
    const progressInLevel = points - currentLevelBase;
    const progressPercentage = (progressInLevel / 1000) * 100;
    const remaining = nextLevelBase - points;
    
    userLevel.textContent = level;
    levelProgressBar.style.width = `${progressPercentage}%`;
    currentLevelPoints.textContent = `${progressInLevel} XP`;
    nextLevelPoints.textContent = '1000 XP';
    pointsToNextLevel.textContent = remaining;
}