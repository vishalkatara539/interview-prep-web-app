const API_URL = 'http://localhost:3000/api';

// Check authentication localStorage.getItem
const token =('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user) {
  window.location.href = '/';
}

// Display user info
document.getElementById('user-name').textContent = user.username;
document.getElementById('user-email').textContent = user.email;
document.getElementById('welcome-name').textContent = user.username;
document.getElementById('user-avatar').textContent = user.username.charAt(0).toUpperCase();

// Show admin link if admin
if (user.role === 'admin') {
  document.getElementById('admin-link').style.display = 'flex';
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
});

// Category icons
const categoryIcons = {
  'JavaScript': '🟨',
  'React': '⚛️',
  'Node.js': '🟢',
  'HTML/CSS': '🎨',
  'SQL': '🗃️',
  'General Programming': '💻'
};

// Load categories
async function loadCategories() {
  try {
    const response = await fetch(`${API_URL}/quiz/categories`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to load categories');
    
    const categories = await response.json();
    const grid = document.getElementById('category-grid');
    grid.innerHTML = '';

    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.dataset.category = cat.category;
      card.innerHTML = `
        <div class="category-icon">${categoryIcons[cat.category] || '📚'}</div>
        <h3>${cat.category}</h3>
        <p>${cat.question_count} questions</p>
        <div class="category-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
          <div class="progress-text">
            <span>Not started</span>
            <span>0%</span>
          </div>
        </div>
      `;
      
      card.addEventListener('click', () => {
        window.location.href = `/quiz?category=${encodeURIComponent(cat.category)}`;
      });
      
      grid.appendChild(card);
    });

    // Load progress after categories
    loadProgress();
  } catch (error) {
    console.error(error);
  }
}

// Load user progress
async function loadProgress() {
  try {
    const response = await fetch(`${API_URL}/user/progress`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to load progress');
    
    const data = await response.json();
    
    // Update stats
    document.getElementById('total-quizzes').textContent = data.overall?.total_quizzes || 0;
    document.getElementById('total-correct').textContent = data.overall?.total_correct || 0;
    document.getElementById('avg-percentage').textContent = Math.round(data.overall?.average_percentage || 0) + '%';
    
    let bestScore = 0;
    data.progress?.forEach(p => {
      if (p.bestScore > bestScore) bestScore = p.bestScore;
    });
    document.getElementById('best-score').textContent = bestScore;

    // Update category cards with progress
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
      const category = card.dataset.category;
      const progress = data.progress?.find(p => p.category === category);
      
      if (progress) {
        const progressFill = card.querySelector('.progress-fill');
        const progressText = card.querySelector('.progress-text');
        
        progressFill.style.width = progress.bestPercentage + '%';
        progressText.innerHTML = `
          <span>${progress.attempts} attempt${progress.attempts > 1 ? 's' : ''}</span>
          <span>${progress.bestPercentage}%</span>
        `;
      }
    });
  } catch (error) {
    console.error(error);
  }
}

// Load history
async function loadHistory() {
  try {
    const response = await fetch(`${API_URL}/user/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to load history');
    
    const history = await response.json();
    const list = document.getElementById('history-list');
    
    if (history.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📜</div>
          <h3>No quiz history yet</h3>
          <p>Take your first quiz to see your progress here!</p>
        </div>
      `;
      return;
    }
    
    list.innerHTML = history.map(h => {
      const percentage = Math.round((h.score / h.total_questions) * 100);
      let scoreClass = 'needs-work';
      if (percentage >= 80) scoreClass = 'excellent';
      else if (percentage >= 60) scoreClass = 'good';
      
      return `
        <div class="history-item">
          <div>
            <div class="history-category">${h.quiz_category}</div>
            <div class="history-date">${new Date(h.completed_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
          </div>
          <div class="history-score ${scoreClass}">${h.score}/${h.total_questions}</div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error(error);
  }
}

// Toggle history section
document.getElementById('history-link').addEventListener('click', (e) => {
  e.preventDefault();
  const historySection = document.getElementById('history-section');
  const dashboardContent = document.querySelector('.stats-grid, .section-title');
  
  if (historySection.classList.contains('hidden')) {
    historySection.classList.remove('hidden');
    loadHistory();
    document.getElementById('history-link').classList.add('active');
  } else {
    historySection.classList.add('hidden');
    document.getElementById('history-link').classList.remove('active');
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
loadCategories();
