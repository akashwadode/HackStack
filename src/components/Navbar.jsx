// src/components/Navbar.jsx
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export default function AppNavbar() {
  return (
    <Navbar className="custom-navbar" expand="lg">
      <Container className="navbar-container">
        <Link to="/dashboard" className="navbar-brand-title">HackStack</Link>

        {/* <div className="profile-icon">
          <i className="fas fa-user-circle"></i>
        </div> */}
      </Container>
    </Navbar>
  );
}
 