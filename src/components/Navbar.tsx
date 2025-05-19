import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="btn m-2" onClick={toggleSidebar}>
        ☰ Menu
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h3 className="mb-4">ATS</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/"
              onClick={toggleSidebar}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link text-white"
              to="/about"
              onClick={toggleSidebar}
            >
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
