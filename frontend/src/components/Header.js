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
            {/* Show nothing while checking session */}
          </div>
        ) : isLoggedIn ? (
          <>
            <button className="cart-button" onClick={onShowCart}>
              🛒
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </button>
            <div className="user-avatar">
              {user?.username?.[0]?.toUpperCase() || "B"}
            </div>
            <span>{user?.username || "Max Mustermann"}</span>
            <button className="logout-button" onClick={onLogout}>
              Abmelden
            </button>
          </>
        ) : (
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
