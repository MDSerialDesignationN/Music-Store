/**
 * Admin Panel - Main Application Component
 *
 * Central admin dashboard for managing Music Store content and users.
 * Provides navigation between different management sections.
 *
 * Key Features:
 * - Item management (albums, artists, tracks)
 * - User management and administration
 * - Dashboard overview with statistics
 * - Admin authentication and session management
 */

import React, { useState, useEffect } from "react";
import "./App.css";
import AdminHeader from "./components/AdminHeader";
import Dashboard from "./components/Dashboard";
import AlbumManagement from "./components/AlbumManagement";
import ArtistManagement from "./components/ArtistManagement";
import UserManagement from "./components/UserManagement";
import Login from "./components/Login";

function App() {
  // Navigation State - manages current admin view
  const [currentView, setCurrentView] = useState("dashboard");
  const [quickAction, setQuickAction] = useState(null);

  // Authentication State - manages admin login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  /**
   * Session Check Effect
   *
   * Checks on app startup if a valid admin session already exists.
   * Uses real backend session validation.
   */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/admin-session", {
          credentials: "include", // Important for session cookies
        });

        if (response.ok) {
          const data = await response.json();
          setAdmin(data.admin);
          setIsLoggedIn(true);
        } else {
          // No valid session or not admin
          setIsLoggedIn(false);
          setAdmin(null);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
        setAdmin(null);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  /**
   * Handle admin login
   */
  const handleLogin = (adminData) => {
    setAdmin(adminData);
    setIsLoggedIn(true);
  };

  /**
   * Handle admin logout
   */
  const handleLogout = async () => {
    try {
      // Call backend logout API
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state regardless of API result
      setAdmin(null);
      setIsLoggedIn(false);
      setCurrentView("dashboard");
    }
  };

  /**
   * Navigate to different admin sections
   */
  const handleNavigate = (view, action = null) => {
    setCurrentView(view);
    setQuickAction(action);

    // Reset quick action after a short delay to allow component to mount with the prop
    if (action) {
      setTimeout(() => setQuickAction(null), 100);
    }
  };

  // Show loading spinner while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#131213] flex items-center justify-center">
        <div className="w-[60px] h-[60px] border-[3px] border-[#333] border-t-[#1db954] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#131213]">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Render current view based on navigation state
  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "albums":
        return <AlbumManagement openAddForm={quickAction === "add"} />;
      case "artists":
        return <ArtistManagement openAddForm={quickAction === "add"} />;
      case "users":
        return <UserManagement />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#131213]">
      <AdminHeader
        admin={admin}
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <main>{renderCurrentView()}</main>
    </div>
  );
}

export default App;
