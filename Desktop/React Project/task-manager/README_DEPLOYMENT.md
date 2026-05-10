# Task Manager Application

A full-stack project and task management web application with role-based access control.

## Features

- **Authentication**: User signup/login with JWT tokens
- **Role-based Access Control**: Admin and Member roles
- **Project Management**: Create and manage projects
- **Task Management**: Create, assign, and track tasks
- **Dashboard**: Overview of tasks, status, and overdue items
- **Team Collaboration**: Add members to projects and assign tasks

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB (Railway Database)
- JWT Authentication
- bcryptjs for password hashing
- Express Validator for input validation

### Frontend
- React 18
- React Router for navigation
- Bootstrap 5 for styling
- Axios for API calls
- JWT token management

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Railway account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB URI
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ..
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Railway Deployment

### Backend Deployment

1. **Create a Railway project**
   ```bash
   railway login
   railway init
   cd backend
   railway up
   ```

2. **Add MongoDB Database**
   - Go to Railway dashboard
   - Add MongoDB service to your project
   - Copy the DATABASE_URL from Railway

3. **Set Environment Variables**
   ```bash
   railway variables set JWT_SECRET=your_secure_jwt_secret_here
   railway variables set NODE_ENV=production
   railway variables set FRONTEND_URL=https://your-frontend-url.railway.app
   ```

### Frontend Deployment

1. **Build the frontend**
   ```bash
   cd ..
   npm run build
   ```

2. **Deploy to Railway**
   ```bash
   railway init
   railway up
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

## API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update profile

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members` - Remove member

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/dashboard` - Get dashboard stats

## User Roles

### Admin
- Create and manage projects
- Add/remove team members
- Create and assign tasks
- View all users and projects
- Access admin dashboard

### Member
- View assigned projects and tasks
- Update task status
- View team members
- Update profile

## Database Schema

### User
- name, email, phone, password, role, age

### Project
- name, description, admin, members, status, dates

### Task
- title, description, project, assignedTo, createdBy, status, priority, dueDate

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control
- CORS protection
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.