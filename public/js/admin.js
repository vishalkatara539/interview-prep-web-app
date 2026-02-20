const API_URL = 'http://localhost:3000/api';

// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user || user.role !== 'admin') {
  window.location.href = '/';
}

// Display user info
document.getElementById('user-name').textContent = user.username;
document.getElementById('user-avatar').textContent = user.username.charAt(0).toUpperCase();

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
});

// Tab switching
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
    
    tab.classList.add('active');
    document.getElementById(`${tabName}-panel`).classList.remove('hidden');

    // Load data for the tab
    if (tabName === 'users') loadUsers();
    else if (tabName === 'questions') loadQuestions();
    else if (tabName === 'progress') loadAllProgress();
  });
});

// Load users
async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load users');

    const users = await response.json();
    const tbody = document.getElementById('users-table');

    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No users found</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td><span class="badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}">${u.role}</span></td>
        <td>${u.quizzes_taken || 0}</td>
        <td>${Math.round(u.avg_percentage || 0)}%</td>
        <td>
          ${u.role !== 'admin' ? `<button class="btn btn-danger btn-sm" onclick="resetUserProgress(${u.id})">Reset</button>` : '-'}
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error(error);
    document.getElementById('users-table').innerHTML = `<tr><td colspan="7">Error loading users</td></tr>`;
  }
}

// Reset user progress
async function resetUserProgress(userId) {
  if (!confirm('Are you sure you want to reset this user\'s progress? This cannot be undone.')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/admin/user/${userId}/progress`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to reset progress');

    alert('User progress reset successfully');
    loadUsers();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Load questions
async function loadQuestions() {
  try {
    const response = await fetch(`${API_URL}/admin/questions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load questions');

    const questions = await response.json();
    const tbody = document.getElementById('questions-table');

    if (questions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No questions found</td></tr>';
      return;
    }

    const letters = ['A', 'B', 'C', 'D'];

    tbody.innerHTML = questions.map(q => `
      <tr>
        <td>${q.id}</td>
        <td>${q.category}</td>
        <td>${q.question.substring(0, 50)}${q.question.length > 50 ? '...' : ''}</td>
        <td>${letters[q.correct_answer]}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="editQuestion(${q.id}, '${q.category}', '${q.question.replace(/'/g, "\\'")}', ${JSON.stringify(q.options).replace(/"/g, '"')}, ${q.correct_answer})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteQuestion(${q.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error(error);
    document.getElementById('questions-table').innerHTML = `<tr><td colspan="5">Error loading questions</td></tr>`;
  }
}

// Load all progress
async function loadAllProgress() {
  try {
    const response = await fetch(`${API_URL}/admin/progress`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load progress');

    const progress = await response.json();
    const tbody = document.getElementById('progress-table');

    if (progress.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No progress data found</td></tr>';
      return;
    }

    tbody.innerHTML = progress.map(p => `
      <tr>
        <td>${p.username}</td>
        <td>${p.quiz_category}</td>
        <td>${p.score}/${p.total_questions}</td>
        <td><span class="badge badge-score">${p.percentage}%</span></td>
        <td>${new Date(p.completed_at).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error(error);
    document.getElementById('progress-table').innerHTML = `<tr><td colspan="5">Error loading progress</td></tr>`;
  }
}

// Modal handling
const modal = document.getElementById('question-modal');
const modalTitle = document.getElementById('modal-title');
const questionForm = document.getElementById('question-form');

document.getElementById('add-question-btn').addEventListener('click', () => {
  modalTitle.textContent = 'Add Question';
  document.getElementById('question-id').value = '';
  questionForm.reset();
  modal.classList.add('show');
});

document.getElementById('close-modal').addEventListener('click', () => {
  modal.classList.remove('show');
});

document.getElementById('cancel-modal').addEventListener('click', () => {
  modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

// Edit question
function editQuestion(id, category, question, options, correctAnswer) {
  modalTitle.textContent = 'Edit Question';
  document.getElementById('question-id').value = id;
  document.getElementById('question-category').value = category;
  document.getElementById('question-text').value = question;
  document.getElementById('option-0').value = options[0];
  document.getElementById('option-1').value = options[1];
  document.getElementById('option-2').value = options[2];
  document.getElementById('option-3').value = options[3];
  document.getElementById('correct-answer').value = correctAnswer;
  modal.classList.add('show');
}

// Delete question
async function deleteQuestion(id) {
  if (!confirm('Are you sure you want to delete this question?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/admin/questions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to delete question');

    alert('Question deleted successfully');
    loadQuestions();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Save question
document.getElementById('save-question').addEventListener('click', async () => {
  const id = document.getElementById('question-id').value;
  const category = document.getElementById('question-category').value;
  const question = document.getElementById('question-text').value;
  const options = [
    document.getElementById('option-0').value,
    document.getElementById('option-1').value,
    document.getElementById('option-2').value,
    document.getElementById('option-3').value
  ];
  const correct_answer = parseInt(document.getElementById('correct-answer').value);

  if (!category || !question || options.some(o => !o)) {
    alert('Please fill all fields');
    return;
  }

  try {
    const url = id ? `${API_URL}/admin/questions/${id}` : `${API_URL}/admin/questions`;
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category, question, options, correct_answer })
    });

    if (!response.ok) throw new Error('Failed to save question');

    alert('Question saved successfully');
    modal.classList.remove('show');
    loadQuestions();
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

// Mobile menu toggle
const menuToggle = document.createElement('div');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '☰';
document.body.appendChild(menuToggle);

menuToggle.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// Initialize
loadUsers();
