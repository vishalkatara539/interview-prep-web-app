const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Simple file-based database
const DB_FILE = 'database.json';

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (e) {}
  return { users: [], questions: [], results: [] };
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let db = loadDB();

// Seed questions if empty
if (db.questions.length === 0) {
  db.questions = [
    { id: 1, category: 'JavaScript', question: 'What is the output of typeof null?', options: ['null', 'undefined', 'object', 'string'], correct_answer: 2 },
    { id: 2, category: 'JavaScript', question: 'Which method creates a new array with all elements that pass a test?', options: ['map()', 'filter()', 'reduce()', 'forEach()'], correct_answer: 1 },
    { id: 3, category: 'JavaScript', question: 'What is the correct way to declare a constant in JavaScript?', options: ['var x = 5', 'let x = 5', 'const x = 5', 'constant x = 5'], correct_answer: 2 },
    { id: 4, category: 'JavaScript', question: 'What does === compare?', options: ['Value only', 'Type only', 'Value and type', 'Reference'], correct_answer: 2 },
    { id: 5, category: 'JavaScript', question: 'Which is NOT a JavaScript data type?', options: ['undefined', 'boolean', 'float', 'string'], correct_answer: 2 },
    { id: 6, category: 'JavaScript', question: 'What is a closure?', options: ['A function with variables', 'A function that returns another function', 'A function that has access to outer scope variables', 'An anonymous function'], correct_answer: 2 },
    { id: 7, category: 'JavaScript', question: 'Which method removes the last element from an array?', options: ['shift()', 'pop()', 'slice()', 'splice()'], correct_answer: 1 },
    { id: 8, category: 'JavaScript', question: 'What is Promise.all() used for?', options: ['Execute promises sequentially', 'Execute promises in parallel and wait for all', 'Handle errors', 'Cancel promises'], correct_answer: 1 },
    { id: 9, category: 'JavaScript', question: 'What is event bubbling?', options: ['Events go from parent to child', 'Events go from child to parent', 'Events stay in same element', 'Events cancel each other'], correct_answer: 1 },
    { id: 10, category: 'JavaScript', question: 'Which statement about hoisting is true?', options: ['Only var is hoisted', 'Function declarations are hoisted', 'let is fully hoisted', 'const is fully hoisted'], correct_answer: 1 },
    { id: 11, category: 'React', question: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extra', 'JavaScript Extra'], correct_answer: 0 },
    { id: 12, category: 'React', question: 'Which hook is used for side effects?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correct_answer: 1 },
    { id: 13, category: 'React', question: 'What is the virtual DOM?', options: ['A copy of real DOM', 'A JavaScript representation of DOM', 'A browser feature', 'A database'], correct_answer: 1 },
    { id: 14, category: 'React', question: 'How do you pass data to a child component?', options: ['state', 'props', 'context', 'hooks'], correct_answer: 1 },
    { id: 15, category: 'React', question: 'What is useState used for?', options: ['Side effects', 'Managing state', 'Routing', 'HTTP requests'], correct_answer: 1 },
    { id: 16, category: 'React', question: 'Which method is called first in React component lifecycle?', options: ['componentDidMount', 'render', 'constructor', 'componentWillMount'], correct_answer: 2 },
    { id: 17, category: 'React', question: 'What is Redux used for?', options: ['Routing', 'State management', 'Database', 'Styling'], correct_answer: 1 },
    { id: 18, category: 'React', question: 'What is the purpose of key prop?', options: ['Styling', 'Identification for reconciliation', 'Events', 'State'], correct_answer: 1 },
    { id: 19, category: 'React', question: 'Which is NOT a React hook rule?', options: ['Call at top level', 'Only in React functions', 'Can be conditional', 'Same order every render'], correct_answer: 2 },
    { id: 20, category: 'React', question: 'What is server-side rendering in Next.js?', options: ['Client renders', 'Server renders pages', 'No JavaScript', 'Static generation'], correct_answer: 1 },
    { id: 21, category: 'Node.js', question: 'What is Node.js?', options: ['A programming language', 'A runtime environment', 'A database', 'A framework'], correct_answer: 1 },
    { id: 22, category: 'Node.js', question: 'Which module is used for file system operations?', options: ['http', 'fs', 'path', 'url'], correct_answer: 1 },
    { id: 23, category: 'Node.js', question: 'What is Express.js?', options: ['Database', 'Template engine', 'Web framework', 'Testing tool'], correct_answer: 2 },
    { id: 24, category: 'Node.js', question: 'How do you export a module in Node.js?', options: ['module.export', 'module.exports', 'export module', 'exports'], correct_answer: 1 },
    { id: 25, category: 'Node.js', question: 'What is middleware?', options: ['Database software', 'Functions between request and response', 'Security tool', 'Template engine'], correct_answer: 1 },
    { id: 26, category: 'Node.js', question: 'Which is NOT a Node.js global object?', options: ['global', 'process', 'window', 'Buffer'], correct_answer: 2 },
    { id: 27, category: 'Node.js', question: 'What is npm?', options: ['Node Package Manager', 'New Program Manager', 'Node Project Manager', 'Network Package'], correct_answer: 0 },
    { id: 28, category: 'Node.js', question: 'What does req.params contain?', options: ['Query strings', 'URL parameters', 'Request body', 'Headers'], correct_answer: 1 },
    { id: 29, category: 'Node.js', question: 'What is streams in Node.js?', options: ['Data type', 'Way to handle streaming data', 'Debugging tool', 'Testing framework'], correct_answer: 1 },
    { id: 30, category: 'Node.js', question: 'What is callback hell?', options: ['Error handling', 'Nested callbacks', 'Memory issue', 'Security flaw'], correct_answer: 1 },
    { id: 31, category: 'HTML/CSS', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language'], correct_answer: 0 },
    { id: 32, category: 'HTML/CSS', question: 'Which CSS property changes text color?', options: ['text-color', 'font-color', 'color', 'foreground'], correct_answer: 2 },
    { id: 33, category: 'HTML/CSS', question: 'What is the correct HTML element for the largest heading?', options: ['<heading>', '<h6>', '<h1>', '<head>'], correct_answer: 2 },
    { id: 34, category: 'HTML/CSS', question: 'Which CSS display property makes elements inline?', options: ['block', 'inline', 'flex', 'grid'], correct_answer: 1 },
    { id: 35, category: 'HTML/CSS', question: 'What is Flexbox used for?', options: ['Database', '1D layout', '3D graphics', 'Animation'], correct_answer: 1 },
    { id: 36, category: 'HTML/CSS', question: 'Which selector has highest specificity?', options: ['Element', 'Class', 'ID', 'Universal'], correct_answer: 2 },
    { id: 37, category: 'HTML/CSS', question: 'What does CSS box-sizing: border-box do?', options: ['Adds border outside', 'Includes padding/border in width', 'Removes borders', 'Adds shadow'], correct_answer: 1 },
    { id: 38, category: 'HTML/CSS', question: 'What is a pseudo-class?', options: ['A class in JS', 'A state of an element', 'A CSS framework', 'A selector type'], correct_answer: 1 },
    { id: 39, category: 'HTML/CSS', question: 'Which is semantic HTML element?', options: ['<div>', '<span>', '<article>', '<b>'], correct_answer: 2 },
    { id: 40, category: 'HTML/CSS', question: 'What is CSS Grid?', options: ['Table layout', '2D layout system', 'Animation library', 'Color scheme'], correct_answer: 1 },
    { id: 41, category: 'SQL', question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query List'], correct_answer: 0 },
    { id: 42, category: 'SQL', question: 'Which command is used to extract data?', options: ['EXTRACT', 'SELECT', 'GET', 'FIND'], correct_answer: 1 },
    { id: 43, category: 'SQL', question: 'What is PRIMARY KEY?', options: ['Unique identifier', 'First column', 'Foreign reference', 'Index only'], correct_answer: 0 },
    { id: 44, category: 'SQL', question: 'Which JOIN returns matching rows?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER'], correct_answer: 2 },
    { id: 45, category: 'SQL', question: 'What does WHERE clause do?', options: ['Filters records', 'Sorts data', 'Groups data', 'Joins tables'], correct_answer: 0 },
    { id: 46, category: 'SQL', question: 'What is a foreign key?', options: ['Primary key in another table', 'Unique key', 'Index', 'Constraint only'], correct_answer: 0 },
    { id: 47, category: 'SQL', question: 'Which aggregates NULL values?', options: ['COUNT', 'SUM', 'AVG', 'All of above'], correct_answer: 3 },
    { id: 48, category: 'SQL', question: 'What does GROUP BY do?', options: ['Sorts results', 'Groups rows', 'Filters data', 'Joins tables'], correct_answer: 1 },
    { id: 49, category: 'SQL', question: 'What is a subquery?', options: ['Main query', 'Query within query', 'Join type', 'Index'], correct_answer: 1 },
    { id: 50, category: 'SQL', question: 'Which normal form removes transitive dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], correct_answer: 2 },
    { id: 51, category: 'General Programming', question: 'What is an algorithm?', options: ['A programming language', 'Step-by-step procedure', 'A software', 'A database'], correct_answer: 1 },
    { id: 52, category: 'General Programming', question: 'What is time complexity?', options: ['Memory used', 'Execution time relative to input', 'Code length', 'Number of variables'], correct_answer: 1 },
    { id: 53, category: 'General Programming', question: 'What is OOP?', options: ['Object-Oriented Programming', 'Online Programming', 'Optimized Operations', 'Open-source Protocol'], correct_answer: 0 },
    { id: 54, category: 'General Programming', question: 'What is a class in OOP?', options: ['An object', 'Blueprint for objects', 'A function', 'A variable'], correct_answer: 1 },
    { id: 55, category: 'General Programming', question: 'What is inheritance?', options: ['Copying code', 'Child class gets parent properties', 'Hiding data', 'Encrypting'], correct_answer: 1 },
    { id: 56, category: 'General Programming', question: 'What is encapsulation?', options: ['Hiding complexity', 'Bundling data and methods', 'Inheritance', 'Polymorphism'], correct_answer: 1 },
    { id: 57, category: 'General Programming', question: 'What is polymorphism?', options: ['Many forms', 'Single inheritance', 'Data hiding', 'Code reuse'], correct_answer: 0 },
    { id: 58, category: 'General Programming', question: 'What is recursion?', options: ['Loop', 'Function calling itself', 'Condition', 'Variable'], correct_answer: 1 },
    { id: 59, category: 'General Programming', question: 'What is Big O notation?', options: ['Data type', 'Performance analysis', 'Algorithm name', 'Programming language'], correct_answer: 1 },
    { id: 60, category: 'General Programming', question: 'What is a data structure?', options: ['Algorithm', 'Organization of data', 'Programming language', 'Output format'], correct_answer: 1 }
  ];
  
// Create admin user
  db.users.push({
    id: 1,
    username: 'admin',
    email: 'admin@interviewprep.com',
    password: hashPassword('admin123'),
    role: 'admin',
    created_at: new Date().toISOString()
  });
  
  // Create test user
  db.users.push({
    id: 2,
    username: 'user',
    email: 'user@test.com',
    password: hashPassword('user123'),
    role: 'user',
    created_at: new Date().toISOString()
  });
  
  saveDB(db);
}

// Simple password hashing
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// Simple JWT
function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', 'secret').update(header + '.' + payloadB64).digest('base64url');
  return header + '.' + payloadB64 + '.' + signature;
}

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const signature = crypto.createHmac('sha256', 'secret').update(parts[0] + '.' + parts[1]).digest('base64url');
    if (signature !== parts[2]) return null;
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString());
  } catch (e) {
    return null;
  }
}

