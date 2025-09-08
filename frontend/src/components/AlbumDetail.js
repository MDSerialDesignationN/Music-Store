import { useEffect, useState } from "react";
import "./AlbumDetail.css";
import placeholderImage from "../placeholder.svg";

const AlbumDetail = ({
  albumId,
  onBack,
  onArtistClick,
  isLoggedIn,
  onCartUpdate,
}) => {
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchAlbumDetails = async () => {
    try {
      const albumResponse = await fetch(`/api/album/${albumId}`);
      if (!albumResponse.ok) {
        throw new Error(`Failed to fetch album: ${albumResponse.status}`);
      }
      const albumData = await albumResponse.json();
      setAlbum(albumData.album);

      const tracksResponse = await fetch(`/api/track/album/${albumId}`);
      if (tracksResponse.ok) {
        const tracksData = await tracksResponse.json();
        setTracks(tracksData.tracks || []);
      } else {
        setTracks([]);
      }
    } catch (err) {
      console.error("Error fetching album details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (albumId) {
      fetchAlbumDetails();
    }
  }, [albumId]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const addToCart = async () => {
    if (!isLoggedIn || !album) return;

    setAddingToCart(true);
    try {
      const response = await fetch("/api/cart/add", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ albumId: album._id, quantity: 1 }),
      });

      if (response.ok) {
        alert(`"${album.title}" has been added to your cart!`);
        if (onCartUpdate) {
          onCartUpdate();
        }
      } else {
        alert("Failed to add album to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error adding album to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <div className="album-detail-loading">Loading album details...</div>;
  }

  if (error) {
    return (
      <div className="album-detail-error">
        <p>Error loading album: {error}</p>
        <button onClick={onBack} className="back-button">
          <span className="back-button-icon">←</span>
          Back to Home
        </button>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="album-detail-error">
        <p>Album not found</p>
        <button onClick={onBack} className="back-button">
          <span className="back-button-icon">←</span>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="album-detail">
      <button onClick={onBack} className="back-button">
        <span className="back-button-icon">←</span>
        Back to Home
      </button>

      <div className="album-header">
        <img
          className="album-cover-large"
          src={placeholderImage}
          alt={`${album.title} album cover`}
        />
        <div className="album-info">
          <h1 className="album-title-large">{album.title}</h1>
          <h2
            className="album-artist-large clickable-artist"
            onClick={() => onArtistClick && onArtistClick(album.artist?._id)}
            style={{ cursor: onArtistClick ? "pointer" : "default" }}
          >
            by {album.artist?.name || "Unknown Artist"}
          </h2>
          <p className="album-details">
            Released: {album.release_year} | Genre:{" "}
            {album.genre?.name || "Unknown"} | Country:{" "}
            {album.artist?.country || "Unknown"}
          </p>
          {isLoggedIn && (
            <button
              className="add-to-cart-button"
              onClick={addToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>

      <div className="tracks-section">
        <h3 className="tracks-title">Tracks ({tracks.length})</h3>
        {tracks.length === 0 ? (
          <p className="no-tracks">No tracks available for this album.</p>
        ) : (
          <div className="tracks-list">
            {tracks.map((track, index) => (
              <div key={track._id} className="track-item">
                <span className="track-number">{index + 1}</span>
                <span className="track-title">{track.title}</span>
                <span className="track-duration">
                  {formatDuration(track.duration_seconds)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetail;
