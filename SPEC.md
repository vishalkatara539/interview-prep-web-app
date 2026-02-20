# Interview Preparation Web App - Specification

## 1. Project Overview
- **Project Name:** InterviewPrep Pro
- **Type:** Full-stack Web Application
- **Core Functionality:** A quiz-based interview preparation platform with user authentication, progress tracking, and admin controls
- **Target Users:** Job seekers preparing for technical interviews, Administrators managing the platform

## 2. Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js with Express.js
- **Database:** SQLite (file-based, no setup required)
- **Authentication:** JWT tokens with bcrypt password hashing

## 3. UI/UX Specification

### Color Palette
- **Primary:** #1a1a2e (Deep Navy)
- **Secondary:** #16213e (Dark Blue)
- **Accent:** #e94560 (Coral Red)
- **Success:** #00d9a5 (Mint Green)
- **Warning:** #ffc107 (Amber)
- **Text Primary:** #ffffff (White)
- **Text Secondary:** #a0a0a0 (Gray)
- **Background:** #0f0f1a (Near Black)

### Typography
- **Headings:** 'Outfit', sans-serif (Google Fonts)
- **Body:** 'DM Sans', sans-serif (Google Fonts)
- **Monospace:** 'JetBrains Mono', monospace (for code snippets)

### Layout Structure
- **Login/Register Page:** Centered card layout with form
- **Dashboard:** Sidebar navigation + main content area
- **Quiz Interface:** Full-screen focused mode with timer
- **Responsive:** Mobile-first design (min-width: 320px)

### Components
1. **Auth Forms** - Login/Register with validation
2. **Navigation Sidebar** - Collapsible on mobile
3. **Quiz Cards** - Category-based quiz selection
4. **Progress Bars** - Visual progress indicators
5. **Admin Panel** - User management and quiz management
6. **Modal Dialogs** - Confirmations and alerts

### Animations
- Page transitions: Fade in (0.3s ease)
- Button hover: Scale 1.05 + glow effect
- Card hover: Lift effect with shadow
- Progress bars: Animated fill on load

## 4. Functionality Specification

### Authentication System
- User registration with email, username, password
- Login with email/username and password
- JWT-based session management
- Password hashing with bcrypt
- Role-based access (user/admin)

### Quiz System
- Multiple quiz categories:
  - JavaScript
  - React
  - Node.js
  - HTML/CSS
  - SQL
  - General Programming
- Multiple choice questions (4 options each)
- Timed quizzes (30 seconds per question)
- Immediate feedback on answers
- Score calculation and storage

### Progress Tracking
- Track completed quizzes per user
- Store scores and timestamps
- Display progress percentage per category
- Overall progress dashboard
- Performance history charts

### Admin Controls
- View all registered users
- Add/Edit/Delete quiz questions
- View user progress reports
- Reset user progress
- Manage categories

### Data Storage (SQLite)
- **Users Table:** id, username, email, password_hash, role, created_at
- **Questions Table:** id, category, question, options (JSON), correct_answer, created_at
- **Results Table:** id, user_id, quiz_category, score, total_questions, completed_at

## 5. API Endpoints

### Auth Routes
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Quiz Routes
- `GET /api/quiz/categories` - Get all categories
- `GET /api/quiz/:category` - Get questions for category
- `POST /api/quiz/:category/submit` - Submit quiz results

### User Routes
- `GET /api/user/progress` - Get user progress
- `GET /api/user/history` - Get quiz history

### Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/questions` - Get all questions
- `POST /api/admin/questions` - Add new question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question

## 6. File Structure
```
mini project-interview web app/
├── server.js              # Express server
├── database.js            # SQLite database setup
├── package.json           # Dependencies
├── public/
│   ├── index.html         # Login/Register page
│   ├── dashboard.html     # Main dashboard
│   ├── quiz.html          # Quiz taking page
│   ├── admin.html         # Admin panel
│   ├── css/
│   │   └── styles.css     # All styles
│   └── js/
│       ├── auth.js        # Auth functionality
│       ├── app.js         # Main app logic
│       ├── quiz.js        # Quiz logic
│       └── admin.js       # Admin functionality
└── database.sqlite        # SQLite database file
```

## 7. Acceptance Criteria

### Authentication
- [ ] Users can register with unique email
- [ ] Users can login with valid credentials
- [ ] Invalid credentials show appropriate errors
- [ ] JWT token stored securely

### Quiz
- [ ] Users can select quiz category
- [ ] Questions display with 4 options
- [ ] Timer counts down from 30 seconds
- [ ] Score calculated after submission
- [ ] Results saved to database

### Progress
- [ ] Dashboard shows overall progress
- [ ] Category-wise progress displayed
- [ ] History of attempts shown
- [ ] Progress persists across sessions

### Admin
- [ ] Admin can view all users
- [ ] Admin can add new questions
- [ ] Admin can edit/delete questions
- [ ] Admin can view all user progress

### GitHub
- [ ] Project pushed to GitHub repository
