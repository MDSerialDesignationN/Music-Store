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
    <div className="bg-[#131213] flex items-center justify-center p-5">
      <div className="bg-[#1f1f1f] rounded-[20px] p-10 w-full max-w-[450px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white border-none px-6 py-3 rounded-[50px] cursor-pointer text-sm font-semibold mb-[30px] transition-all duration-300 shadow-[0_4px_15px_rgba(29,185,84,0.3)] uppercase tracking-[0.5px] relative overflow-hidden hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(29,185,84,0.3)]"
        >
          <span className="text-base transition-transform duration-300 hover:-translate-x-[2px]">
            ←
          </span>
          Back to Home
        </button>

        <div className="text-center mb-10">
          <h1 className="text-[2.5em] text-white m-0 mb-[10px] font-bold">
            Welcome Back
          </h1>
          <p className="text-[#b3b3b3] text-[1.1em] m-0">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {error && (
            <div className="bg-[rgba(255,107,107,0.1)] border border-[#ff6b6b] rounded-lg px-4 py-3 text-[#ff6b6b] text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-white text-sm font-semibold uppercase tracking-[0.5px]"
            >
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="bg-[#2a2a2a] border-2 border-[#2a2a2a] rounded-[12px] px-3 py-3 text-white text-base transition-all duration-300 outline-none placeholder-[#888] focus:border-[#1db954] focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)] focus:bg-[#333] hover:border-[#444]"
              placeholder="Enter your username or email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-white text-sm font-semibold uppercase tracking-[0.5px]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-[#2a2a2a] border-2 border-[#2a2a2a] rounded-[12px] px-3 py-3 text-white text-base transition-all duration-300 outline-none placeholder-[#888] focus:border-[#1db954] focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)] focus:bg-[#333] hover:border-[#444]"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white border-none rounded-[12px] px-6 py-3 text-[1.1em] font-semibold cursor-pointer transition-all duration-300 mt-[10px] uppercase tracking-[0.5px] relative overflow-hidden flex items-center justify-center min-h-[56px] hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:transform-none disabled:hover:shadow-none"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-[30px]">
          <p className="text-[#b3b3b3] m-0">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="bg-none border-none text-[#1db954] cursor-pointer font-semibold underline transition-colors duration-300 hover:text-[#1ed760]"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
