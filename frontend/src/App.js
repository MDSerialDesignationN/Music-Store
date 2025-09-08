import logo from "./logo.svg";
import "./App.css";
import AlbumList from "./components/AlbumList";
import AlbumDetail from "./components/AlbumDetail";
import ArtistDetail from "./components/ArtistDetail";
import GenrePage from "./components/GenrePage";
import OrderHistory from "./components/OrderHistory";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import { useState, useEffect } from "react";
import Header from "./components/Header";

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUser(data.user);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleAlbumClick = (albumId) => {
    setSelectedAlbumId(albumId);
    setSelectedArtistId(null);
    setSearchTerm(""); // Clear search when navigating to album detail
    setCurrentView("albumDetail");
  };

  const handleArtistClick = (artistId) => {
    setSelectedArtistId(artistId);
    setSelectedAlbumId(null);
    setSearchTerm(""); // Clear search when navigating to artist detail
    setCurrentView("artistDetail");
  };

  const handleGenreClick = (genreName) => {
    console.log("handleGenreClick called with:", genreName);
    setSelectedGenre(genreName);
    setSelectedAlbumId(null);
    setSelectedArtistId(null);
    setSearchTerm(""); // Clear search when navigating to genre page
    setCurrentView("genrePage");
    console.log("View changed to genrePage");
  };

  const handleBackToHome = () => {
    setSelectedAlbumId(null);
    setSelectedArtistId(null);
    setSelectedGenre(null);
    setCurrentView("home");
  };

  const handleShowLogin = () => {
    setSearchTerm(""); // Clear search when navigating to login
    setCurrentView("login");
  };

  const handleShowRegister = () => {
    setSearchTerm(""); // Clear search when navigating to register
    setCurrentView("register");
  };

  const handleShowCart = () => {
    setSearchTerm(""); // Clear search when navigating to cart
    setCurrentView("cart");
  };

  const handleShowOrderHistory = () => {
    setSearchTerm(""); // Clear search when navigating to order history
    setCurrentView("orderHistory");
  };

  const updateCartCount = async () => {
    if (!isLoggedIn) {
      setCartItemCount(0);
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const count = data.cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartItemCount(count);
      } else {
        setCartItemCount(0);
      }
    } catch (err) {
      setCartItemCount(0);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        alert("Order placed successfully!");
        setCartItemCount(0);
        setCurrentView("home");
      } else {
        alert("Failed to place order");
      }
    } catch (err) {
      alert("Error placing order");
    }
  };

  // Update cart count when user logs in/out
  useEffect(() => {
    if (isLoggedIn) {
      updateCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [isLoggedIn]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setCurrentView("home");
  };

  const handleRegister = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setCurrentView("home");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logout successful");
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state, even if server logout fails
      setIsLoggedIn(false);
      setUser(null);
      setCurrentView("home");
    }
  };

  const renderCurrentView = () => {
    console.log("Current view:", currentView);
    switch (currentView) {
      case "home":
        return (
          <AlbumList
            onAlbumClick={handleAlbumClick}
            onArtistClick={handleArtistClick}
            onGenreClick={handleGenreClick}
            isLoggedIn={isLoggedIn}
            onCartUpdate={updateCartCount}
            searchTerm={searchTerm}
          />
        );
      case "albumDetail":
        return (
          <AlbumDetail
            albumId={selectedAlbumId}
            onBack={handleBackToHome}
            onArtistClick={handleArtistClick}
            isLoggedIn={isLoggedIn}
            onCartUpdate={updateCartCount}
          />
        );
      case "artistDetail":
        return (
          <ArtistDetail
            artistId={selectedArtistId}
            onBack={handleBackToHome}
            onAlbumClick={handleAlbumClick}
          />
        );
      case "genrePage":
        return (
          <GenrePage
            genreName={selectedGenre}
            onAlbumClick={handleAlbumClick}
            onArtistClick={handleArtistClick}
            onBack={handleBackToHome}
            isLoggedIn={isLoggedIn}
            onCartUpdate={updateCartCount}
          />
        );
      case "login":
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={handleShowRegister}
            onBack={handleBackToHome}
          />
        );
      case "register":
        return (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={handleShowLogin}
            onBack={handleBackToHome}
          />
        );
      case "cart":
        return (
          <Cart
            onBack={handleBackToHome}
            onCheckout={handleCheckout}
            onViewOrders={handleShowOrderHistory}
          />
        );
      case "orderHistory":
        return <OrderHistory onBack={handleShowCart} />;
      default:
        return (
          <AlbumList
            onAlbumClick={handleAlbumClick}
            onArtistClick={handleArtistClick}
            onGenreClick={handleGenreClick}
            isLoggedIn={isLoggedIn}
            onCartUpdate={updateCartCount}
            searchTerm={searchTerm}
          />
        );
    }
  };

  return (
    <div className="App">
      <Header
        user={user}
        isLoggedIn={isLoggedIn}
        isCheckingSession={isCheckingSession}
        onLogout={handleLogout}
        onNavigate={setCurrentView}
        onShowLogin={handleShowLogin}
        onShowRegister={handleShowRegister}
        onShowCart={handleShowCart}
        cartItemCount={cartItemCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <div className="app-container">
        {/* <Navigation 
          currentView={currentView} 
          onNavigate={setCurrentView}
          isLoggedIn={isLoggedIn}
          user={user}
        /> */}
        <main className="main-content">{renderCurrentView()}</main>
      </div>
    </div>
  );
}

export default App;