const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function jsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json', 
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.split(' ')[1]);
}

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  const method = req.method;
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API routes
  if (url.startsWith('/api/')) {
    const path = url.replace('/api/', '');
    
    // Auth routes
    if (path === 'auth/register' && method === 'POST') {
      const { username, email, password } = await parseBody(req);
      if (!username || !email || !password) {
        return jsonResponse(res, 400, { error: 'All fields are required' });
      }
      if (db.users.find(u => u.email === email || u.username === username)) {
        return jsonResponse(res, 400, { error: 'Email or username already exists' });
      }
      const newUser = {
        id: db.users.length + 1,
        username,
        email,
        password: hashPassword(password),
        role: 'user',
        created_at: new Date().toISOString()
      };
      db.users.push(newUser);
      saveDB(db);
      const token = createToken({ id: newUser.id, username: newUser.username, role: newUser.role });
      return jsonResponse(res, 200, { token, user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role } });
    }
    
    if (path === 'auth/login' && method === 'POST') {
      const { email, password } = await parseBody(req);
      const user = db.users.find(u => u.email === email || u.username === email);
      if (!user || !verifyPassword(password, user.password)) {
        return jsonResponse(res, 400, { error: 'Invalid credentials' });
      }
      const token = createToken({ id: user.id, username: user.username, role: user.role });
      return jsonResponse(res, 200, { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    }
    
    if (path === 'auth/me' && method === 'GET') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      const u = db.users.find(u => u.id === user.id);
      if (!u) return jsonResponse(res, 404, { error: 'User not found' });
      return jsonResponse(res, 200, { id: u.id, username: u.username, email: u.email, role: u.role, created_at: u.created_at });
    }
    
    // Quiz routes
    if (path === 'quiz/categories' && method === 'GET') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      const categories = {};
      db.questions.forEach(q => {
        if (!categories[q.category]) categories[q.category] = 0;
        categories[q.category]++;
      });
      const result = Object.entries(categories).map(([category, question_count]) => ({ category, question_count }));
      return jsonResponse(res, 200, result);
    }
    
    if (path.startsWith('quiz/') && path.endsWith('/submit') && method === 'POST') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      const category = decodeURIComponent(path.split('/')[1]);
      const { answers } = await parseBody(req);
      const catQuestions = db.questions.filter(q => q.category === category);
      let score = 0;
      const answerMap = {};
      answers.forEach(a => answerMap[a.questionId] = a.selectedAnswer);
      catQuestions.forEach(q => {
        if (answerMap[q.id] === q.correct_answer) score++;
      });
      const result = {
        id: db.results.length + 1,
        user_id: user.id,
        quiz_category: category,
        score,
        total_questions: catQuestions.length,
        completed_at: new Date().toISOString()
      };
      db.results.push(result);
      saveDB(db);
      return jsonResponse(res, 200, { score, total: catQuestions.length, percentage: Math.round((score / catQuestions.length) * 100) });
    }
    
    // Get questions for a category
    if (path.startsWith('quiz/') && !path.includes('/submit') && method === 'GET') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      const category = decodeURIComponent(path.split('/')[1]);
      const catQuestions = db.questions.filter(q => q.category === category);
      const shuffled = catQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
      const result = shuffled.map(q => ({ id: q.id, category: q.category, question: q.question, options: q.options }));
      return jsonResponse(res, 200, result);
    }
    
    // User progress
    if (path === 'user/progress' && method === 'GET') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      const userResults = db.results.filter(r => r.user_id === user.id);
      const categories = [...new Set(userResults.map(r => r.quiz_category))];
      const progress = categories.map(cat => {
        const catResults = userResults.filter(r => r.quiz_category === cat);
        const bestScore = Math.max(...catResults.map(r => r.score));
        const bestPercentage = Math.max(...catResults.map(r => Math.round((r.score / r.total_questions) * 100)));
        return { category: cat, attempts: catResults.length, bestScore, bestPercentage };
      });
      const totalQuizzes = userResults.length;
      const totalCorrect = userResults.reduce((sum, r) => sum + r.score, 0);
      const totalQuestions = userResults.reduce((sum, r) => sum + r.total_questions, 0);
      const averagePercentage = totalQuizzes > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      return jsonResponse(res, 200, { progress, overall: { total_quizzes: totalQuizzes, total_correct: totalCorrect, total_questions: totalQuestions, average_percentage: averagePercentage } });
    }
    
    if (path === 'user/history' && method === 'GET') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      const history = db.results.filter(r => r.user_id === user.id).sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at)).slice(0, 20);
      return jsonResponse(res, 200, history);
    }
    
    // Admin routes
    if (path === 'admin/users' && method === 'GET') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      if (user.role !== 'admin') return jsonResponse(res, 403, { error: 'Admin access required' });
      const users = db.users.map(u => {
        const userResults = db.results.filter(r => r.user_id === u.id);
        const quizzesTaken = userResults.length;
        const avgPercentage = quizzesTaken > 0 ? Math.round(userResults.reduce((sum, r) => sum + (r.score / r.total_questions) * 100, 0) / quizzesTaken) : 0;
        return { id: u.id, username: u.username, email: u.email, role: u.role, created_at: u.created_at, quizzes_taken: quizzesTaken, avg_percentage: avgPercentage };
      });
      return jsonResponse(res, 200, users);
    }
    
    if (path === 'admin/questions' && method === 'GET') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      if (user.role !== 'admin') return jsonResponse(res, 403, { error: 'Admin access required' });
      return jsonResponse(res, 200, db.questions);
    }
    
    if (path === 'admin/questions' && method === 'POST') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      if (user.role !== 'admin') return jsonResponse(res, 403, { error: 'Admin access required' });
      const { category, question, options, correct_answer } = await parseBody(req);
      const newQuestion = { id: db.questions.length + 1, category, question, options, correct_answer };
      db.questions.push(newQuestion);
      saveDB(db);
      return jsonResponse(res, 200, { id: newQuestion.id, message: 'Question added successfully' });
    }
    
    if (path.startsWith('admin/questions/') && method === 'PUT') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      if (user.role !== 'admin') return jsonResponse(res, 403, { error: 'Admin access required' });
      const id = parseInt(path.split('/')[2]);
      const { category, question, options, correct_answer } = await parseBody(req);
      const idx = db.questions.findIndex(q => q.id === id);
      if (idx >= 0) {
        db.questions[idx] = { ...db.questions[idx], category, question, options, correct_answer };
        saveDB(db);
      }
      return jsonResponse(res, 200, { message: 'Question updated successfully' });
    }
    
    if (path.startsWith('admin/questions/') && method === 'DELETE') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      if (user.role !== 'admin') return jsonResponse(res, 403, { error: 'Admin access required' });
      const id = parseInt(path.split('/')[2]);
      db.questions = db.questions.filter(q => q.id !== id);
      saveDB(db);
      return jsonResponse(res, 200, { message: 'Question deleted successfully' });
    }
    
    if (path === 'admin/progress' && method === 'GET') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      if (user.role !== 'admin') return jsonResponse(res, 403, { error: 'Admin access required' });
      const progress = db.results.map(r => {
        const u = db.users.find(u => u.id === r.user_id);
        return { username: u?.username || 'Unknown', quiz_category: r.quiz_category, score: r.score, total_questions: r.total_questions, completed_at: r.completed_at, percentage: Math.round((r.score / r.total_questions) * 100) };
      }).sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at)).slice(0, 50);
      return jsonResponse(res, 200, progress);
    }
    
    if (path.startsWith('admin/user/') && path.endsWith('/progress') && method === 'DELETE') {
      const user = authenticate(req);
      if (!user) return jsonResponse(res, 401, { error: 'No token provided' });
      if (user.role !== 'admin') return jsonResponse(res, 403, { error: 'Admin access required' });
      const id = parseInt(path.split('/')[2]);
      db.results = db.results.filter(r => r.user_id !== id);
      saveDB(db);
      return jsonResponse(res, 200, { message: 'User progress reset successfully' });
    }
    
    return jsonResponse(res, 404, { error: 'Not found' });
  }
  
  // Serve static files
  let filePath = url === '/' ? '/index.html' : url;
  
  // Handle HTML page routes
  if (url === '/admin') {
    filePath = path.join(__dirname, 'public', 'admin.html');
  } else if (url === '/dashboard') {
    filePath = path.join(__dirname, 'public', 'dashboard.html');
  } else if (url === '/quiz') {
    filePath = path.join(__dirname, 'public', 'quiz.html');
  } else {
    filePath = path.join(__dirname, 'public', filePath);
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin credentials: admin@interviewprep.com / admin123`);
});
