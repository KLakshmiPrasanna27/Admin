import React, { useContext } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import './Navbar.css';

function NavigationBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="/dashboard" className="navbar-brand">
          Task Manager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/projects">Projects</Nav.Link>
            {user?.role === 'admin' && (
              <Nav.Link href="/admin">Admin Panel</Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            <Navbar.Text className="navbar-user">
              Welcome, {user?.name}
            </Navbar.Text>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;