// Learning page functionality

const quizState = {
    currentQuestionIndex: 0,
    selectedAnswers: [],
    correctAnswers: 0,
    pointsEarned: 0,
    questions: [
        {
            question: "What is the correct syntax to declare a variable in JavaScript?",
            options: [
                "var x = 5;",
                "variable x = 5;",
                "v x = 5;",
                "x := 5;"
            ],
            correct: 0
        },
        {
            question: "Which method is used to add an element to the end of an array?",
            options: [
                "push()",
                "pop()",
                "shift()",
                "unshift()"
            ],
            correct: 0
        },
        {
            question: "What does the '===' operator do in JavaScript?",
            options: [
                "Assigns a value",
                "Compares values without type checking",
                "Compares values with type checking",
                "Creates a new variable"
            ],
            correct: 2
        },
        {
            question: "Which of the following is NOT a JavaScript data type?",
            options: [
                "String",
                "Boolean",
                "Float",
                "Undefined"
            ],
            correct: 2
        },
        {
            question: "What is the output of: console.log(typeof null)?",
            options: [
                "null",
                "undefined",
                "object",
                "number"
            ],
            correct: 2
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    initializeLearning();
    setupEventListeners();
});

function initializeLearning() {
    // Get course ID from URL if provided
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    
    if (courseId) {
        const course = getCourseById(parseInt(courseId));
        if (course) {
            document.getElementById('courseTitle').textContent = course.title;
        }
    }
    
    renderQuestion();
    updateProgress();
}

function setupEventListeners() {
    document.getElementById('nextQuestionBtn').addEventListener('click', handleNextQuestion);
    document.getElementById('prevQuestionBtn').addEventListener('click', handlePrevQuestion);
}

function renderQuestion() {
    const question = quizState.questions[quizState.currentQuestionIndex];
    
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestionNum').textContent = quizState.currentQuestionIndex + 1;
    document.getElementById('totalQuestionsNum').textContent = quizState.questions.length;
    
    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = question.options.map((option, index) => {
        const isSelected = quizState.selectedAnswers[quizState.currentQuestionIndex] === index;
        return `
            <div class="option-card ${isSelected ? 'selected' : ''}" onclick="selectOption(${index})">
                <div class="option-radio"></div>
                <div class="option-text">${option}</div>
            </div>
        `;
    }).join('');
    
    updateNavigationButtons();
    updateProgress();
}

function selectOption(index) {
    quizState.selectedAnswers[quizState.currentQuestionIndex] = index;
    renderQuestion();
}

function handleNextQuestion() {
    const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestionIndex];
    
    if (selectedAnswer === undefined) {
        showToast('Please select an answer!', 'warning');
        return;
    }
    
    const question = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;
    
    // Show feedback
    const options = document.querySelectorAll('.option-card');
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (isCorrect) {
        options[selectedAnswer].classList.add('correct');
        quizState.correctAnswers++;
        const pointsForQuestion = 10;
        quizState.pointsEarned += pointsForQuestion;
        showToast('Correct! +' + pointsForQuestion + ' points', 'success');
    } else {
        options[selectedAnswer].classList.add('incorrect');
        options[question.correct].classList.add('correct');
        showToast('Incorrect. The correct answer is shown in green.', 'error');
    }
    
    document.getElementById('quizPoints').textContent = quizState.pointsEarned;
    
    // Move to next question or finish
    setTimeout(() => {
        options.forEach(opt => opt.style.pointerEvents = 'auto');
        
        if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
            quizState.currentQuestionIndex++;
            renderQuestion();
        } else {
            finishQuiz();
        }
    }, 2000);
}

function handlePrevQuestion() {
    if (quizState.currentQuestionIndex > 0) {
        quizState.currentQuestionIndex--;
        renderQuestion();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    prevBtn.disabled = quizState.currentQuestionIndex === 0;
    
    if (quizState.currentQuestionIndex === quizState.questions.length - 1) {
        nextBtn.innerHTML = 'Submit<i class="fas fa-check ms-2"></i>';
    } else {
        nextBtn.innerHTML = 'Next<i class="fas fa-arrow-right ms-2"></i>';
    }
}

function updateProgress() {
    const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
    document.getElementById('lessonProgressBar').style.width = progress + '%';
}

function finishQuiz() {
    const score = (quizState.correctAnswers / quizState.questions.length) * 100;
    
    // Update modal
    document.getElementById('finalScore').textContent = Math.round(score) + '%';
    document.getElementById('finalPoints').textContent = '+' + quizState.pointsEarned;
    document.getElementById('finalCorrect').textContent = quizState.correctAnswers + '/' + quizState.questions.length;
    
    // Update app state
    updateUserPoints(quizState.pointsEarned);
    
    // Check for badges
    if (score === 100) {
        checkBadgeUnlock('perfectionist');
    }
    
    // Complete lesson in course
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    if (courseId) {
        completeLesson(parseInt(courseId), 1);
    }
    
    // Show completion modal
    const modal = new bootstrap.Modal(document.getElementById('completionModal'));
    modal.show();
}

function retryQuiz() {
    // Reset quiz state
    quizState.currentQuestionIndex = 0;
    quizState.selectedAnswers = [];
    quizState.correctAnswers = 0;
    quizState.pointsEarned = 0;
    
    document.getElementById('quizPoints').textContent = '0';
    
    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('completionModal'));
    modal.hide();
    
    // Render first question
    renderQuestion();
}

// Additional CSS for learning page
const style = document.createElement('style');
style.textContent = `
    .learning-header {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 2rem;
    }
    
    .lesson-progress-bar {
        height: 8px;
        background: var(--bg-tertiary);
        border-radius: 10px;
        overflow: hidden;
    }
    
    .lesson-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
        border-radius: 10px;
        transition: width 0.5s ease;
    }
    
    .question-footer {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .completion-icon {
        animation: scaleIn 0.6s ease;
    }
    
    @keyframes scaleIn {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .completion-stat {
        background: var(--bg-tertiary);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid var(--border-color);
    }
    
    .completion-stat .stat-value {
        font-size: 2rem;
        font-weight: 800;
        color: var(--accent-cyan);
        margin-bottom: 0.5rem;
    }
    
    .completion-stat .stat-label {
        font-size: 0.95rem;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);

// Make functions available globally
window.selectOption = selectOption;
window.retryQuiz = retryQuiz;