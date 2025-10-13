/**
 * AdminHeader Component
 *
 * Navigation header for the admin panel with menu items and admin controls.
 * Provides navigation between different management sections.
 *
 * Features:
 * - Admin info display
 * - Navigation menu for different sections
 * - Logout functionality
 * - Active section highlighting
 *
 * @param {Object} props - Component props
 * @param {Object} admin - Current admin user object
 * @param {string} currentView - Currently active view/section
 * @param {Function} onNavigate - Navigation handler function
 * @param {Function} onLogout - Logout handler function
 */

import React from "react";
import { DashboardIcon, AlbumIcon, ArtistIcon, UsersIcon } from "./Icons";

const AdminHeader = ({ admin, currentView, onNavigate, onLogout }) => {
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: DashboardIcon },
    { key: "albums", label: "Albums", icon: AlbumIcon },
    { key: "artists", label: "Artists", icon: ArtistIcon },
    { key: "users", label: "Users", icon: UsersIcon },
  ];

  return (
    <header className="bg-[#010100] px-4 md:px-8 py-4 border-b border-[#333]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo/Title */}
        <div className="text-[#c1c1c1] text-[2rem] font-bold">
          <span className="text-[#1db954]">Admin</span> Panel
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-wrap items-center gap-2 md:gap-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                currentView === item.key
                  ? "bg-[#1db954] text-black hover:bg-[#1ed760]"
                  : "text-[#c1c1c1] hover:text-white hover:bg-[#333]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Admin Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-[#c1c1c1] text-sm font-medium">
              {admin?.name || admin?.email || "Admin User"}
            </div>
            <div className="text-[#666] text-xs">Administrator</div>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#1db954] flex items-center justify-center text-black font-bold text-lg">
            {(admin?.name || admin?.email || "A")[0].toUpperCase()}
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-[#333] text-[#c1c1c1] rounded-lg text-sm font-medium hover:bg-[#444] hover:text-white transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
