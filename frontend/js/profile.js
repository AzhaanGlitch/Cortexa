// Profile page functionality

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeProfile();
    }, 300);
});

function initializeProfile() {
    if (!AppState.user) {
        console.warn('User data not available');
        return;
    }

    updateProfileHeader();
    renderAchievements();
    renderProfileCourses();
    updateSidebarLevel();
    renderRecentActivity();
}

function updateProfileHeader() {
    document.getElementById('profileName').textContent = AppState.user.username || 'Learner';
    document.getElementById('profileLevel').textContent = AppState.user.level || 1;
    document.getElementById('profilePoints').textContent = formatNumber(AppState.user.points || 0);
    document.getElementById('profileStreak').textContent = AppState.user.streak || 0;
    
    const completed = AppState.user.enrolledCourses ? 
        AppState.user.enrolledCourses.filter(c => c.completedAt).length : 0;
    document.getElementById('profileCourses').textContent = completed;
    
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
    const level = AppState.user.level || 1;
    const title = titles[Math.min(level, 7)] || 'Scholar';
    document.getElementById('profileTitle').textContent = `Level ${level} ${title}`;
}

function renderAchievements() {
    const container = document.getElementById('profileAchievements');
    if (!container) return;
    
    const unlockedCount = AppState.achievements.filter(a => a.unlocked).length;
    const countEl = document.getElementById('achievementCount');
    if (countEl) {
        countEl.textContent = `${unlockedCount}/${AppState.achievements.length}`;
    }
    
    container.innerHTML = AppState.achievements.map(achievement => `
        <div class="achievement-card ${achievement.unlocked ? '' : 'locked'}">
            <div class="achievement-icon">
                <i class="fas ${achievement.icon}"></i>
            </div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
            ${achievement.unlocked ? 
                '<div class="mt-2"><span class="badge bg-success"><i class="fas fa-check me-1"></i>Unlocked</span></div>' :
                `<div class="mt-2"><span class="badge" style="background: var(--bg-tertiary);">${achievement.points} pts</span></div>`
            }
        </div>
    `).join('');
}

function renderProfileCourses() {
    const container = document.getElementById('profileCoursesList');
    if (!container) return;
    
    if (!AppState.user.enrolledCourses || AppState.user.enrolledCourses.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-book-open fa-3x mb-3" style="color: var(--text-muted);"></i>
                <p style="color: var(--text-secondary);">No courses enrolled yet</p>
                <a href="courses.html" class="btn btn-primary">Browse Courses</a>
            </div>
        `;
        return;
    }
    
    const enrolledCourses = AppState.user.enrolledCourses
        .map(ec => ({
            ...ec,
            courseData: AppState.courses.find(c => c._id === ec.courseId || c.id === ec.courseId)
        }))
        .filter(ec => ec.courseData);
    
    if (enrolledCourses.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-book-open fa-3x mb-3" style="color: var(--text-muted);"></i>
                <p style="color: var(--text-secondary);">No courses found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = enrolledCourses.map(course => `
        <div class="course-progress-item mb-3">
            <div class="d-flex align-items-center mb-2">
                <div class="course-icon-small me-3" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
                    <i class="fas fa-book"></i>
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1">${course.courseData.title}</h6>
                    <div class="small" style="color: var(--text-muted);">${course.courseData.lessons ? course.courseData.lessons.length : 0} lessons • ${course.courseData.level}</div>
                </div>
                <div>
                    ${course.completedAt ? 
                        '<span class="badge bg-success"><i class="fas fa-check me-1"></i>Completed</span>' :
                        `<span class="badge" style="background: var(--accent-warning); color: #000;">${Math.round(course.progress)}%</span>`
                    }
                </div>
            </div>
            ${!course.completedAt ? `
                <div class="progress-bar-slim">
                    <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function updateSidebarLevel() {
    if (!AppState.user) return;

    const level = AppState.user.level || 1;
    const points = AppState.user.points || 0;
    const currentLevelBase = (level - 1) * 1000;
    const progressInLevel = Math.max(0, points - currentLevelBase);
    const progressPercentage = Math.min(100, (progressInLevel / 1000) * 100);
    const remaining = Math.max(0, (level * 1000) - points);
    
    const levelEl = document.getElementById('sidebarLevel');
    const progressEl = document.getElementById('sidebarLevelProgress');
    const pointsEl = document.getElementById('sidebarPointsToNext');

    if (levelEl) levelEl.textContent = level;
    if (progressEl) progressEl.style.width = `${progressPercentage}%`;
    if (pointsEl) pointsEl.textContent = remaining;
}

function renderRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    // Simulated recent activity
    const activities = [
        {
            text: 'Joined CORTEXA',
            time: 'Today',
            icon: 'fa-rocket',
            color: 'var(--accent-primary)'
        },
        {
            text: 'Profile created',
            time: 'Today',
            icon: 'fa-user-check',
            color: 'var(--accent-success)'
        }
    ];

    // Add course activities if user has enrolled courses
    if (AppState.user.enrolledCourses && AppState.user.enrolledCourses.length > 0) {
        activities.unshift({
            text: `Enrolled in ${AppState.user.enrolledCourses.length} course(s)`,
            time: 'Recently',
            icon: 'fa-play-circle',
            color: 'var(--accent-primary)'
        });
    }
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="d-flex align-items-center mb-1">
                <i class="fas ${activity.icon} me-2" style="color: ${activity.color}"></i>
                <div class="flex-grow-1">
                    <div class="small">${activity.text}</div>
                </div>
            </div>
            <div class="activity-time" style="color: var(--text-muted);">${activity.time}</div>
        </div>
    `).join('');
}

// Add CSS for course progress item
const style = document.createElement('style');
style.textContent = `
    .course-progress-item {
        background: var(--bg-tertiary);
        padding: 1.25rem;
        border-radius: 10px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }
    
    .course-progress-item:hover {
        border-color: var(--accent-primary);
        transform: translateX(4px);
    }
    
    .course-icon-small {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }

    .activity-item {
        padding: 1rem 0;
        border-bottom: 1px solid var(--border-color);
    }

    .activity-item:last-child {
        border-bottom: none;
    }

    .activity-time {
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style);