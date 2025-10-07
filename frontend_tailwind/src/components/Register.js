import { useState } from "react";

/**
 * Register Component - User registration form
 *
 * Features:
 * - Collects username, email, password, and password confirmation
 * - Validates password length and confirmation matching
 * - Handles registration API calls with error handling
 * - Provides navigation to login form and back to main view
 * - Shows loading states during registration process
 *
 * @param {function} onRegister - Callback function called after successful registration
 * @param {function} onSwitchToLogin - Callback function to switch to login form
 * @param {function} onBack - Callback function to navigate back to main view
 */
const Register = ({ onRegister, onSwitchToLogin, onBack }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
   * Validates the registration form data
   * Checks password confirmation matching and minimum length
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  /**
   * Handles form submission for user registration
   * Validates form, sends registration request to backend
   * Calls onRegister callback on success
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onRegister(data.user); // Pass the user object from the response
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed");
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
            Create Account
          </h1>
          <p className="text-[#b3b3b3] text-[1.1em] m-0">
            Join the music community
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
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="bg-[#2a2a2a] border-2 border-[#2a2a2a] rounded-[12px] p-3 text-white text-base transition-all duration-300 outline-none placeholder-[#888] focus:border-[#1db954] focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)] focus:bg-[#333] hover:border-[#444]"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-white text-sm font-semibold uppercase tracking-[0.5px]"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-[#2a2a2a] border-2 border-[#2a2a2a] rounded-[12px] p-3 text-white text-base transition-all duration-300 outline-none placeholder-[#888] focus:border-[#1db954] focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)] focus:bg-[#333] hover:border-[#444]"
              placeholder="Enter your email"
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
              className="bg-[#2a2a2a] border-2 border-[#2a2a2a] rounded-[12px] p-3 text-white text-base transition-all duration-300 outline-none placeholder-[#888] focus:border-[#1db954] focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)] focus:bg-[#333] hover:border-[#444]"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-white text-sm font-semibold uppercase tracking-[0.5px]"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="bg-[#2a2a2a] border-2 border-[#2a2a2a] rounded-[12px] p-3 text-white text-base transition-all duration-300 outline-none placeholder-[#888] focus:border-[#1db954] focus:shadow-[0_0_0_3px_rgba(29,185,84,0.1)] focus:bg-[#333] hover:border-[#444]"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white border-none rounded-[12px] p-3 text-[1.1em] font-semibold cursor-pointer transition-all duration-300 mt-[10px] uppercase tracking-[0.5px] relative overflow-hidden flex items-center justify-center min-h-[56px] hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:transform-none disabled:hover:shadow-none"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-spin"></div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-[30px]">
          <p className="text-[#b3b3b3] m-0">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="bg-none border-none text-[#1db954] cursor-pointer font-semibold underline transition-colors duration-300 hover:text-[#1ed760]"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
