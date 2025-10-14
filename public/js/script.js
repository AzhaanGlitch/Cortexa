// Game State
const gameState = {
    userPoints: 0,
    completedLessons: 0,
    totalLessons: 10,
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    badges: {
        starter: { unlocked: false, name: 'Starter', icon: 'fa-rocket', threshold: 50 },
        achiever: { unlocked: false, name: 'Achiever', icon: 'fa-trophy', threshold: 150 },
        master: { unlocked: false, name: 'Master', icon: 'fa-crown', threshold: 300 },
        champion: { unlocked: false, name: 'Champion', icon: 'fa-medal', threshold: 500 }
    }
};

// Quiz Questions
const quizQuestions = [
    {
        question: "What is the correct syntax to declare a variable in JavaScript?",
        options: ["var x = 5;", "variable x = 5;", "v x = 5;", "x := 5;"],
        correct: 0
    },
    {
        question: "Which of the following is NOT a JavaScript data type?",
        options: ["String", "Boolean", "Float", "Undefined"],
        correct: 2
    },
    {
        question: "What does the '===' operator do in JavaScript?",
        options: ["Assigns a value", "Compares values without type checking", "Compares values with type checking", "Creates a new variable"],
        correct: 2
    },
    {
        question: "Which method is used to add an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correct: 0
    },
    {
        question: "What is the output of: console.log(typeof null)?",
        options: ["null", "undefined", "object", "number"],
        correct: 2
    }
];

// Leaderboard Data
const leaderboardData = [
    { name: "Alex Thunder", points: 1250 },
    { name: "Max Steel", points: 1180 },
    { name: "Jake Warrior", points: 1095 },
    { name: "Ryan Phoenix", points: 980 },
    { name: "Chris Titan", points: 875 },
    { name: "Sam Velocity", points: 750 },
    { name: "You", points: 0 }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeLeaderboard();
    loadQuestion();
    updateProgressDisplay();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('nextBtn').addEventListener('click', handleNextQuestion);
    document.getElementById('prevBtn').addEventListener('click', handlePrevQuestion);
    document.getElementById('continueBtn').addEventListener('click', closeSuccessModal);
    
    // Option selection
    const options = document.querySelectorAll('.option-item');
    options.forEach((option, index) => {
        option.addEventListener('click', () => selectOption(index));
    });
}

// Load Question
function loadQuestion() {
    const question = quizQuestions[gameState.currentQuestionIndex];
    
    document.getElementById('currentQuestion').textContent = gameState.currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    document.getElementById('questionText').textContent = question.question;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        optionDiv.innerHTML = `
            <input type="radio" name="answer" id="option${index}" value="${index}">
            <label for="option${index}">${option}</label>
        `;
        optionDiv.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionDiv);
    });
    
    // Restore previous answer if exists
    if (gameState.answers[gameState.currentQuestionIndex] !== undefined) {
        selectOption(gameState.answers[gameState.currentQuestionIndex], false);
    }
    
    updateNavigationButtons();
}

// Select Option
function selectOption(index, saveAnswer = true) {
    const options = document.querySelectorAll('.option-item');
    options.forEach(opt => opt.classList.remove('selected'));
    options[index].classList.add('selected');
    
    const radio = document.getElementById(`option${index}`);
    radio.checked = true;
    
    if (saveAnswer) {
        gameState.answers[gameState.currentQuestionIndex] = index;
    }
}

// Handle Next Question
function handleNextQuestion() {
    const selectedAnswer = gameState.answers[gameState.currentQuestionIndex];
    
    if (selectedAnswer === undefined) {
        showToast('Please select an answer!');
        return;
    }
    
    // Check if answer is correct
    const question = quizQuestions[gameState.currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;
    
    // Show feedback
    const options = document.querySelectorAll('.option-item');
    if (isCorrect) {
        options[selectedAnswer].classList.add('correct');
        gameState.score++;
        showToast('Correct! +10 points', true);
        gameState.userPoints += 10;
        updateUserPoints();
    } else {
        options[selectedAnswer].classList.add('incorrect');
        options[question.correct].classList.add('correct');
        showToast('Incorrect. Try the next one!');
    }
    
    // Move to next question or finish quiz
    setTimeout(() => {
        if (gameState.currentQuestionIndex < quizQuestions.length - 1) {
            gameState.currentQuestionIndex++;
            loadQuestion();
        } else {
            finishQuiz();
        }
    }, 1500);
}

// Handle Previous Question
function handlePrevQuestion() {
    if (gameState.currentQuestionIndex > 0) {
        gameState.currentQuestionIndex--;
        loadQuestion();
    }
}

// Update Navigation Buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = gameState.currentQuestionIndex === 0;
    
    if (gameState.currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.innerHTML = 'Submit<i class="fas fa-check ms-2"></i>';
    } else {
        nextBtn.innerHTML = 'Next<i class="fas fa-arrow-right ms-2"></i>';
    }
}

