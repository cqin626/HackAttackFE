const LoginPage = () => {
  const backendURL = "http://localhost:8080";

  const handleLoginRedirect = () => {
    // Redirect user to your backend's Google OAuth URL
    window.location.href = `${backendURL}/auth/google`;
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h1 className="h3 fw-bold text-dark mb-2">Welcome back</h1>
                  <p className="text-muted">Please enter your details</p>
                </div>

                {/* Google Sign-in Button */}
                <button
                  onClick={handleLoginRedirect}
                  className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center mb-4 py-3"
                  style={{ borderColor: '#dee2e6' }}
                >
                  <svg className="me-3" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>

                {/* Divider */}
                <div className="position-relative mb-4">
                  <hr className="bg-secondary"/>
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small text-uppercase">
                    or
                  </span>
                </div>

                {/* Email Input */}
                <div className="mb-3">
                  <label className="form-label fw-medium text-dark">Email address</label>
                  <input
                    type="email"
                    className="form-control py-3"
                    disabled
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <label className="form-label fw-medium text-dark">Password</label>
                  <input
                    type="password"
                    className="form-control py-3"
                    disabled
                    style={{ backgroundColor: '#f8f9fa' }}
                  />
                </div>

                {/* Remember me and Forgot password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      disabled
                    />
                    <label className="form-check-label text-dark" htmlFor="rememberMe">
                      Remember for 30 days
                    </label>
                  </div>
                  <a href="#" className="text-primary text-decoration-none">
                    Forgot password
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  className="btn btn-dark w-100 py-3 fw-medium mb-4"
                  disabled
                  style={{ opacity: 0.5 }}
                >
                  Sign in
                </button>

                {/* Sign up link */}
                <div className="text-center">
                  <span className="text-muted">Don't have an account? </span>
                  <a href="#" className="text-primary text-decoration-none fw-medium">
                    Sign up
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;