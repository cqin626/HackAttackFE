// pages/About.tsx
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="mb-4 fw-bold text-primary">About Our ATS</h2>
            <p className="lead text-secondary">
              Our Applicant Tracking System (ATS) simplifies and streamlines the hiring process.
              Built with modern web technologies, it helps recruiters post jobs, manage applications,
              and track hiring progress—all in one place.
            </p>
            <hr />
            <h4 className="mt-4 text-dark">Key Features:</h4>
            <ul className="list-unstyled ps-3">
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Post and manage job listings
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Track candidates efficiently
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Responsive UI for seamless usage
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Built with React, Bootstrap, and TypeScript
              </li>
            </ul>
            <p className="mt-4 text-secondary">
              This project is part of an initiative to demonstrate modern frontend development practices.
              Feel free to explore the source code or contribute to its improvement!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
