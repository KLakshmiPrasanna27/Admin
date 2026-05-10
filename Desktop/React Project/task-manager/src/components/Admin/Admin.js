import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Alert, Spinner, Badge, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../../App';
import { authAPI, taskAPI, projectAPI } from '../../services/api';
import './Admin.css';

function Admin() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, tasksRes, projectsRes, statsRes] = await Promise.all([
        authAPI.getAllUsers(),
        taskAPI.getTasks(),
        projectAPI.getProjects(),
        taskAPI.getDashboardStats()
      ]);

      setUsers(usersRes.data.users);
      setTasks(tasksRes.data.tasks);
      setProjects(projectsRes.data.projects);
      setStats(statsRes.data.stats);
    } catch (err) {
      setError('Failed to load admin data');
      console.error('Admin data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      'in-progress': 'primary',
      completed: 'success',
      'on-hold': 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: 'secondary',
      medium: 'info',
      high: 'warning',
      critical: 'danger'
    };
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  const getRoleBadge = (role) => {
    return <Badge bg={role === 'admin' ? 'primary' : 'secondary'}>{role}</Badge>;
  };

  if (loading) {
    return (
      <Container className="admin-container">
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p>Loading admin dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, projects, and tasks</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistics Overview */}
      {stats && (
        <Row className="stats-row mb-4">
          <Col md={3} sm={6}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">👥</div>
                <div className="stat-number">{users.length}</div>
                <div className="stat-label">Total Users</div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">📁</div>
                <div className="stat-number">{projects.length}</div>
                <div className="stat-label">Projects</div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">📋</div>
                <div className="stat-number">{stats.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon">⚠️</div>
                <div className="stat-number">{stats.overdueTasks}</div>
                <div className="stat-label">Overdue Tasks</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Users Management */}
      <Card className="admin-card mb-4">
        <Card.Header>
          <h5>Users Management</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Age</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{user.age}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Projects Overview */}
      <Card className="admin-card mb-4">
        <Card.Header>
          <h5>Projects Overview</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Admin</th>
                  <th>Members</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.name}</td>
                    <td>{project.admin.name}</td>
                    <td>{project.members.length}</td>
                    <td>{getStatusBadge(project.status)}</td>
                    <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Tasks */}
      <Card className="admin-card">
        <Card.Header>
          <h5>Recent Tasks</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 10).map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.project.name}</td>
                    <td>{task.assignedTo.name}</td>
                    <td>{getStatusBadge(task.status)}</td>
                    <td>{getPriorityBadge(task.priority)}</td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {tasks.length === 0 && (
            <p className="text-center text-muted mt-3">No tasks found</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Admin;