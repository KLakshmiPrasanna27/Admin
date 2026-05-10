import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Button, Modal, Form, Badge, Table } from 'react-bootstrap';
import { AuthContext } from '../../App';
import { taskAPI, projectAPI, authAPI } from '../../services/api';
import './Dashboard.css';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myTasks, setMyTasks] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get dashboard stats
      const statsResponse = await taskAPI.getDashboardStats();
      setStats(statsResponse.data.stats);

      // Get user's tasks and projects
      const [tasksResponse, projectsResponse] = await Promise.all([
        taskAPI.getTasks(),
        projectAPI.getProjects()
      ]);

      setMyTasks(tasksResponse.data.tasks);
      setMyProjects(projectsResponse.data.projects);

      // Get all users if admin
      if (user?.role === 'admin') {
        const usersResponse = await authAPI.getAllUsers();
        setAllUsers(usersResponse.data.users);
      }

    } catch (err) {
      console.error('Dashboard error:', err);
      // Show demo data if API fails
      setStats({
        totalTasks: 12,
        completedTasks: 8,
        inProgressTasks: 3,
        pendingTasks: 1,
        overdueTasks: 2,
        highPriorityTasks: 4,
        completionRate: 67
      });
      setError('Using demo data - Backend not available');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.createTask({
        ...taskForm,
        projectId: selectedProject
      });
      setShowTaskModal(false);
      setTaskForm({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: ''
      });
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Create task error:', err);
      setError('Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Update task error:', err);
      setError('Failed to update task status');
    }
  };

  const getFilteredTasks = () => {
    if (user?.role === 'admin') {
      return myTasks; // Admin sees all tasks
    } else {
      return myTasks.filter(task => task.assignedTo._id === user._id); // Members see only their tasks
    }
  };

  const getFilteredProjects = () => {
    if (user?.role === 'admin') {
      return myProjects; // Admin sees all projects
    } else {
      return myProjects.filter(project =>
        project.members.some(member => member._id === user._id)
      ); // Members see only projects they're assigned to
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'secondary',
      'in-progress': 'primary',
      'completed': 'success',
      'overdue': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      'low': 'success',
      'medium': 'warning',
      'high': 'danger'
    };
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  if (loading) {
    return (
      <Container className="dashboard-container">
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p>Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="dashboard-container">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const filteredTasks = getFilteredTasks();
  const filteredProjects = getFilteredProjects();

  return (
    <Container className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's your {user?.role === 'admin' ? 'team' : 'personal'} overview.</p>
      </div>

      {/* Stats Row - Same for both roles */}
      <Row className="stats-row">
        <Col md={3} sm={6}>
          <Card className="stat-card total-tasks">
            <Card.Body>
              <div className="stat-icon">📊</div>
              <div className="stat-number">{stats?.totalTasks || 0}</div>
              <div className="stat-label">Total Tasks</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="stat-card completed-tasks">
            <Card.Body>
              <div className="stat-icon">✅</div>
              <div className="stat-number">{stats?.completedTasks || 0}</div>
              <div className="stat-label">Completed</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="stat-card in-progress-tasks">
            <Card.Body>
              <div className="stat-icon">🔄</div>
              <div className="stat-number">{stats?.inProgressTasks || 0}</div>
              <div className="stat-label">In Progress</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="stat-card overdue-tasks">
            <Card.Body>
              <div className="stat-icon">⚠️</div>
              <div className="stat-number">{stats?.overdueTasks || 0}</div>
              <div className="stat-label">Overdue</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Admin-specific content */}
      {user?.role === 'admin' && (
        <>
          <Row className="admin-actions">
            <Col>
              <Card className="admin-card">
                <Card.Body>
                  <h5>Admin Actions</h5>
                  <div className="admin-buttons">
                    <Button
                      variant="primary"
                      onClick={() => setShowTaskModal(true)}
                      className="me-2"
                    >
                      Create New Task
                    </Button>
                    <Button variant="secondary" href="/admin">
                      Manage Users
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Tasks Table for Admin */}
          <Row className="recent-tasks">
            <Col>
              <Card className="tasks-card">
                <Card.Body>
                  <h5>Recent Tasks</h5>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.slice(0, 10).map(task => (
                        <tr key={task._id}>
                          <td>{task.title}</td>
                          <td>{task.assignedTo.name}</td>
                          <td>{getStatusBadge(task.status)}</td>
                          <td>{getPriorityBadge(task.priority)}</td>
                          <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={task.status}
                              onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                              style={{ width: '120px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </Form.Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Member-specific content */}
      {user?.role === 'member' && (
        <>
          {/* My Tasks */}
          <Row className="my-tasks">
            <Col>
              <Card className="tasks-card">
                <Card.Body>
                  <h5>My Tasks</h5>
                  {filteredTasks.length === 0 ? (
                    <p>No tasks assigned to you yet.</p>
                  ) : (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Project</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map(task => (
                          <tr key={task._id}>
                            <td>{task.title}</td>
                            <td>{task.project.name}</td>
                            <td>{getStatusBadge(task.status)}</td>
                            <td>{getPriorityBadge(task.priority)}</td>
                            <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* My Projects */}
          <Row className="my-projects">
            <Col>
              <Card className="projects-card">
                <Card.Body>
                  <h5>My Projects</h5>
                  {filteredProjects.length === 0 ? (
                    <p>No projects assigned to you yet.</p>
                  ) : (
                    <div className="projects-list">
                      {filteredProjects.map(project => (
                        <div key={project._id} className="project-item">
                          <h6>{project.name}</h6>
                          <p>{project.description}</p>
                          <small>Admin: {project.admin.name}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Create Task Modal for Admin */}
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateTask}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Project</Form.Label>
              <Form.Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                required
              >
                <option value="">Select a project</option>
                {filteredProjects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assign To</Form.Label>
              <Form.Select
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
                required
              >
                <option value="">Select a team member</option>
                {allUsers.filter(u => u.role === 'member').map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTaskModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Task
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Dashboard;