// Finish Quiz
function finishQuiz() {
    const pointsEarned = gameState.score * 10;
    gameState.completedLessons++;
    
    // Update progress
    updateProgress();
    
    // Check for new badges
    const newBadge = checkForNewBadges();
    
    // Show success modal
    showSuccessModal(pointsEarned, newBadge);
    
    // Update leaderboard
    updateLeaderboard();
}

// Show Success Modal
function showSuccessModal(points, newBadge) {
    document.getElementById('pointsEarned').textContent = points;
    
    const newBadgeContainer = document.getElementById('newBadgeContainer');
    if (newBadge) {
        const badgeShowcase = document.getElementById('badgeShowcase');
        const badgeNameShowcase = document.getElementById('badgeNameShowcase');
        
        badgeShowcase.innerHTML = `<i class="fas ${newBadge.icon}"></i>`;
        badgeNameShowcase.textContent = newBadge.name;
        newBadgeContainer.style.display = 'block';
    } else {
        newBadgeContainer.style.display = 'none';
    }
    
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// Close Success Modal
function closeSuccessModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('successModal'));
    modal.hide();
    
    // Reset quiz
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.answers = [];
    loadQuestion();
}

// Update Progress
function updateProgress() {
    const percentage = (gameState.completedLessons / gameState.totalLessons) * 100;
    
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressPercent').textContent = Math.round(percentage) + '%';
    document.getElementById('completedLessons').textContent = gameState.completedLessons;
}

// Update Progress Display
function updateProgressDisplay() {
    document.getElementById('totalLessons').textContent = gameState.totalLessons;
    document.getElementById('completedLessons').textContent = gameState.completedLessons;
}

// Update User Points
function updateUserPoints() {
    document.getElementById('userPoints').textContent = gameState.userPoints;
}

// Check for New Badges
function checkForNewBadges() {
    let newBadge = null;
    
    for (const [key, badge] of Object.entries(gameState.badges)) {
        if (!badge.unlocked && gameState.userPoints >= badge.threshold) {
            badge.unlocked = true;
            unlockBadge(key);
            newBadge = badge;
            break;
        }
    }
    
    return newBadge;
}

// Unlock Badge
function unlockBadge(badgeKey) {
    const badgeElement = document.querySelector(`[data-badge="${badgeKey}"]`);
    if (badgeElement) {
        badgeElement.classList.remove('locked');
        badgeElement.classList.add('unlocked');
    }
}

// Initialize Leaderboard
function initializeLeaderboard() {
    updateLeaderboard();
}

// Update Leaderboard
function updateLeaderboard() {
    // Update user's points in leaderboard data
    const userIndex = leaderboardData.findIndex(user => user.name === 'You');
    if (userIndex !== -1) {
        leaderboardData[userIndex].points = gameState.userPoints;
    }
    
    // Sort by points
    leaderboardData.sort((a, b) => b.points - a.points);
    
    // Display leaderboard
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    
    leaderboardData.forEach((user, index) => {
        const rank = index + 1;
        let rankClass = 'default';
        
        if (rank === 1) rankClass = 'gold';
        else if (rank === 2) rankClass = 'silver';
        else if (rank === 3) rankClass = 'bronze';
        
        const isCurrentUser = user.name === 'You';
        
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        if (isCurrentUser) {
            item.style.background = 'rgba(37, 99, 235, 0.15)';
            item.style.border = '2px solid rgba(37, 99, 235, 0.5)';
        }
        
        item.innerHTML = `
            <div class="leaderboard-rank ${rankClass}">
                ${rank <= 3 ? '<i class="fas fa-trophy"></i>' : rank}
            </div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${user.name}</div>
                <div class="leaderboard-points">
                    <i class="fas fa-star text-warning"></i> ${user.points} points
                </div>
            </div>
        `;
        
        leaderboardList.appendChild(item);
    });
}

// Show Toast Notification
function showToast(message, isSuccess = false) {
    const toastEl = document.getElementById('successToast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.innerHTML = `<i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-info-circle'} me-2"></i>${message}`;
    
    if (!isSuccess) {
        toastEl.style.background = 'linear-gradient(135deg, #f97316, #ea580c)';
    } else {
        toastEl.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}