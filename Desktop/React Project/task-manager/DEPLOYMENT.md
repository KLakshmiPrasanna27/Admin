# Task Manager - Deployment Guide

## Railway Deployment

### Prerequisites
1. Create a Railway account at https://railway.app
2. Install Railway CLI: `npm install -g @railway/cli`

### Backend Deployment
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Create a new project:
   ```bash
   railway init
   ```

4. Add MongoDB service:
   ```bash
   railway add mongodb
   ```

5. Set environment variables:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-super-secret-jwt-key-here
   railway variables set PORT=5000
   ```

6. Deploy:
   ```bash
   railway up
   ```

7. Get the backend URL from Railway dashboard.

### Frontend Deployment
1. Navigate to the root directory:
   ```bash
   cd ..
   ```

2. Create a new Railway project for frontend:
   ```bash
   railway init
   ```

3. Set environment variables:
   ```bash
   railway variables set REACT_APP_API_URL=https://your-backend-url.railway.app/api
   railway variables set NODE_ENV=production
   ```

4. Deploy:
   ```bash
   railway up
   ```

## Demo Credentials
- Admin: admin@demo.com / admin123
- Member: member@demo.com / member123

## Features
- User authentication (Signup/Login)
- Role-based access control (Admin/Member)
- Project management
- Task creation and assignment
- Dashboard with statistics
- Responsive design