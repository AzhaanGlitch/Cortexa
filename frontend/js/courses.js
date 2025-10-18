// Courses page functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeCoursesPage();
    setupEventListeners();
});

function initializeCoursesPage() {
    setTimeout(() => {
        loadAndRenderCourses();
    }, 300);
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchCourses');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            loadAndRenderCourses();
        }, 300));
    }

    // Category filters
    document.querySelectorAll('[data-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadAndRenderCourses();
        });
    });

    // Status filters
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadAndRenderCourses();
        });
    });
}

function loadAndRenderCourses() {
    const container = document.getElementById('coursesGrid');
    if (!container) return;

    if (!AppState.courses || AppState.courses.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-book fa-3x mb-3" style="color: var(--text-muted);"></i>
                    <h5>Loading courses...</h5>
                </div>
            </div>
        `;
        return;
    }

    // Get filters
    const searchQuery = document.getElementById('searchCourses') ? 
        document.getElementById('searchCourses').value : '';
    const selectedCategory = document.querySelector('[data-category].active') ? 
        document.querySelector('[data-category].active').getAttribute('data-category') : 'all';
    const selectedFilter = document.querySelector('[data-filter].active') ? 
        document.querySelector('[data-filter].active').getAttribute('data-filter') : 'all';

    // Filter courses
    let filtered = AppState.courses;

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
        filtered = filtered.filter(c => c.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(c => 
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        );
    }

    // Status filter
    if (selectedFilter && selectedFilter !== 'all') {
        if (selectedFilter === 'in-progress') {
            const enrolledIds = AppState.user && AppState.user.enrolledCourses ? 
                AppState.user.enrolledCourses.map(e => e.courseId) : [];
            filtered = filtered.filter(c => 
                enrolledIds.includes(c._id || c.id)
            );
        } else if (selectedFilter === 'completed') {
            const completedIds = AppState.user && AppState.user.enrolledCourses ? 
                AppState.user.enrolledCourses
                    .filter(e => e.completedAt)
                    .map(e => e.courseId) : [];
            filtered = filtered.filter(c => 
                completedIds.includes(c._id || c.id)
            );
        } else if (selectedFilter === 'new') {
            const enrolledIds = AppState.user && AppState.user.enrolledCourses ? 
                AppState.user.enrolledCourses.map(e => e.courseId) : [];
            filtered = filtered.filter(c => 
                !enrolledIds.includes(c._id || c.id)
            );
        }
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-search fa-3x mb-3" style="color: var(--text-muted);"></i>
                    <h5>No courses found</h5>
                    <p style="color: var(--text-secondary);">Try adjusting your filters</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(course => {
        const enrolledCourse = AppState.user && AppState.user.enrolledCourses ? 
            AppState.user.enrolledCourses.find(e => e.courseId === course._id || e.courseId === course.id) : null;
        const progress = enrolledCourse ? enrolledCourse.progress : 0;
        const isCompleted = enrolledCourse && enrolledCourse.completedAt;

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="course-card" onclick="openCourseModal('${course._id || course.id}')">
                    <div class="course-card-image" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));">
                        <i class="fas fa-book"></i>
                        ${enrolledCourse ? 
                            `<span class="course-status-badge" style="background: ${isCompleted ? 'var(--accent-success)' : 'var(--accent-warning)'}; color: ${isCompleted ? '#fff' : '#000'};">
                                ${isCompleted ? 'Completed' : 'In Progress'}
                            </span>` : ''}
                    </div>
                    <div class="course-card-body">
                        <span class="course-category">${course.category}</span>
                        <h5>${course.title}</h5>
                        <p>${course.description}</p>
                        <div class="course-meta">
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${course.duration}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-signal"></i>
                                <span>${course.level}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-book"></i>
                                <span>${course.lessons ? course.lessons.length : 0}</span>
                            </div>
                        </div>
                        ${enrolledCourse && !isCompleted ? 
                            `<div class="course-progress">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="small" style="color: var(--text-secondary);">Progress</span>
                                    <span class="small fw-bold">${Math.round(progress)}%</span>
                                </div>
                                <div class="progress-bar-slim">
                                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                                </div>
                            </div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openCourseModal(courseId) {
    const course = AppState.courses.find(c => c._id === courseId || c.id === courseId);
    if (!course) return;

    document.getElementById('modalCourseTitle').textContent = course.title;
    document.getElementById('modalCourseDescription').textContent = course.description;
    document.getElementById('modalCourseDuration').textContent = course.duration;
    document.getElementById('modalCourseLevel').textContent = course.level;
    document.getElementById('modalCourseLessons').textContent = course.lessons ? course.lessons.length : 0;
    document.getElementById('modalCoursePoints').textContent = course.points;
    document.getElementById('modalCourseEnrolled').textContent = course.enrolledCount || 0;

    const objectivesList = document.getElementById('modalCourseObjectives');
    objectivesList.innerHTML = (course.objectives || []).map(obj => 
        `<li>${obj}</li>`
    ).join('');

    const curriculumList = document.getElementById('modalCourseCurriculum');
    curriculumList.innerHTML = (course.lessons || []).map((lesson, idx) => 
        `<div class="curriculum-item">
            <i class="fas fa-play-circle"></i>
            <div>
                <strong>Lesson ${idx + 1}: ${lesson.title}</strong>
                <div class="small" style="color: var(--text-secondary);">${lesson.duration}</div>
            </div>
        </div>`
    ).join('');

    const startBtn = document.getElementById('startCourseBtn');
    startBtn.onclick = () => startCourse(courseId);

    const modal = new bootstrap.Modal(document.getElementById('courseModal'));
    modal.show();
}

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