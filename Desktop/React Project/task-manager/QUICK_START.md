# Task Manager - Quick Start Guide

## 🚀 Getting Started

### Installation
```bash
cd "c:\Users\Admin\Desktop\React Project\task-manager"
npm install
npm start
```

The application will open at `http://localhost:3000`

---

## 📋 Application Flow

### 1️⃣ Home Page
- **URL**: `http://localhost:3000/`
- **Features**:
  - Application title and tagline
  - Description of the application
  - Two buttons: "SignUp" and "Login"
- **Actions**:
  - Click "SignUp" → Go to registration page
  - Click "Login" → Go to login page

### 2️⃣ Sign Up Page
- **URL**: `http://localhost:3000/signUp`
- **Form Fields**:
  - Username (required)
  - Email Address (required, email format validation)
  - Contact Number (required, 10-digit validation)
  - Age (required, minimum 18 years)
  - Password (required, minimum 6 characters)
  - Confirm Password (required, must match password)
- **Actions**:
  - Fill all fields and click "Create Account"
  - Validation messages appear if any field is invalid
  - On success: Redirect to Login page after 2 seconds
  - "Already have an account? Login" link at bottom

### 3️⃣ Login Page
- **URL**: `http://localhost:3000/login`
- **Form Fields**:
  - Username
  - Password
- **Demo Credentials**:
  ```
  Username: admin
  Password: admin123
  ```
- **Actions**:
  - Enter credentials and click "Login"
  - Invalid credentials show error message
  - On success: Redirect to Admin Dashboard

### 4️⃣ Admin Dashboard
- **URL**: `http://localhost:3000/admin` (Protected route)
- **Navigation Bar**:
  - Title: "📋 Task Manager Dashboard"
  - Welcome message with logged-in username
  - "Logout" button

#### **Section 1: Dashboard Overview**
Four statistics cards showing:
- **Total Tasks**: Overall count
- **Completed**: Green card with success gradient
- **In Progress**: Blue card with info gradient
- **Overdue**: Red card with danger gradient

#### **Section 2: Task Status Summary**
Four status items with badges:
- ✅ **Completed**: Green badge + count
- 🔄 **In Progress**: Blue badge + count
- ⏳ **Pending**: Yellow badge + count
- ⚠️ **Overdue**: Red badge + count

#### **Section 3: All Tasks Table**
- Header: "All Tasks" + "+ Add New Task" button
- Table Columns:
  - Task ID
  - Title
  - Status (dropdown to change: Pending, In Progress, Completed, Overdue)
  - Priority (colored badge: Critical, High, Medium, Low)
  - Due Date
  - Delete button

#### **Section 4: Sample Tasks**
Pre-loaded tasks visible immediately:
1. "Setup Database" - Completed - High - 2026-05-01
2. "API Development" - In Progress - High - 2026-05-15
3. "Frontend Design" - Pending - Medium - 2026-05-10
4. "Testing Phase" - Overdue - Critical - 2026-04-20

---

## ✨ Features & Actions

### Create New Task
1. Click "+ Add New Task" button
2. Modal dialog opens with form
3. Fill in:
   - **Task Title** (required)
   - **Status** (Pending, In Progress, Completed, Overdue)
   - **Priority** (Low, Medium, High, Critical)
   - **Due Date** (date picker, required)
4. Click "Create Task"
5. Task appears at bottom of table instantly

### Update Task Status
1. Locate task in table
2. Click the status dropdown
3. Select new status:
   - Pending (yellow)
   - In Progress (blue)
   - Completed (green)
   - Overdue (red)
4. Status updates immediately
5. Statistics cards update automatically

### Delete Task
1. Locate task in table
2. Click "Delete" button in Actions column
3. Task removed from list
4. Statistics update automatically

### View Task Details
1. All task information visible in table:
   - Task ID (unique identifier)
   - Title (task name)
   - Current Status
   - Priority level
   - Due date

### Logout
1. Click "Logout" button (top-right)
2. Redirected to Home page
3. All authentication cleared

---

## 🎨 Color Scheme Reference

| Element | Color | Purpose |
|---------|-------|---------|
| Primary Gradient | Purple → Blue | Main theme |
| Completed | Green (#38ef7d) | Success status |
| In Progress | Blue (#0093E9) | Active status |
| Pending | Yellow (#ffc107) | Waiting status |
| Overdue | Red (#ff6b6b) | Urgent/Past due |
| Critical Priority | Red | Highest urgency |
| High Priority | Orange/Yellow | Very important |
| Medium Priority | Blue | Normal importance |
| Low Priority | Green | Lowest urgency |

---

## 📱 Responsive Breakpoints

- **Desktop**: Full layout, all columns visible
- **Tablet** (768px): Adjusted spacing, columns may reflow
- **Mobile** (<768px): Single column layout, optimized buttons

---

## 🔐 Authentication Details

### Context API State
```javascript
{
  isLoggedIn: boolean,
  userRole: "admin" | null,
  userName: string | null,
  login(name, role): void,
  logout(): void,
  tasks: Array,
  addTask(task): void,
  setTasks(tasks): void
}
```

### Protected Routes
- `/admin` - Requires `isLoggedIn === true` AND `userRole === "admin"`
- `/createTask` - Requires `isLoggedIn === true` AND `userRole === "admin"`
- Any unauthorized access redirects to `/login`

---

## 📊 Task Object Structure
```javascript
{
  id: number (timestamp),
  title: string,
  status: "Pending" | "In Progress" | "Completed" | "Overdue",
  priority: "Low" | "Medium" | "High" | "Critical",
  dueDate: string (YYYY-MM-DD format)
}
```

---

## ⚙️ Technical Stack

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.6 | UI Framework |
| React Router | 7.15.0 | Client routing |
| React Bootstrap | 2.10.10 | UI Components |
| Bootstrap | 5.3.8 | CSS Framework |

---

## 📝 Testing Checklist

- [ ] Home page loads with Sign Up and Login buttons
- [ ] Sign Up form validates all fields
- [ ] Can create account with valid data
- [ ] Invalid credentials show error on login
- [ ] Demo credentials (admin/admin123) work
- [ ] Admin dashboard displays after login
- [ ] Statistics cards show correct counts
- [ ] Task table displays all tasks
- [ ] Can change task status from dropdown
- [ ] Can create new task via modal
- [ ] Can delete task from table
- [ ] Logout button works correctly
- [ ] Protected routes redirect unauthenticated users
- [ ] All styling responsive on mobile

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Port 3000 already in use
```bash
npm start -- --port 3001
```

### CSS not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Restart the development server
- Check `public/index.html` for Bootstrap CDN

### Tasks disappear on page refresh
- This is expected - tasks are stored in React state
- Backend integration needed for persistence

---

## 🚀 Future Enhancements

1. Backend API integration with database
2. User registration with email verification
3. Team member roles and permissions
4. Task assignment to team members
5. Real-time notifications
6. File attachments
7. Comments and collaboration
8. Advanced filtering and sorting
9. Task analytics and reporting
10. Dark mode theme

---

## 📞 Support

For issues or questions:
1. Check the IMPLEMENTATION_GUIDE.md for detailed documentation
2. Review component files for inline comments
3. Check browser console for error messages
4. Verify all npm dependencies are installed

---

**Happy Task Managing! 🎉**
