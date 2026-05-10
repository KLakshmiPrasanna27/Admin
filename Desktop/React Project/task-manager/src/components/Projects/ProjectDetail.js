import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, ListGroup, Spinner, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { projectAPI, taskAPI, authAPI } from '../../services/api';
import './ProjectDetail.css';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const userId = user?._id || user?.id;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        await Promise.all([
          fetchProjectDetails(),
          fetchTasks(),
          user?.role === 'admin' ? fetchUsers() : Promise.resolve()
        ]);
      } catch (err) {
        console.error('Project detail load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, user]);

  const fetchProjectDetails = async () => {
    try {
      const response = await projectAPI.getProjectById(id);
      setProject(response.data.project);
    } catch (err) {
      setError('Failed to load project details');
      console.error('Project detail error:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks({ projectId: id });
      setTasks(response.data.tasks);
    } catch (err) {
      console.error('Tasks error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (err) {
      console.error('Users error:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await taskAPI.createTask({
        ...taskForm,
        projectId: id
      });
      setShowTaskModal(false);
      setTaskForm({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: ''
      });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMember = async (memberId) => {
    try {
      await projectAPI.addMember(id, memberId);
      fetchProjectDetails();
      setShowMemberModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await projectAPI.removeMember(id, memberId);
      fetchProjectDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
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

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      'in-progress': 'primary',
      completed: 'success',
      'on-hold': 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getMemberId = (member) => {
    if (!member) return null;
    return typeof member === 'string' ? member : member._id || member.id;
  };

  const getMemberName = (member) => {
    if (!member) return 'Unknown member';
    if (typeof member === 'string') return member;
    return member.name || member.email || 'Unknown member';
  };

  const getAdminId = (admin) => {
    if (!admin) return null;
    return typeof admin === 'string' ? admin : admin._id || admin.id;
  };

  const getAdminName = (admin) => {
    if (!admin) return 'Unknown admin';
    if (typeof admin === 'string') return admin;
    return admin.name || admin.email || 'Unknown admin';
  };

  const isAdmin = getAdminId(project?.admin) === userId;
  const isMember = project?.members?.some(m => getMemberId(m) === userId);

  if (loading) {
    return (
      <Container className="project-detail-container">
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p>Loading project details...</p>
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="project-detail-container">
        <Alert variant="danger">Project not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="project-detail-container">
      <div className="project-detail-header">
        <Button variant="outline-secondary" onClick={() => navigate('/projects')}>
          ← Back to Projects
        </Button>
        <h1>{project.name}</h1>
        <div className="project-actions">
          {isAdmin && (
            <>
              <Button variant="primary" onClick={() => setShowTaskModal(true)}>
                Create Task
              </Button>
              <Button variant="outline-primary" onClick={() => setShowMemberModal(true)}>
                Add Member
              </Button>
            </>
          )}
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={8}>
          <Card className="project-info-card">
            <Card.Body>
              <h5>Project Information</h5>
              <p><strong>Description:</strong> {project.description || 'No description provided'}</p>
              <p><strong>Status:</strong> {getStatusBadge(project.status)}</p>
              <p><strong>Admin:</strong> {getAdminName(project.admin)}</p>
              {project.endDate && (
                <p><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
              )}
            </Card.Body>
          </Card>

          <Card className="tasks-card">
            <Card.Body>
              <h5>Tasks ({tasks.length})</h5>
              {tasks.length === 0 ? (
                <p className="text-muted">No tasks created yet.</p>
              ) : (
                <ListGroup variant="flush">
                  {tasks.map((task) => (
                    <ListGroup.Item key={task._id} className="task-item">
                      <div className="task-header">
                        <h6>{task.title}</h6>
                        <div className="task-badges">
                          {getPriorityBadge(task.priority)}
                          {getStatusBadge(task.status)}
                        </div>
                      </div>
                      <p className="task-description">{task.description}</p>
                      <div className="task-meta">
                        <small>Assigned to: {task.assignedTo?.name || task.assignedTo || 'Unassigned'}</small>
                        <small>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="members-card">
            <Card.Body>
              <h5>Team Members ({project.members?.length || 0})</h5>
              <ListGroup variant="flush">
                {project.members?.map((member) => {
                  const memberId = getMemberId(member);
                  const isProjectAdmin = memberId === getAdminId(project.admin);
                  return (
                    <ListGroup.Item key={memberId || Math.random()} className="member-item">
                      <div className="member-info">
                        <span>{getMemberName(member)}</span>
                        {isProjectAdmin && (
                          <Badge bg="primary">Admin</Badge>
                        )}
                      </div>
                      {isAdmin && !isProjectAdmin && memberId && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveMember(memberId)}
                        >
                          Remove
                        </Button>
                      )}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Task Modal */}
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateTask}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Task Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                required
                placeholder="Enter task title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                placeholder="Enter task description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assign To *</Form.Label>
              <Form.Select
                name="assignedTo"
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
                required
              >
                <option value="">Select a member</option>
                {project.members?.map((member) => {
                  const memberId = getMemberId(member);
                  return (
                    <option key={memberId || Math.random()} value={memberId}>
                      {getMemberName(member)}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={taskForm.priority}
                onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date *</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTaskModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Member Modal */}
      <Modal show={showMemberModal} onHide={() => setShowMemberModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {users
              .filter(u => {
                const userId = u._id || u.id;
                return !project.members?.some(m => getMemberId(m) === userId);
              })
              .map((user) => {
                const userId = user._id || user.id;
                return (
                  <ListGroup.Item key={userId} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{user.name}</strong>
                      <br />
                      <small className="text-muted">{user.email}</small>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleAddMember(userId)}
                    >
                      Add
                    </Button>
                  </ListGroup.Item>
                );
              })}
          </ListGroup>
          {users.filter(u => {
              const userId = u._id || u.id;
              return !project.members?.some(m => getMemberId(m) === userId);
            }).length === 0 && (
            <p className="text-muted text-center mt-3">All users are already members of this project.</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ProjectDetail;