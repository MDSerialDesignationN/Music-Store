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
import logo from "../Logo.png";

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
    // <header className="header">
    //   <div className="logo">Music Store</div>
    //   {/* Search functionality for finding albums, artists, and genres */}
    //   <div className="search-container">
    //     <input
    //       type="text"
    //       placeholder="Search albums, artists, genres..."
    //       value={searchTerm}
    //       onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
    //       className="search-input"
    //     />
    //   </div>
    //   <div className="user-info">
    //     {isCheckingSession ? (
    //       <div className="loading-placeholder">
    //         {/* Show nothing while checking session to prevent UI flash */}
    //       </div>
    //     ) : isLoggedIn ? (
    //       // Authenticated user interface
    //       <>
    //         {/* Shopping cart button with item count badge */}
    //         <button className="cart-button" onClick={onShowCart}>
    //           🛒
    //           {cartItemCount > 0 && (
    //             <span className="cart-badge">{cartItemCount}</span>
    //           )}
    //         </button>
    //         {/* User avatar showing first letter of username */}
    //         <div className="user-avatar">
    //           {user?.username?.[0]?.toUpperCase() || "U"}
    //         </div>
    //         <span>{user?.username || "User"}</span>
    //         <button className="logout-button" onClick={onLogout}>
    //           Logout
    //         </button>
    //       </>
    //     ) : (
    //       // Guest user interface
    //       <div className="auth-buttons">
    //         <button className="login-button" onClick={onShowLogin}>
    //           Sign In
    //         </button>
    //         <button className="register-button" onClick={onShowRegister}>
    //           Sign Up
    //         </button>
    //       </div>
    //     )}
    //   </div>
    // </header>
    <header className="p-3" style={{ backgroundColor: "#010100" }}>
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <img class="bi me-2" width="40" height="40" role="img" aria-label="Bootstrap" src={logo} alt="Logo" />

          </a>
          <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><a href="#" class="nav-link px-2 text-secondary">Home</a></li>
            <li><a class="nav-link px-2 text-white" onClick={onShowCart}>Cart</a></li>
          </ul>
          <form class="col-12 col-lg-4 mb-3 mb-lg-0 me-lg-3" role="search">
            <input type="search" class="form-control form-control-dark" placeholder="Search albums, artists, genres..."
              aria-label="Search" />
          </form>
          <div class="text-end">
            <button type="button" class="btn rounded-pill px-4 py-2 me-2 auth-button fw-bold" onClick={onShowLogin}>
              Login
            </button>
            <button type="button" class="btn rounded-pill px-4 py-2 auth-button fw-bold" onClick={onShowRegister}>Sign-up</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
