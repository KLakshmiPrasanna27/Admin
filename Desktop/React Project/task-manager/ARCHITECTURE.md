# Component Architecture & Data Flow

## Component Hierarchy

```
App
├── AuthContext (Global State)
│   ├── isLoggedIn
│   ├── userRole
│   ├── userName
│   ├── tasks
│   ├── login()
│   ├── logout()
│   ├── addTask()
│   └── setTasks()
│
└── BrowserRouter
    └── AppRoutes
        ├── Route: "/" → HomeButtons
        ├── Route: "/signUp" → SignUp
        ├── Route: "/login" → Login
        ├── Route: "/admin" → Admin (Protected)
        └── Route: "/createTask" → CreateTask (Protected)
```

---

## File Structure with Descriptions

```
src/
│
├── App.js (Main Application Component)
│   ├── Manages AuthContext with all state
│   ├── Initializes tasks with sample data
│   ├── Provides login/logout functions
│   ├── Handles routing with protection
│   └── Wraps everything with AuthContext.Provider
│
├── App.css (Home Page Styles)
│   ├── Gradient background
│   ├── Responsive layout
│   ├── Button animations
│   └── Typography
│
├── components/
│   │
│   ├── Login/
│   │   ├── Login.js (Authentication Component)
│   │   │   ├── Uses AuthContext for login()
│   │   │   ├── Validates credentials
│   │   │   ├── Redirects on success
│   │   │   └── Shows error messages
│   │   │
│   │   └── Login.css (Login Styles)
│   │       ├── Gradient container
│   │       ├── Card styling
│   │       ├── Form inputs
│   │       └── Button styles
│   │
│   ├── SignUp/
│   │   ├── SignUp.js (Registration Component)
│   │   │   ├── Form validation
│   │   │   ├── Password matching
│   │   │   ├── Email validation
│   │   │   ├── Age verification
│   │   │   └── Redirect to login
│   │   │
│   │   └── SignUp.css (SignUp Styles)
│   │       ├── Similar to login styling
│   │       ├── Form field spacing
│   │       └── Responsive design
│   │
│   └── Admin/
│       ├── Admin.js (Main Dashboard Component)
│       │   ├── Uses AuthContext
│       │   ├── Navbar with user info & logout
│       │   ├── Statistics section
│       │   │   ├── Card 1: Total Tasks
│       │   │   ├── Card 2: Completed
│       │   │   ├── Card 3: In Progress
│       │   │   └── Card 4: Overdue
│       │   │
│       │   ├── Status Summary section
│       │   │   ├── Status items with badges
│       │   │   └── Task counts
│       │   │
│       │   ├── Tasks Table section
│       │   │   ├── Task list display
│       │   │   ├── Status dropdown (state update)
│       │   │   ├── Priority badges
│       │   │   └── Delete buttons
│       │   │
│       │   ├── Add Task Modal
│       │   │   ├── Task title input
│       │   │   ├── Status selector
│       │   │   ├── Priority selector
│       │   │   ├── Due date picker
│       │   │   └── Create button
│       │   │
│       │   └── State Management
│       │       ├── showModal (for form)
│       │       ├── newTask (form data)
│       │       └── Handlers (add, delete, update)
│       │
│       ├── Admin.css (Dashboard Styles)
│       │   ├── Container styling
│       │   ├── Statistics cards with gradients
│       │   ├── Status summary styling
│       │   ├── Table styling
│       │   ├── Modal styling
│       │   └── Responsive grid
│       │
│       └── CreateTask/
│           ├── CreateTask.js (Task Creation Form)
│           │   ├── Form fields (title, description, etc.)
│           │   ├── Validation logic
│           │   ├── Success/error messages
│           │   └── Form reset functionality
│           │
│           └── CreateTask.css (Form Styles)
│               ├── Container styling
│               ├── Form field styling
│               ├── Button group
│               └── Alert styling

public/
├── index.html (Main HTML file)
└── static/
    └── images/ (Image assets)
```

---

## Data Flow Diagrams

### Authentication Flow
```
User clicks "Login"
        ↓
    Login Page
        ↓
  User enters credentials
        ↓
  handleSubmit() validates
        ↓
  If (admin/admin123):
        ↓
  AuthContext.login("admin", "admin")
        ↓
  Updates: isLoggedIn=true, userRole="admin", userName="admin"
        ↓
  useNavigate() → "/admin"
        ↓
  Admin Dashboard Renders
        ↓
  (useContext(AuthContext)) accesses user info
```

### Task Creation Flow
```
User clicks "+ Add New Task"
        ↓
  Modal opens
        ↓
  User fills form:
  - title: string
  - status: string
  - priority: string
  - dueDate: string
        ↓
  handleSubmit() validates
        ↓
  addTask(newTask) called
        ↓
  AuthContext updates tasks array
        ↓
  Admin component re-renders
        ↓
  New task appears in table
        ↓
  Statistics update automatically
```

### Status Update Flow
```
User selects new status from dropdown
        ↓
  handleStatusChange(id, newStatus)
        ↓
  setTasks() updates specific task
        ↓
  Component re-renders
        ↓
  Table shows new status
        ↓
  Statistics recalculate automatically
```

### Delete Task Flow
```
User clicks "Delete" button
        ↓
  handleDeleteTask(id)
        ↓
  setTasks(tasks.filter(task => task.id !== id))
        ↓
  Tasks array updated
        ↓
  Component re-renders
        ↓
  Task removed from table
        ↓
  Statistics update (counts decrease)
```

