/**
 * Header Component
 * 
 * The main navigation header for the Music Store application.
 * Provides user authentication controls, search functionality, and cart access.
 * 
 * Features:
 * - User authentication status display
 * - Search bar for albums, artists, and genres
 * - Shopping cart button with item count badge
 * - User avatar and login/logout controls
 * - Responsive design for mobile and desktop
 * 
 * @param {Object} props - Component props
 * @param {Object} user - Current user object
 * @param {boolean} isLoggedIn - User authentication status
 * @param {boolean} isCheckingSession - Session validation loading state
 * @param {Function} onLogout - Logout handler function
 * @param {Function} onNavigate - Navigation handler function
 * @param {Function} onShowLogin - Show login form handler
 * @param {Function} onShowRegister - Show register form handler
 * @param {Function} onShowCart - Show cart handler
 * @param {number} cartItemCount - Number of items in cart
 * @param {string} searchTerm - Current search term
 * @param {Function} onSearchChange - Search input change handler
 */

import React from "react";
import "./Header.css";

const Header = ({
  user,
  isLoggedIn,
  isCheckingSession,
  onLogout,
  onNavigate,
  onShowLogin,
  onShowRegister,
  onShowCart,
  cartItemCount = 0,
  searchTerm = "",
  onSearchChange,
}) => {
  return (
    <header className="header">
      <div className="logo">Music Store</div>
      {/* Search functionality for finding albums, artists, and genres */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search albums, artists, genres..."
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="user-info">
        {isCheckingSession ? (
          <div className="loading-placeholder">
            {/* Show nothing while checking session to prevent UI flash */}
          </div>
        ) : isLoggedIn ? (
          // Authenticated user interface
          <>
            {/* Shopping cart button with item count badge */}
            <button className="cart-button" onClick={onShowCart}>
              🛒
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </button>
            {/* User avatar showing first letter of username */}
            <div className="user-avatar">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <span>{user?.username || "User"}</span>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          // Guest user interface
          <div className="auth-buttons">
            <button className="login-button" onClick={onShowLogin}>
              Sign In
            </button>
            <button className="register-button" onClick={onShowRegister}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
