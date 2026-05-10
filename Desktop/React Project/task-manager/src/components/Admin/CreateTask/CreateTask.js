import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import './CreateTask.css';

const CreateTask = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: '',
    status: 'pending'
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!task.title.trim()) {
      setErrorMessage('Task title is required');
      setSuccessMessage('');
      return;
    }

    if (!task.dueDate) {
      setErrorMessage('Due date is required');
      setSuccessMessage('');
      return;
    }

    if (!task.assignedTo.trim()) {
      setErrorMessage('Please assign the task to someone');
      setSuccessMessage('');
      return;
    }

    // Here you would send the task to your backend API
    console.log('Creating task:', task);

    // Simulate successful task creation
    setSuccessMessage(`Task "${task.title}" created successfully!`);
    setErrorMessage('');

    // Reset form
    setTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      assignedTo: '',
      status: 'pending'
    });

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleReset = () => {
    setTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      assignedTo: '',
      status: 'pending'
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <Container className="create-task-container">
      <div className="create-task-wrapper">
        <h2>Create New Task</h2>

        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
            {errorMessage}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Task Title *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task title"
              name="title"
              value={task.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter task description"
              name="description"
              value={task.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date *</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={task.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Assign To *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter team member name"
              name="assignedTo"
              value={task.assignedTo}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={task.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </Form.Select>
          </Form.Group>

          <div className="button-group">
            <Button variant="primary" type="submit">
              Create Task
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default CreateTask;
