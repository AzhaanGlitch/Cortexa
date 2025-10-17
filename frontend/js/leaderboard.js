// Leaderboard page functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeLeaderboard();
    setupEventListeners();
});

function initializeLeaderboard() {
    updateLeaderboardRankings();
    renderPodium();
    renderLeaderboardList();
}

function setupEventListeners() {
    document.querySelectorAll('[data-period]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // In a real app, this would filter by time period
            showToast('Time period filter coming soon!', 'info');
        });
    });
}

function renderPodium() {
    const container = document.getElementById('podiumContainer');
    if (!container) return;
    
    const topThree = AppState.leaderboard.slice(0, 3);
    
    // Reorder for podium display: 2nd, 1st, 3rd
    const podiumOrder = [topThree[1], topThree[0], topThree[2]];
    const positions = ['second', 'first', 'third'];
    const ranks = ['🥈', '🥇', '🥉'];
    
    container.innerHTML = podiumOrder.map((user, index) => {
        if (!user) return '';
        
        return `
            <div class="podium-place ${positions[index]}">
                <div class="podium-avatar-large">
                    ${user.avatar}
                    <div class="podium-rank-badge">${ranks[index]}</div>
                </div>
                <div class="podium-stand">
                    <div class="podium-name">${user.name}</div>
                    <div class="podium-points">
                        <i class="fas fa-star text-warning"></i>
                        ${formatNumber(user.points)}
                    </div>
                    <div class="mt-2">
                        <span class="badge bg-primary">Level ${user.level}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderLeaderboardList() {
    const container = document.getElementById('leaderboardList');
    if (!container) return;
    
    // Skip top 3, start from rank 4
    const remainingUsers = AppState.leaderboard.slice(3);
    
    container.innerHTML = remainingUsers.map(user => `
        <div class="leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}">
            <div class="leaderboard-rank ${getRankClass(user.rank)}">
                ${user.rank}
            </div>
            <div class="leaderboard-avatar">
                ${user.avatar}
            </div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${user.name}</div>
                <div class="leaderboard-stats">
                    <span><i class="fas fa-star text-warning me-1"></i>${formatNumber(user.points)} points</span>
                    <span><i class="fas fa-layer-group text-primary me-1"></i>Level ${user.level}</span>
                </div>
            </div>
            ${user.isCurrentUser ? '<span class="badge bg-primary">You</span>' : ''}
        </div>
    `).join('');
}