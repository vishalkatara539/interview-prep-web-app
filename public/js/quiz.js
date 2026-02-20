const API_URL = 'http://localhost:3000/api';

// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user) {
  window.location.href = '/';
}

// Get category from URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');

if (!category) {
  window.location.href = '/dashboard';
}

document.getElementById('quiz-category').textContent = category;

// Quiz state
let questions = [];
let currentQuestion = 0;
let answers = [];
let timer = 30;
let timerInterval;

// Load questions
async function loadQuestions() {
  try {
    const response = await fetch(`${API_URL}/quiz/${encodeURIComponent(category)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load questions');

    questions = await response.json();
    
    if (questions.length === 0) {
      showNoQuestions();
      return;
    }

    document.getElementById('total-q').textContent = questions.length;
    showQuestion();
  } catch (error) {
    console.error(error);
    document.getElementById('quiz-card').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❌</div>
        <h3>Error loading questions</h3>
        <p>${error.message}</p>
        <button class="btn btn-primary" onclick="window.location.href='/dashboard'">Go Back</button>
      </div>
    `;
  }
}

function showNoQuestions() {
  document.getElementById('quiz-card').innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📚</div>
      <h3>No questions available</h3>
      <p>There are no questions in this category yet.</p>
      <button class="btn btn-primary" onclick="window.location.href='/dashboard'">Go Back</button>
    </div>
  `;
}

function showQuestion() {
  const q = questions[currentQuestion];
  const card = document.getElementById('quiz-card');
  
  document.getElementById('current-q').textContent = currentQuestion + 1;

  const letters = ['A', 'B', 'C', 'D'];

  card.innerHTML = `
    <div class="question-number">Question ${currentQuestion + 1}</div>
    <div class="question-text">${q.question}</div>
    <div class="options-list">
      ${q.options.map((opt, i) => `
        <div class="option-item" data-index="${i}">
          <span class="option-letter">${letters[i]}</span>
          <span class="option-text">${opt}</span>
        </div>
      `).join('')}
    </div>
    <div class="quiz-actions">
      ${currentQuestion > 0 ? `<button class="btn btn-secondary" id="prev-btn">Previous</button>` : '<div></div>'}
      <button class="btn btn-primary" id="next-btn">${currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}</button>
    </div>
  `;

  // Add click handlers for options
  document.querySelectorAll('.option-item').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  // Restore previous answer if exists
  const prevAnswer = answers.find(a => a.questionId === q.id);
  if (prevAnswer) {
    const opt = document.querySelector(`.option-item[data-index="${prevAnswer.selectedAnswer}"]`);
    if (opt) opt.classList.add('selected');
  }

  // Next button
  document.getElementById('next-btn').addEventListener('click', handleNext);

  // Previous button
  const prevBtn = document.getElementById('prev-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      saveAnswer();
      currentQuestion--;
      showQuestion();
    });
  }

  // Start timer
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 30;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timer--;
    updateTimerDisplay();

    if (timer <= 0) {
      clearInterval(timerInterval);
      // Auto-select next question without answer
      saveAnswer();
      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion();
      } else {
        submitQuiz();
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerEl = document.getElementById('timer');
  timerEl.textContent = timer;
  
  timerEl.classList.remove('warning', 'danger');
  if (timer <= 10) {
    timerEl.classList.add('danger');
  } else if (timer <= 15) {
    timerEl.classList.add('warning');
  }
}

function saveAnswer() {
  const selected = document.querySelector('.option-item.selected');
  const q = questions[currentQuestion];
  
  // Remove previous answer for this question
  answers = answers.filter(a => a.questionId !== q.id);
  
  if (selected) {
    answers.push({
      questionId: q.id,
      selectedAnswer: parseInt(selected.dataset.index)
    });
  }
}

function handleNext() {
  saveAnswer();
  
  if (currentQuestion === questions.length - 1) {
    // Check if all questions answered
    if (answers.length < questions.length) {
      const confirmed = confirm('You have not answered all questions. Are you sure you want to submit?');
      if (!confirmed) return;
    }
    submitQuiz();
  } else {
    currentQuestion++;
    showQuestion();
  }
}

async function submitQuiz() {
  clearInterval(timerInterval);

  try {
    const response = await fetch(`${API_URL}/quiz/${encodeURIComponent(category)}/submit`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers })
    });

    if (!response.ok) throw new Error('Failed to submit quiz');

    const result = await response.json();
    showResult(result);
  } catch (error) {
    console.error(error);
    alert('Error submitting quiz: ' + error.message);
  }
}

function showResult(result) {
  const card = document.getElementById('quiz-card');
  let iconClass = 'needs-work';
  let icon = '📚';
  let label = 'Keep Practicing!';

  if (result.percentage >= 80) {
    iconClass = 'success';
    icon = '🎉';
    label = 'Excellent Work!';
  } else if (result.percentage >= 60) {
    iconClass = 'good';
    icon = '👍';
    label = 'Good Job!';
  }

  card.innerHTML = `
    <div class="quiz-result">
      <div class="result-icon ${iconClass}">${icon}</div>
      <div class="result-score">${result.percentage}%</div>
      <div class="result-label">${label}</div>
      <div class="result-stats">
        <div class="result-stat">
          <div class="result-stat-value">${result.score}</div>
          <div class="result-stat-label">Correct</div>
        </div>
        <div class="result-stat">
          <div class="result-stat-value">${result.total}</div>
          <div class="result-stat-label">Total</div>
        </div>
      </div>
      <button class="btn btn-primary" onclick="window.location.href='/dashboard'">Back to Dashboard</button>
      <button class="btn btn-secondary" onclick="retakeQuiz()" style="margin-top: 12px;">Try Again</button>
    </div>
  `;

  // Hide timer
  document.querySelector('.quiz-timer').style.display = 'none';
}

function retakeQuiz() {
  currentQuestion = 0;
  answers = [];
  questions = [];
  document.querySelector('.quiz-timer').style.display = 'flex';
  loadQuestions();
}

// Initialize
loadQuestions();
