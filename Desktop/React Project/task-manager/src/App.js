import './App.css';
import { Button } from 'react-bootstrap';
import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Admin from './components/Admin/Admin';
import CreateTask from './components/Admin/CreateTask/CreateTask';
import Dashboard from './components/Dashboard/Dashboard';
import Projects from './components/Projects/Projects';
import ProjectDetail from './components/Projects/ProjectDetail';
import Profile from './components/Profile/Profile';
import Navbar from './components/Navbar/Navbar';
import { useState, createContext, useContext, useEffect } from 'react';
import { authAPI } from './services/api';

export const AuthContext = createContext();

function AppRoutes() {
  const location = useLocation();
  const showButtons = location.pathname === "/";
  const { isLoggedIn, userRole } = useContext(AuthContext);

  return (
    <div>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeButtons />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/projects" element={isLoggedIn ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/projects/:id" element={isLoggedIn ? <ProjectDetail /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isLoggedIn && userRole === "admin" ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/createTask" element={isLoggedIn && userRole === "admin" ? <CreateTask /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

function HomeButtons() {
  return (
    <div className='homePage'>
      <div className='homePageHeader'>
        <h1> Task Manager Application</h1>
        <p>“One platform, One team, Unlimited productivity!!”</p>
      </div>

      <div className='homePageBody'>
        <div className='homePageDescription'>
          <p>
            Team Task Manager is a full-stack web application designed to simplify project collaboration and task management within teams.
            The platform allows users to create and manage projects, assign tasks to team members, monitor task progress, and
            track deadlines efficiently through a centralized dashboard. It includes secure authentication with role-based access control,
            where Admins can manage projects and team activities while Members can update and track their assigned tasks.
            The application provides features such as task status updates, overdue task monitoring, project organization, and
            real-time workflow visibility to improve productivity and teamwork. Built using modern web technologies with REST APIs and database integration,
            the system ensures scalability, proper validations, and smooth user experience across all devices.
          </p>
        </div>

        <div className='buttonContainer'>
          <Button href="/signUp" variant='info'>signUp</Button>
          <Button href='/login' variant='secondary'>Login</Button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserRole(userData.role);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setIsLoggedIn(true);
    setUserRole(userData.role);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const authValue = { 
    isLoggedIn, 
    userRole, 
    user, 
    login, 
    logout,
    loading
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <div className="top">
      <BrowserRouter>
        <AuthContext.Provider value={authValue}>
          <AppRoutes />
        </AuthContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
