/**
 * Admin Login Component
 *
 * Authentication form for admin users to access the admin panel.
 * Uses real backend authentication with admin privilege validation.
 *
 * Features:
 * - Username/email and password authentication
 * - Real API integration with session management
 * - Admin privilege validation
 * - Form validation and error handling
 * - Loading states
 * - Responsive design matching user frontend style
 *
 * @param {Function} onLogin - Login success handler
 */

import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for session cookies
        body: JSON.stringify({
          username: email, // Backend supports email or username
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        const adminData = {
          id: data.admin.id,
          username: data.admin.username,
          email: data.admin.email,
          isAdmin: data.admin.isAdmin,
        };
        onLogin(adminData);
      } else {
        // Login failed
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(18, 18, 18, 0.6) 0%, #121212 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[#c1c1c1] text-[3rem] font-bold mb-2">
            <span className="text-[#1db954]">Admin</span> Login
          </h1>
          <p className="text-[#b3b3b3] text-lg">
            Access the Music Store administration panel
          </p>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 bg-[#333] rounded-lg border border-[#444]">
          <h3 className="text-[#1db954] font-semibold mb-2">
            Admin Access Required
          </h3>
          <p className="text-[#c1c1c1] text-sm">
            Only users with administrator privileges can access this panel.
          </p>
          <p className="text-[#888] text-sm mt-1">
            Use your username or email to login.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-[#c1c1c1] text-sm font-medium mb-2"
            >
              Username or Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your username or email"
              className="w-full px-4 py-3 bg-[#333] border border-[#555] rounded-lg text-[#c1c1c1] placeholder-[#888] focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[#c1c1c1] text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#333] border border-[#555] rounded-lg text-[#c1c1c1] placeholder-[#888] focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-black transition-all duration-200 ${
              loading
                ? "bg-[#666] cursor-not-allowed"
                : "bg-[#1db954] hover:bg-[#1ed760] hover:shadow-green active:scale-95"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-[#888] text-sm">
          Music Store Admin Panel v1.0
        </div>
      </div>
    </div>
  );
};

export default Login;
