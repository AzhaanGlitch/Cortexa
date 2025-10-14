// Profile page functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeProfile();
});

function initializeProfile() {
    updateProfileHeader();
    renderAchievements();
    renderProfileCourses();
    updateSidebarLevel();
    renderRecentActivity();
}

function updateProfileHeader() {
    document.getElementById('profileName').textContent = AppState.user.name;
    document.getElementById('profileLevel').textContent = AppState.user.level;
    document.getElementById('profilePoints').textContent = formatNumber(AppState.user.points);
    document.getElementById('profileStreak').textContent = AppState.user.streak;
    document.getElementById('profileCourses').textContent = AppState.user.coursesCompleted;
    
    // Update title based on level
    const titles = {
        1: 'Beginner',
        2: 'Apprentice',
        3: 'Scholar',
        4: 'Expert',
        5: 'Master',
        6: 'Grandmaster',
        7: 'Legend'
    };
    const title = titles[Math.min(AppState.user.level, 7)] || 'Scholar';
    document.getElementById('profileTitle').textContent = `Level ${AppState.user.level} ${title}`;
}

function renderAchievements() {
    const container = document.getElementById('profileAchievements');
    if (!container) return;
    
    const unlockedCount = AppState.achievements.filter(a => a.unlocked).length;
    document.getElementById('achievementCount').textContent = `${unlockedCount}/${AppState.achievements.length}`;
    
    container.innerHTML = AppState.achievements.map(achievement => `
        <div class="achievement-card ${achievement.unlocked ? '' : 'locked'}">
            <div class="achievement-icon">
                <i class="fas ${achievement.icon}"></i>
            </div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
            ${achievement.unlocked ? 
                '<div class="mt-2"><span class="badge bg-success"><i class="fas fa-check me-1"></i>Unlocked</span></div>' :
                `<div class="mt-2"><span class="badge bg-secondary">${achievement.points} pts</span></div>`
            }
        </div>
    `).join('');
}

function renderProfileCourses() {
    const container = document.getElementById('profileCoursesList');
    if (!container) return;
    
    const enrolledCourses = AppState.courses.filter(c => c.status !== 'new');
    
    if (enrolledCourses.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-book-open fa-3x mb-3 text-muted"></i>
                <p class="text-muted">No courses enrolled yet</p>
                <a href="courses.html" class="btn btn-primary">Browse Courses</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = enrolledCourses.map(course => `
        <div class="course-progress-item mb-3">
            <div class="d-flex align-items-center mb-2">
                <div class="course-icon-small me-3" style="background: ${course.color}">
                    <i class="fas ${course.icon}"></i>
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1">${course.title}</h6>
                    <div class="small text-muted">${course.lessons} lessons • ${course.level}</div>
                </div>
                <div>
                    ${course.status === 'completed' ? 
                        '<span class="badge bg-success"><i class="fas fa-check me-1"></i>Completed</span>' :
                        `<span class="badge bg-warning">${Math.round(course.progress)}%</span>`
                    }
                </div>
            </div>
            ${course.status !== 'completed' ? `
                <div class="progress-bar-slim">
                    <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function updateSidebarLevel() {
    const level = AppState.user.level;
    const points = AppState.user.points;
    const currentLevelBase = (level - 1) * 1000;
    const progressInLevel = points - currentLevelBase;
    const progressPercentage = (progressInLevel / 1000) * 100;
    const remaining = (level * 1000) - points;
    
    document.getElementById('sidebarLevel').textContent = level;
    document.getElementById('sidebarLevelProgress').style.width = `${progressPercentage}%`;
    document.getElementById('sidebarPointsToNext').textContent = remaining;
}

function renderRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    // Simulated recent activity
    const activities = [
        {
            text: 'Completed JavaScript Fundamentals',
            time: '2 hours ago',
            icon: 'fa-check-circle',
            color: 'var(--accent-green)'
        },
        {
            text: 'Earned "Fast Learner" badge',
            time: '5 hours ago',
            icon: 'fa-trophy',
            color: 'var(--accent-orange)'
        },
        {
            text: 'Started Data Science course',
            time: '1 day ago',
            icon: 'fa-play-circle',
            color: 'var(--accent-blue)'
        },
        {
            text: 'Reached Level 3',
            time: '2 days ago',
            icon: 'fa-level-up-alt',
            color: 'var(--accent-purple)'
        }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="d-flex align-items-center mb-1">
                <i class="fas ${activity.icon} me-2" style="color: ${activity.color}"></i>
                <div class="flex-grow-1">
                    <div class="small">${activity.text}</div>
                </div>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

// Add CSS for course progress item
const style = document.createElement('style');
style.textContent = `
    .course-progress-item {
        background: var(--bg-tertiary);
        padding: 1.25rem;
        border-radius: 12px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }
    
    .course-progress-item:hover {
        border-color: var(--accent-blue);
        transform: translateX(5px);
    }
    
    .course-icon-small {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }
`;
document.head.appendChild(style);