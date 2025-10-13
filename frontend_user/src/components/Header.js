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
    <header className="bg-[#010100] px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 flex-wrap">
      <div className="text-[#c1c1c1] text-[2rem] font-bold order-0">
        Music Store
      </div>
      {/* Search functionality for finding albums, artists, and genres */}
      <div className="flex-1 max-w-[400px] mx-0 md:mx-8 w-full md:w-auto order-1">
        <input
          type="text"
          placeholder="Search albums, artists, genres..."
          value={searchTerm}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full px-5 py-3 border-2 border-[#333] rounded-full bg-[#1a1a1a] text-white text-base outline-none transition-all duration-300 placeholder-[#888] focus:border-[#1db954] focus:shadow-[0_0_0_2px_rgba(29,185,84,0.2)]"
        />
      </div>
      <div className="flex items-center gap-4 text-[#eeeeee] order-2">
        {isCheckingSession ? (
          <div className="w-[100px] h-10">
            {/* Show nothing while checking session to prevent UI flash */}
          </div>
        ) : isLoggedIn ? (
          // Authenticated user interface
          <>
            {/* Shopping cart button with item count badge */}
            <button
              className="relative bg-transparent border-2 border-[#1db954] text-[#1db954] px-3 py-2 rounded-[50px] cursor-pointer transition-all duration-300 text-lg flex items-center justify-center hover:bg-[#1db954] hover:text-white hover:-translate-y-[1px]"
              onClick={onShowCart}
            >
              🛒
              {cartItemCount > 0 && (
                <span className="absolute top-[-8px] right-[-8px] bg-[#ff6b6b] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
            {/* User avatar showing first letter of username */}
            <div className="w-8 h-8 rounded-full bg-[#00adb5] flex items-center justify-center font-bold text-white">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <span>{user?.username || "User"}</span>
            <button
              className="px-5 py-2.5 rounded-[50px] font-semibold border-none text-white cursor-pointer transition-all duration-300 uppercase tracking-[0.5px] text-sm bg-[#ff6b6b] hover:bg-[#ff5252] hover:-translate-y-[1px]"
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          // Guest user interface
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              className="px-5 py-2.5 rounded-[50px] font-semibold border-2 border-[#1db954] text-[#1db954] bg-transparent cursor-pointer transition-all duration-300 uppercase tracking-[0.5px] text-sm hover:bg-[#1db954] hover:text-white hover:-translate-y-[1px]"
              onClick={onShowLogin}
            >
              Sign In
            </button>
            <button
              className="px-5 py-2.5 rounded-[50px] font-semibold border-none text-white cursor-pointer transition-all duration-300 uppercase tracking-[0.5px] text-sm bg-gradient-to-r from-[#1db954] to-[#1ed760] hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-[1px] hover:shadow-[0_4px_15px_rgba(29,185,84,0.3)]"
              onClick={onShowRegister}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
