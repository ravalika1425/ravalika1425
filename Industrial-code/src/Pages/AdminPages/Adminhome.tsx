import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from '@mui/material';
import styles from '../styles/AdminHomes.module.css';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const Adminhome = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSignOut = () => {
    if (auth && auth.logout) {
      auth.logout();
    }
    navigate('/');
  };

  return (
    // <>
    //    <Navbar bg="dark" data-bs-theme="dark">

    //     <Nav className="me-auto">
    //       <Link to="/adminhome/properties" className="nav-link">Properties</Link>
    //       <Link to="/adminhome/events" className="nav-link">Events</Link>
    //       <Link to="/adminhome/users" className="nav-link">Users</Link>
    //     </Nav>
    //     <p style={{ position : 'sticky' }}>Admin Home page</p>

    //     <Button variant="contained" color="primary" className={styles.buttondev} onClick={handleSignOut}>Sign Out</Button>           
    //   </Navbar>        
    //   <Outlet />
    // </>


    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/adminhome">Admin Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/adminhome/properties">Properties</Nav.Link>
            <Nav.Link as={Link} to="/adminhome/events">Events</Nav.Link>
            <Nav.Link as={Link} to="/adminhome/users">Users</Nav.Link>
          </Nav>

          <Button variant="contained" color="primary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Navbar>
      <Outlet />
    </>
  );
}

export default Adminhome;
