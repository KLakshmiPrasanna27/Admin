import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { projectAPI, authAPI } from '../../services/api';
import './Projects.css';

function Projects() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getProjects();
      setProjects(response.data.projects);
    } catch (err) {
      console.error('Projects error:', err);
      // Show demo data if API fails
      setProjects([
        {
          _id: '1',
          name: 'Website Redesign',
          description: 'Complete overhaul of company website',
          admin: { name: 'Admin User' },
          members: [{ name: 'John Doe' }, { name: 'Jane Smith' }],
          status: 'active',
          endDate: '2026-06-01'
        },
        {
          _id: '2',
          name: 'Mobile App Development',
          description: 'Native mobile app for iOS and Android',
          admin: { name: 'Admin User' },
          members: [{ name: 'Bob Johnson' }],
          status: 'active',
          endDate: '2026-08-15'
        }
      ]);
      setError('Using demo data - Backend not available');
    } finally {
      setLoading(false);
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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await projectAPI.createProject(formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', endDate: '' });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      completed: 'primary',
      'on-hold': 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="projects-container">
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p>Loading projects...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create New Project
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {projects.map((project) => (
          <Col md={6} lg={4} key={project._id} className="mb-4">
            <Card className="project-card" onClick={() => navigate(`/projects/${project._id}`)}>
              <Card.Body>
                <div className="project-header">
                  <Card.Title>{project.name}</Card.Title>
                  {getStatusBadge(project.status)}
                </div>

                <Card.Text className="project-description">
                  {project.description || 'No description provided'}
                </Card.Text>

                <div className="project-meta">
                  <small className="text-muted">
                    Admin: {project.admin.name}
                  </small>
                  <br />
                  <small className="text-muted">
                    Members: {project.members.length}
                  </small>
                  {project.endDate && (
                    <>
                      <br />
                      <small className="text-muted">
                        Due: {new Date(project.endDate).toLocaleDateString()}
                      </small>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {projects.length === 0 && (
        <div className="text-center mt-5">
          <p className="text-muted">No projects found. Create your first project to get started!</p>
        </div>
      )}

      {/* Create Project Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateProject}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Project Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter project name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Project'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Projects;