/**
 * Login Component
 * 
 * Provides user authentication form for logging into the Music Store.
 * Handles login form submission, validation, and error display.
 * 
 * Features:
 * - Login form with username/email and password fields
 * - Form validation and error handling
 * - Loading states during authentication
 * - Navigation to registration form
 * - Session cookie management
 * 
 * @param {Function} onLogin - Success handler called with user data
 * @param {Function} onSwitchToRegister - Handler to switch to registration form
 * @param {Function} onBack - Handler to return to previous view
 */

import { useState } from "react";
import "./Auth.css";

const Login = ({ onLogin, onSwitchToRegister, onBack }) => {
  // Form state management
  const [formData, setFormData] = useState({
    username: "", // Can be username or email
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles login form submission
   * Sends credentials to backend and manages response/errors
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for session cookies
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.user); // Pass the user object from the response
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button onClick={onBack} className="back-button">
          <span className="back-button-icon">←</span>
          Back to Home
        </button>

        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your username or email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner-small"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-switch-text">
            Don't have an account?{" "}
            <button onClick={onSwitchToRegister} className="auth-switch-button">
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
