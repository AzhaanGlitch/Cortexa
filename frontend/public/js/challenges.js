// Challenges page functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeChallenges();
});

function initializeChallenges() {
    updateChallengeStats();
    renderActiveChallenges();
    renderAllChallenges();
}

function updateChallengeStats() {
    document.getElementById('completedChallenges').textContent = '12';
    document.getElementById('activeChallenges').textContent = AppState.challenges.length;
    document.getElementById('bonusPoints').textContent = '450';
}

function renderActiveChallenges() {
    const container = document.getElementById('activeChallengesContainer');
    if (!container) return;
    
    const activeChallenges = AppState.challenges.filter(c => c.progress < c.total);
    
    if (activeChallenges.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-trophy fa-3x mb-3 text-muted"></i>
                    <h5>No active challenges</h5>
                    <p class="text-muted">New challenges will appear daily!</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activeChallenges.map(challenge => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="challenge-card">
                <div class="challenge-header">
                    <span class="challenge-difficulty difficulty-${challenge.difficulty}">
                        ${challenge.difficulty.toUpperCase()}
                    </span>
                    <span class="badge bg-info">
                        <i class="fas fa-clock me-1"></i>${challenge.timeLeft}
                    </span>
                </div>
                <div class="challenge-preview">
                    <div class="challenge-icon">
                        <i class="fas ${challenge.icon}"></i>
                    </div>
                    <h5 class="mt-3">${challenge.title}</h5>
                    <p class="text-muted">${challenge.description}</p>
                    <div class="challenge-progress mt-3">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="small">Progress</span>
                            <span class="small fw-bold">${challenge.progress}/${challenge.total}</span>
                        </div>
                        <div class="progress-bar-slim">
                            <div class="progress-bar-fill" style="width: ${(challenge.progress / challenge.total) * 100}%"></div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <div class="challenge-reward">
                            <i class="fas fa-star text-warning"></i>
                            <strong>${challenge.points}</strong> pts
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="startChallenge(${challenge.id})">
                            <i class="fas fa-play me-1"></i>Start
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAllChallenges() {
    const container = document.getElementById('allChallengesContainer');
    if (!container) return;
    
    // Generate more challenges for variety
    const allChallenges = [
        ...AppState.challenges,
        {
            id: 4,
            title: 'Code Warrior',
            description: 'Solve 10 coding problems',
            difficulty: 'hard',
            progress: 0,
            total: 10,
            points: 500,
            icon: 'fa-code',
            timeLeft: 'Weekly'
        },
        {
            id: 5,
            title: 'Quiz Master',
            description: 'Score 90%+ on 5 quizzes',
            difficulty: 'medium',
            progress: 0,
            total: 5,
            points: 250,
            icon: 'fa-question-circle',
            timeLeft: 'Weekly'
        },
        {
            id: 6,
            title: 'Consistent Learner',
            description: 'Study for 30 minutes every day',
            difficulty: 'easy',
            progress: 0,
            total: 7,
            points: 150,
            icon: 'fa-calendar-check',
            timeLeft: 'Weekly'
        }
    ];
    
    container.innerHTML = allChallenges.map(challenge => {
        const isCompleted = challenge.progress >= challenge.total;
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="challenge-card ${isCompleted ? 'completed' : ''}">
                    <div class="challenge-header">
                        <span class="challenge-difficulty difficulty-${challenge.difficulty}">
                            ${challenge.difficulty.toUpperCase()}
                        </span>
                        ${isCompleted ? 
                            '<span class="badge bg-success"><i class="fas fa-check me-1"></i>Completed</span>' :
                            `<span class="badge bg-info"><i class="fas fa-clock me-1"></i>${challenge.timeLeft}</span>`
                        }
                    </div>
                    <div class="challenge-preview">
                        <div class="challenge-icon">
                            <i class="fas ${challenge.icon}"></i>
                        </div>
                        <h5 class="mt-3">${challenge.title}</h5>
                        <p class="text-muted">${challenge.description}</p>
                        ${!isCompleted ? `
                            <div class="challenge-progress mt-3">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="small">Progress</span>
                                    <span class="small fw-bold">${challenge.progress}/${challenge.total}</span>
                                </div>
                                <div class="progress-bar-slim">
                                    <div class="progress-bar-fill" style="width: ${(challenge.progress / challenge.total) * 100}%"></div>
                                </div>
                            </div>
                        ` : ''}
                        <div class="d-flex justify-content-between align-items-center mt-4">
                            <div class="challenge-reward">
                                <i class="fas fa-star text-warning"></i>
                                <strong>${challenge.points}</strong> pts
                            </div>
                            ${!isCompleted ? 
                                `<button class="btn btn-primary btn-sm" onclick="startChallenge(${challenge.id})">
                                    <i class="fas fa-play me-1"></i>${challenge.progress > 0 ? 'Continue' : 'Start'}
                                </button>` :
                                '<span class="badge bg-success px-3 py-2">Done!</span>'
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function startChallenge(challengeId) {
    showToast('Challenge starting soon! 🎯', 'info');
    // In a real app, this would navigate to the challenge
}

// Add additional CSS for challenge cards
const style = document.createElement('style');
style.textContent = `
    .stat-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 2rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        transition: all 0.3s ease;
        height: 100%;
    }
    
    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .stat-icon {
        width: 70px;
        height: 70px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        flex-shrink: 0;
    }
    
    .stat-icon.orange {
        background: linear-gradient(135deg, var(--accent-orange), #ff8c5a);
    }
    
    .stat-icon.blue {
        background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    }
    
    .stat-icon.purple {
        background: linear-gradient(135deg, var(--accent-purple), #a78bfa);
    }
    
    .stat-content {
        flex: 1;
    }
    
    .stat-value {
        font-size: 2.5rem;
        font-weight: 800;
        line-height: 1;
        margin-bottom: 0.5rem;
    }
    
    .stat-label {
        font-size: 1rem;
        color: var(--text-secondary);
    }
    
    .challenge-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .challenge-reward {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
    }
    
    .challenge-card.completed {
        opacity: 0.7;
    }
    
    .challenge-card.completed .challenge-icon {
        background: var(--bg-tertiary);
    }
`;
document.head.appendChild(style);

window.startChallenge = startChallenge;