### Logout Flow
```
User clicks "Logout" button
        ↓
  logout() called
        ↓
  AuthContext updates:
  - isLoggedIn = false
  - userRole = null
  - userName = null
        ↓
  useNavigate() → "/"
        ↓
  Home Page (HomeButtons) displays
```

---

## State Management Details

### AuthContext (Global State)
```javascript
{
  // User Authentication
  isLoggedIn: false,
  userRole: null,           // "admin" or null
  userName: null,           // "admin" or null
  
  // Tasks Data
  tasks: [
    {
      id: 1,
      title: "Task Name",
      status: "Pending",    // Pending, In Progress, Completed, Overdue
      priority: "High",     // Low, Medium, High, Critical
      dueDate: "2026-05-15"
    },
    // ... more tasks
  ],
  
  // Functions
  login: (name, role) => {},     // Set user info
  logout: () => {},              // Clear user info
  addTask: (newTask) => {},      // Add to tasks array
  setTasks: (tasks) => {}        // Replace entire tasks array
}
```

### Component Local State (Admin)
```javascript
showModal: false                    // Modal visibility
newTask: {
  title: "",
  status: "Pending",
  dueDate: "",
  priority: "Medium"
}
```

---

## Route Protection Logic

```javascript
// Protected Admin Route
<Route 
  path="/admin" 
  element={
    isLoggedIn && userRole === "admin" 
      ? <Admin /> 
      : <Navigate to="/login" />
  } 
/>

// Unprotected Routes
<Route path="/" element={<HomeButtons />} />
<Route path="/signUp" element={<SignUp />} />
<Route path="/login" element={<Login />} />
```

---

## Component Communication

### Direct Props (Currently None)
- Components use AuthContext instead of prop drilling

### Context API Usage
```javascript
// In any component that needs auth info:
const { isLoggedIn, userRole, userName, login, logout } = useContext(AuthContext);

// In Admin component:
const { tasks, setTasks, addTask } = useContext(AuthContext);
```

### Navigation
```javascript
// Using React Router
const navigate = useNavigate();
navigate("/admin");
navigate("/login");
```

---

## Calculation/Derived Values

### Task Statistics (Auto-calculated)
```javascript
const completedTasks = tasks.filter(t => t.status === "Completed").length;
const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
const pendingTasks = tasks.filter(t => t.status === "Pending").length;
const overdueTasks = tasks.filter(t => t.status === "Overdue").length;
```

### Color Helpers
```javascript
getStatusColor(status) {
  // Maps status to Bootstrap variant (danger, success, info, warning)
}

getPriorityColor(priority) {
  // Maps priority to Bootstrap variant
}
```

---

## Event Handlers

### Admin Component Handlers
```javascript
handleLogout()              // Calls logout() and navigate("/")
handleAddTask(e)            // Validates and adds new task
handleDeleteTask(id)        // Removes task from array
handleStatusChange(id, newStatus)  // Updates task status
```

### Login Component Handlers
```javascript
handleUserName(event)       // Updates username state
handlePassword(event)       // Updates password state
handleSubmit(event)         // Validates and calls login()
```

### SignUp Component Handlers
```javascript
handleUserName(event)       // Updates username state
handleEmailId(event)        // Updates email state
handleContactNumber(event)  // Updates phone state
handlePassword(event)       // Updates password state
handleConfirmPassword(event)// Updates confirm password state
handleAge(event)            // Updates age state
handleSubmit(event)         // Validates and redirects
```

---

## Validation Logic

### Login Validation
- ✓ Username required
- ✓ Password required
- ✓ Credentials must match "admin/admin123"

### SignUp Validation
- ✓ All fields required
- ✓ Email format validation
- ✓ Password minimum 6 characters
- ✓ Password and confirm password match
- ✓ Age minimum 18
- ✓ Contact number 10 digits

### Task Validation
- ✓ Task title required
- ✓ Due date required
- ✓ Status must be selected
- ✓ Priority must be selected

---

## Performance Optimizations (Future)

1. **Memoization**: Wrap expensive components with React.memo()
2. **useCallback**: Memoize event handler functions
3. **useMemo**: Memoize calculated statistics
4. **Code Splitting**: Lazy load Admin component
5. **Virtual Scrolling**: For large task lists

---

## Testing Approach

### Unit Tests (Recommended)
- Login validation functions
- SignUp validation functions
- Task filtering logic
- Statistics calculations

### Integration Tests (Recommended)
- Login → Admin redirect flow
- Add task → Table update
- Delete task → Statistics update
- Protected route access

### E2E Tests (Recommended)
- Complete signup to task creation flow
- Logout and re-login
- Task CRUD operations

---

## Dependencies

### Required npm packages (installed)
- `react`: UI framework
- `react-dom`: React rendering
- `react-bootstrap`: Bootstrap components
- `bootstrap`: CSS framework
- `react-router-dom`: Routing

### No additional dependencies needed for current features

---

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (responsive design)

---

## Known Limitations

1. **No Persistence**: Data resets on page refresh
2. **Hard-coded Credentials**: Admin credentials are fixed
3. **No Backend**: All operations are frontend-only
4. **Single User**: No multi-user support
5. **No Real-time**: Changes not synced across devices

---

## Next Steps for Enhancement

1. Add backend API (Node.js/Express, Python/Django, etc.)
2. Implement database (PostgreSQL, MongoDB, etc.)
3. Add user authentication with JWT
4. Create user profiles and roles
5. Add task assignment system
6. Implement real-time updates (WebSockets)
7. Add file upload capability
8. Create task comments/collaboration
9. Build analytics dashboard
10. Add mobile native app
