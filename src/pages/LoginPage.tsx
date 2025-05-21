const LoginPage = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  const handleLoginRedirect = () => {
    // Redirect user to your backend's Google OAuth URL
    window.location.href = `${backendURL}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-100 px-4">
      <div className="max-w-sm w-full bg-white bg-opacity-50 p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Welcome Back</h1>
        <p className="mb-8 text-gray-600 text-lg">Sign in with your Google account to continue</p>
        {/* Use GoogleLogin purely for button UI */}
        <button
          onClick={handleLoginRedirect}
          className="flex items-center justify-center space-x-3 bg-white border border-gray-300 hover:shadow-md transition-shadow duration-300 text-gray-700 font-semibold px-8 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Sign in with Google"
        >
            <img
        src="/google-logo.png"
        alt="Google Logo"
        className="w-6 h-6"
      />
</button>

      </div>
    </div>
  );
};

export default LoginPage;
