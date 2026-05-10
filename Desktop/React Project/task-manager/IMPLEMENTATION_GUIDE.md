# Task Manager Application - Implementation Guide

## Overview
This is a complete React-based Task Manager application with authentication, admin dashboard, and task management features.

## Features Implemented

### 1. **Home Page**
- Welcome screen with application description
- Sign Up and Login buttons
- Professional styling with gradient background
- Responsive design

### 2. **Authentication System**
- **Sign Up Page**: User registration with validation
  - Username, Email, Contact Number, Age, Password, Confirm Password
  - Form validation (email format, age verification, password matching)
  - Redirect to login after successful registration

- **Login Page**: Admin authentication
  - Username and password authentication
  - Demo credentials: `admin / admin123`
  - Error handling and display
  - Redirect to admin dashboard on successful login

### 3. **Admin Dashboard**
The dashboard displays a comprehensive overview with:

#### Dashboard Overview Statistics
- **Total Tasks**: Count of all tasks in the system
- **Completed Tasks**: Tasks with "Completed" status
- **In Progress Tasks**: Tasks currently being worked on
- **Overdue Tasks**: Tasks that have exceeded their due date

#### Task Status Summary
- Visual breakdown of tasks by status:
  - ✅ Completed tasks
  - 🔄 In Progress tasks
  - ⏳ Pending tasks
  - ⚠️ Overdue tasks

#### Task Management Table
- View all tasks in a detailed table format
- Columns: Task ID, Title, Status, Priority, Due Date, Actions
- **Status Dropdown**: Dynamically update task status
  - Pending
  - In Progress
  - Completed
  - Overdue
- **Priority Badges**: Color-coded priority levels
  - Critical (Red)
  - High (Yellow)
  - Medium (Blue)
  - Low (Green)
- **Delete Button**: Remove tasks from the list

#### Add New Task Modal
- "+ Add New Task" button to create new tasks
- Modal form with fields:
  - Task Title (required)
  - Status (dropdown)
  - Priority (dropdown)
  - Due Date (date picker, required)
- Form validation before submission

### 4. **Authentication Context**
Global state management using React Context API:
- `isLoggedIn`: Track login state
- `userRole`: Store user role (admin/user)
- `userName`: Store logged-in user's name
- `tasks`: Array of all tasks
- `login()`: Function to authenticate user
- `logout()`: Function to log out
- `addTask()`: Function to add new tasks
- `setTasks()`: Function to update tasks

### 5. **Routing**
Protected routes using React Router v7:
- `/` - Home page (public)
- `/signUp` - Sign up page (public)
- `/login` - Login page (public)
- `/admin` - Admin dashboard (protected, requires admin role)
- `/createTask` - Create task page (protected, requires admin role)

## Demo Credentials
```
Username: admin
Password: admin123
```

## How to Use

### 1. Start the Application
```bash
npm install
npm start
```

### 2. Registration
- Click "SignUp" on the home page
- Fill in all required fields
- Click "Create Account"
- Redirected to login page

### 3. Login
- Click "Login" on the home page
- Use demo credentials (admin / admin123)
- Successfully redirected to admin dashboard

### 4. Dashboard Navigation
- View task statistics in the overview cards
- Check task status summary
- Scroll through the task table
- Click on status dropdown to update task status
- Click "Delete" to remove a task
- Click "+ Add New Task" to create a new task

### 5. Create New Task
- Click "+ Add New Task" button
- Fill in task details:
  - Task Title
  - Status
  - Priority
  - Due Date
- Click "Create Task"
- Task appears in the table instantly

### 6. Logout
- Click "Logout" button in the top-right corner
- Redirected to home page

## Project Structure
```
src/
├── components/
│   ├── Admin/
│   │   ├── Admin.js (Dashboard component)
│   │   ├── Admin.css (Dashboard styles)
│   │   └── CreateTask/
│   │       ├── CreateTask.js (Task creation form)
│   │       └── CreateTask.css
│   ├── Login/
│   │   ├── Login.js (Login form)
│   │   └── Login.css
│   └── SignUp/
│       ├── SignUp.js (Registration form)
│       └── SignUp.css
├── App.js (Main app with routing and context)
├── App.css (Home page styles)
└── index.js
```

## Technologies Used
- **React 19.2.6** - UI Framework
- **React Router v7** - Client-side routing
- **React Bootstrap 2.10.10** - UI Components
- **Bootstrap 5.3.8** - Styling framework
- **React Context API** - State management

## Sample Data
The dashboard comes with pre-populated sample tasks:
1. Setup Database - Completed - High Priority
2. API Development - In Progress - High Priority
3. Frontend Design - Pending - Medium Priority
4. Testing Phase - Overdue - Critical Priority

## Form Validations

### Sign Up Form
- ✓ All fields required
- ✓ Valid email format
- ✓ Passwords must match
- ✓ Password minimum 6 characters
- ✓ Age must be 18 or above
- ✓ Contact number format validation

### Login Form
- ✓ Username and password required
- ✓ Credentials validation

### Task Creation Form
- ✓ Task title required
- ✓ Due date required
- ✓ Status and priority selection

## Color Scheme

### Gradient Colors
- Primary Gradient: Purple to Blue (#667eea to #764ba2)

### Status Colors
- Completed: Green (#11998e to #38ef7d)
- In Progress: Blue (#0093E9 to #80D0C7)
- Pending: Yellow/Orange
- Overdue: Red (#ff6b6b to #ff8787)

### Priority Colors
- Critical: Danger (Red)
- High: Warning (Yellow)
- Medium: Info (Blue)
- Low: Success (Green)

## Responsive Design
- Mobile-friendly layout
- Tablet optimization
- Desktop full-width support
- Adaptive typography and spacing

## Future Enhancements
- Backend API integration
- Database persistence
- User profiles and roles
- Task assignment to team members
- Real-time notifications
- File attachments
- Comments and collaboration features
- Advanced filtering and search
- Task analytics and reporting

## Notes
- All tasks are stored in React state (resets on page refresh)
- Demo mode - no backend integration yet
- Ready for backend API integration
