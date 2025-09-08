import { useEffect, useState } from "react";
import "./GenrePage.css";
import placeholderImage from "../placeholder.svg";

const GenrePage = ({
  genreName,
  onAlbumClick,
  onArtistClick,
  onBack,
  isLoggedIn,
  onCartUpdate,
}) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const addToCart = async (albumId, e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      alert("Please log in to add items to cart");
      return;
    }

    try {
      const response = await fetch("/api/cart/add", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          albumId: albumId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        onCartUpdate && onCartUpdate();
        // Visual feedback
        e.target.style.background = "#1db954";
        e.target.innerHTML = `
          <svg class="cart-icon" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        setTimeout(() => {
          e.target.style.background = "";
          e.target.innerHTML = `
            <svg class="cart-icon" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.1 16.4H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13H17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
        }, 1500);
      } else if (response.status === 404) {
        // Create cart first
        await fetch("/api/cart", {
          method: "POST",
          credentials: "include",
        });
        // Retry adding to cart
        addToCart(albumId, e);
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart");
    }
  };

  const fetchGenreAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/album`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const allAlbums = data.albums || [];

      // Filter albums by genre
      const genreAlbums = allAlbums.filter(
        (album) => album.genre?.name === genreName
      );

      setAlbums(genreAlbums);
    } catch (err) {
      console.error("Error fetching genre albums:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("GenrePage mounted with genreName:", genreName);
    if (genreName) {
      fetchGenreAlbums();
    }
  }, [genreName]);

  return (
    <div className="genre-page">
      <div className="genre-page-header">
        <button className="back-button" onClick={onBack}>
          <svg className="back-icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <h1 className="genre-page-title">{genreName}</h1>
        <p className="genre-page-subtitle">{albums.length} albums</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading {genreName} albums...</p>
        </div>
      ) : albums.length === 0 ? (
        <p className="notification">No albums found in this genre</p>
      ) : (
        <div className="genre-albums-grid">
          {albums.map((album) => (
            <div key={album._id} className="album-card">
              <div className="album-card-content">
                <div
                  onClick={() => onAlbumClick && onAlbumClick(album._id)}
                  style={{ cursor: onAlbumClick ? "pointer" : "default" }}
                  className="album-clickable-area"
                >
                  <div className="album-image-container">
                    <img
                      className="album-image"
                      src={placeholderImage}
                      alt={`${album.title} album cover`}
                    />
                    <div className="play-button-overlay">
                      <svg
                        className="play-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path d="M8 5v14l11-7z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                  <div className="album-info">
                    <h3 className="album-title" title={album.title}>
                      {album.title}
                    </h3>
                    <p
                      className="album-artist clickable-artist"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArtistClick && onArtistClick(album.artist?._id);
                      }}
                      style={{ cursor: onArtistClick ? "pointer" : "default" }}
                      title={album.artist?.name}
                    >
                      {album.artist?.name || "Unknown Artist"}
                    </p>
                  </div>
                </div>
                <div className="album-actions">
                  <div className="album-price">${album.price}</div>
                  {isLoggedIn && (
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => addToCart(album._id, e)}
                      title="Add to Cart"
                    >
                      <svg
                        className="cart-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.1 16.4H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13H17Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenrePage;
