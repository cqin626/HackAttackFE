import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Top navigation bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <span className="fw-bold text-primary">ATS</span>
            <span className="ms-2 fw-normal text-secondary">Applicant Tracking System</span>
          </Link>
          
          <button 
            className="btn btn-sm btn-outline-primary d-flex align-items-center d-lg-none" 
            onClick={toggleSidebar}
          >
            <i className="bi bi-list me-1"></i>
            Menu
          </button>

          {/* Desktop navigation */}
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar */}
      <div className={`sidebar bg-white shadow-lg ${isOpen ? "open" : ""}`} style={{
        width: "250px", 
        height: "100%", 
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: 1000,
        padding: "1.5rem 1rem", 
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease-in-out",
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold text-primary">ATS Menu</h5>
          <button 
            className="btn btn-sm text-secondary" 
            onClick={toggleSidebar}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link
              className="nav-link d-flex align-items-center"
              to="/"
              onClick={toggleSidebar}
            >
              <i className="bi bi-house me-2"></i>
              Home
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              className="nav-link d-flex align-items-center"
              to="/about"
              onClick={toggleSidebar}
            >
              <i className="bi bi-info-circle me-2"></i>
              About
            </Link>
          </li>
          {/* New Jobs Nav Link */}
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/jobs"
              onClick={toggleSidebar}
            >
              Jobs
            </Link>
          </li>
        </ul>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          onClick={toggleSidebar}
          style={{ zIndex: 999 }}
        ></div>
      )}
    </>
  );
};

export default Navbar;