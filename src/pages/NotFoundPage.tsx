import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NotFoundPage() {
  return (
    <div>
      <Navbar />
      
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="mb-4">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="h4 mb-3 text-muted">Page Not Found</h2>
            <p className="lead mb-4 text-secondary">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="d-grid gap-2 d-md-block">
            <Link 
              to="/" 
              className="btn btn-primary btn-lg px-4 me-md-2"
            >
              <i className="bi bi-house-fill me-2"></i>
              Go Home
            </Link>
            <button 
              className="btn btn-outline-secondary btn-lg px-4" 
              onClick={() => window.history.back()}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Go Back
            </button>
          </div>
          
          <div className="mt-5">
            <small className="text-muted">
              If you believe this is an error, please contact support.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
