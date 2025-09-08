import { useEffect, useState } from "react";
import "./AlbumList.css";
import placeholderImage from "../placeholder.svg";

const AlbumList = ({
  onAlbumClick,
  onArtistClick,
  isLoggedIn,
  onCartUpdate,
  searchTerm = "",
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
        e.target.textContent = "Added! ✓";
        e.target.style.background = "#1db954";
        setTimeout(() => {
          e.target.textContent = "Add to Cart";
          e.target.style.background = "";
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

  const fetchAlbumList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/album`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("Error response:", errorData); // Debug log
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            errorData.error || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      setAlbums(data.albums || []);
    } catch (err) {
      console.error("Error fetching album list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbumList();
  }, []);

  // Filter albums based on search term
  const filteredAlbums = albums.filter((album) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      album.title?.toLowerCase().includes(searchLower) ||
      album.artist?.name?.toLowerCase().includes(searchLower) ||
      album.genre?.name?.toLowerCase().includes(searchLower)
    );
  });

  // Group albums by genre
  const groupedAlbums = filteredAlbums.reduce((groups, album) => {
    const genreName = album.genre?.name || "Unknown Genre";
    if (!groups[genreName]) {
      groups[genreName] = [];
    }
    groups[genreName].push(album);
    return groups;
  }, {});

  return (
    <div className="album-list">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading albums...</p>
        </div>
      ) : Object.keys(groupedAlbums).length === 0 ? (
        <p className="notification">No albums available</p>
      ) : (
        Object.entries(groupedAlbums).map(([genreName, genreAlbums]) => (
          <div key={genreName} className="genre-section">
            <h2 className="genre-title">{genreName}</h2>
            <div className="albums-grid">
              {genreAlbums.slice(0, 15).map((album) => (
                <div key={album._id} className="album-card">
                  <div
                    onClick={() => onAlbumClick && onAlbumClick(album._id)}
                    style={{ cursor: onAlbumClick ? "pointer" : "default" }}
                    className="album-clickable-area"
                  >
                    <img
                      className="album-image"
                      src={placeholderImage}
                      alt={`${album.title} album cover`}
                    />
                    <h3 className="album-title">
                      {album.title.length > 15
                        ? `${album.title.slice(0, 15)}...`
                        : album.title}
                    </h3>
                  </div>
                  <p
                    className="album-artist clickable-artist"
                    onClick={(e) => {
                      e.stopPropagation();
                      onArtistClick && onArtistClick(album.artist?._id);
                    }}
                    style={{ cursor: onArtistClick ? "pointer" : "default" }}
                  >
                    {album.artist?.name.length > 20
                      ? `${album.artist?.name.slice(0, 20)}...`
                      : album.artist?.name || "Unknown Artist"}
                  </p>
                  <div className="album-price">${album.price}</div>
                  {isLoggedIn && (
                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => addToCart(album._id, e)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              ))}
              {/* {genreAlbums.length > 10 && (
                <div className="more-albums-info">
                  <p>...und {genreAlbums.length - 10} weitere Alben</p>
                </div>
              )} */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AlbumList;
