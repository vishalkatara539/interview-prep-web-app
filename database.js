const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database('database.sqlite');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    correct_answer INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    quiz_category TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Seed initial questions if empty
const questionCount = db.prepare('SELECT COUNT(*) as count FROM questions').get();
if (questionCount.count === 0) {
  const questions = [
    // JavaScript
    { category: 'JavaScript', question: 'What is the output of typeof null?', options: JSON.stringify(['null', 'undefined', 'object', 'string']), correct_answer: 2 },
    { category: 'JavaScript', question: 'Which method creates a new array with all elements that pass a test?', options: JSON.stringify(['map()', 'filter()', 'reduce()', 'forEach()']), correct_answer: 1 },
    { category: 'JavaScript', question: 'What is the correct way to declare a constant in JavaScript?', options: JSON.stringify(['var x = 5', 'let x = 5', 'const x = 5', 'constant x = 5']), correct_answer: 2 },
    { category: 'JavaScript', question: 'What does === compare?', options: JSON.stringify(['Value only', 'Type only', 'Value and type', 'Reference']), correct_answer: 2 },
    { category: 'JavaScript', question: 'Which is NOT a JavaScript data type?', options: JSON.stringify(['undefined', 'boolean', 'float', 'string']), correct_answer: 2 },
    { category: 'JavaScript', question: 'What is a closure?', options: JSON.stringify(['A function with variables', 'A function that returns another function', 'A function that has access to outer scope variables', 'An anonymous function']), correct_answer: 2 },
    { category: 'JavaScript', question: 'Which method removes the last element from an array?', options: JSON.stringify(['shift()', 'pop()', 'slice()', 'splice()']), correct_answer: 1 },
    { category: 'JavaScript', question: 'What is Promise.all() used for?', options: JSON.stringify(['Execute promises sequentially', 'Execute promises in parallel and wait for all', 'Handle errors', 'Cancel promises']), correct_answer: 1 },
    { category: 'JavaScript', question: 'What is event bubbling?', options: JSON.stringify(['Events go from parent to child', 'Events go from child to parent', 'Events stay in same element', 'Events cancel each other']), correct_answer: 1 },
    { category: 'JavaScript', question: 'Which statement about hoisting is true?', options: JSON.stringify(['Only var is hoisted', 'Function declarations are hoisted', 'let is fully hoisted', 'const is fully hoisted']), correct_answer: 1 },
    
    // React
    { category: 'React', question: 'What is JSX?', options: JSON.stringify(['JavaScript XML', 'Java Syntax Extension', 'JSON Extra', 'JavaScript Extra']), correct_answer: 0 },
    { category: 'React', question: 'Which hook is used for side effects?', options: JSON.stringify(['useState', 'useEffect', 'useContext', 'useReducer']), correct_answer: 1 },
    { category: 'React', question: 'What is the virtual DOM?', options: JSON.stringify(['A copy of real DOM', 'A JavaScript representation of DOM', 'A browser feature', 'A database']), correct_answer: 1 },
    { category: 'React', question: 'How do you pass data to a child component?', options: JSON.stringify(['state', 'props', 'context', 'hooks']), correct_answer: 1 },
    { category: 'React', question: 'What is useState used for?', options: JSON.stringify(['Side effects', 'Managing state', 'Routing', 'HTTP requests']), correct_answer: 1 },
    { category: 'React', question: 'Which method is called first in React component lifecycle?', options: JSON.stringify(['componentDidMount', 'render', 'constructor', 'componentWillMount']), correct_answer: 2 },
    { category: 'React', question: 'What is Redux used for?', options: JSON.stringify(['Routing', 'State management', 'Database', 'Styling']), correct_answer: 1 },
    { category: 'React', question: 'What is the purpose of key prop?', options: JSON.stringify(['Styling', 'Identification for reconciliation', 'Events', 'State']), correct_answer: 1 },
    { category: 'React', question: 'Which is NOT a React hook rule?', options: JSON.stringify(['Call at top level', 'Only in React functions', 'Can be conditional', 'Same order every render']), correct_answer: 2 },
    { category: 'React', question: 'What is server-side rendering in Next.js?', options: JSON.stringify(['Client renders', 'Server renders pages', 'No JavaScript', 'Static generation']), correct_answer: 1 },
    
    // Node.js
    { category: 'Node.js', question: 'What is Node.js?', options: JSON.stringify(['A programming language', 'A runtime environment', 'A database', 'A framework']), correct_answer: 1 },
    { category: 'Node.js', question: 'Which module is used for file system operations?', options: JSON.stringify(['http', 'fs', 'path', 'url']), correct_answer: 1 },
    { category: 'Node.js', question: 'What is Express.js?', options: JSON.stringify(['Database', 'Template engine', 'Web framework', 'Testing tool']), correct_answer: 2 },
    { category: 'Node.js', question: 'How do you export a module in Node.js?', options: JSON.stringify(['module.export', 'module.exports', 'export module', 'exports']), correct_answer: 1 },
    { category: 'Node.js', question: 'What is middleware?', options: JSON.stringify(['Database software', 'Functions between request and response', 'Security tool', 'Template engine']), correct_answer: 1 },
    { category: 'Node.js', question: 'Which is NOT a Node.js global object?', options: JSON.stringify(['global', 'process', 'window', 'Buffer']), correct_answer: 2 },
    { category: 'Node.js', question: 'What is npm?', options: JSON.stringify(['Node Package Manager', 'New Program Manager', 'Node Project Manager', 'Network Package']), correct_answer: 0 },
    { category: 'Node.js', question: 'What does req.params contain?', options: JSON.stringify(['Query strings', 'URL parameters', 'Request body', 'Headers']), correct_answer: 1 },
    { category: 'Node.js', question: 'What is streams in Node.js?', options: JSON.stringify(['Data type', 'Way to handle streaming data', 'Debugging tool', 'Testing framework']), correct_answer: 1 },
    { category: 'Node.js', question: 'What is callback hell?', options: JSON.stringify(['Error handling', 'Nested callbacks', 'Memory issue', 'Security flaw']), correct_answer: 1 },
    
    // HTML/CSS
    { category: 'HTML/CSS', question: 'What does HTML stand for?', options: JSON.stringify(['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language']), correct_answer: 0 },
    { category: 'HTML/CSS', question: 'Which CSS property changes text color?', options: JSON.stringify(['text-color', 'font-color', 'color', 'foreground']), correct_answer: 2 },
    { category: 'HTML/CSS', question: 'What is the correct HTML element for the largest heading?', options: JSON.stringify(['<heading>', '<h6>', '<h1>', '<head>']), correct_answer: 2 },
    { category: 'HTML/CSS', question: 'Which CSS display property makes elements inline?', options: JSON.stringify(['block', 'inline', 'flex', 'grid']), correct_answer: 1 },
    { category: 'HTML/CSS', question: 'What is Flexbox used for?', options: JSON.stringify(['Database', '1D layout', '3D graphics', 'Animation']), correct_answer: 1 },
    { category: 'HTML/CSS', question: 'Which selector has highest specificity?', options: JSON.stringify(['Element', 'Class', 'ID', 'Universal']), correct_answer: 2 },
    { category: 'HTML/CSS', question: 'What does CSS box-sizing: border-box do?', options: JSON.stringify(['Adds border outside', 'Includes padding/border in width', 'Removes borders', 'Adds shadow']), correct_answer: 1 },
    { category: 'HTML/CSS', question: 'What is a pseudo-class?', options: JSON.stringify(['A class in JS', 'A state of an element', 'A CSS framework', 'A selector type']), correct_answer: 1 },
    { category: 'HTML/CSS', question: 'Which is semantic HTML element?', options: JSON.stringify(['<div>', '<span>', '<article>', '<b>']), correct_answer: 2 },
    { category: 'HTML/CSS', question: 'What is CSS Grid?', options: JSON.stringify(['Table layout', '2D layout system', 'Animation library', 'Color scheme']), correct_answer: 1 },
    
    // SQL
    { category: 'SQL', question: 'What does SQL stand for?', options: JSON.stringify(['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query List']), correct_answer: 0 },
    { category: 'SQL', question: 'Which command is used to extract data?', options: JSON.stringify(['EXTRACT', 'SELECT', 'GET', 'FIND']), correct_answer: 1 },
    { category: 'SQL', question: 'What is PRIMARY KEY?', options: JSON.stringify(['Unique identifier', 'First column', 'Foreign reference', 'Index only']), correct_answer: 0 },
    { category: 'SQL', question: 'Which JOIN returns matching rows?', options: JSON.stringify(['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER']), correct_answer: 2 },
    { category: 'SQL', question: 'What does WHERE clause do?', options: JSON.stringify(['Filters records', 'Sorts data', 'Groups data', 'Joins tables']), correct_answer: 0 },
    { category: 'SQL', question: 'What is a foreign key?', options: JSON.stringify(['Primary key in another table', 'Unique key', 'Index', 'Constraint only']), correct_answer: 0 },
    { category: 'SQL', question: 'Which aggregates NULL values?', options: JSON.stringify(['COUNT', 'SUM', 'AVG', 'All of above']), correct_answer: 3 },
    { category: 'SQL', question: 'What does GROUP BY do?', options: JSON.stringify(['Sorts results', 'Groups rows', 'Filters data', 'Joins tables']), correct_answer: 1 },
    { category: 'SQL', question: 'What is a subquery?', options: JSON.stringify(['Main query', 'Query within query', 'Join type', 'Index']), correct_answer: 1 },
    { category: 'SQL', question: 'Which normal form removes transitive dependency?', options: JSON.stringify(['1NF', '2NF', '3NF', 'BCNF']), correct_answer: 2 },
    
    // General Programming
    { category: 'General Programming', question: 'What is an algorithm?', options: JSON.stringify(['A programming language', 'Step-by-step procedure', 'A software', 'A database']), correct_answer: 1 },
    { category: 'General Programming', question: 'What is time complexity?', options: JSON.stringify(['Memory used', 'Execution time relative to input', 'Code length', 'Number of variables']), correct_answer: 1 },
    { category: 'General Programming', question: 'What is OOP?', options: JSON.stringify(['Object-Oriented Programming', 'Online Programming', 'Optimized Operations', 'Open-source Protocol']), correct_answer: 0 },
    { category: 'General Programming', question: 'What is a class in OOP?', options: JSON.stringify(['An object', 'Blueprint for objects', 'A function', 'A variable']), correct_answer: 1 },
    { category: 'General Programming', question: 'What is inheritance?', options: JSON.stringify(['Copying code', 'Child class gets parent properties', 'Hiding data', 'Encrypting']), correct_answer: 1 },
    { category: 'General Programming', question: 'What is encapsulation?', options: JSON.stringify(['Hiding complexity', 'Bundling data and methods', 'Inheritance', 'Polymorphism']), correct_answer: 1 },
    { category: 'General Programming', question: 'What is polymorphism?', options: JSON.stringify(['Many forms', 'Single inheritance', 'Data hiding', 'Code reuse']), correct_answer: 0 },
    { category: 'General Programming', question: 'What is recursion?', options: JSON.stringify(['Loop', 'Function calling itself', 'Condition', 'Variable']), correct_answer: 1 },
    { category: 'General Programming', question: 'What is Big O notation?', options: JSON.stringify(['Data type', 'Performance analysis', 'Algorithm name', 'Programming language']), correct_answer: 1 },
    { category: 'General Programming', question: 'What is a data structure?', options: JSON.stringify(['Algorithm', 'Organization of data', 'Programming language', 'Output format']), correct_answer: 1 }
  ];

  const insert = db.prepare('INSERT INTO questions (category, question, options, correct_answer) VALUES (?, ?, ?, ?)');
  for (const q of questions) {
    insert.run(q.category, q.question, q.options, q.correct_answer);
  }

  // Create admin user
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)').run('admin', 'admin@interviewprep.com', hashedPassword, 'admin');
}

module.exports = db;
