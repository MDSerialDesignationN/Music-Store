import { useEffect, useState } from "react";
import "./ArtistDetail.css";
import placeholderImage from "../placeholder.svg";

const ArtistDetail = ({ artistId, onBack, onAlbumClick }) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtistDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/artist/${artistId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch artist: ${response.status}`);
      }
      const data = await response.json();
      setArtist(data.artist);
    } catch (err) {
      console.error("Error fetching artist details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artistId) {
      fetchArtistDetails();
    }
  }, [artistId]);

  if (loading) {
    return (
      <div className="artist-detail">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading artist details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="artist-detail">
        <div className="artist-detail-error">
          <p>Error loading artist: {error}</p>
          <button onClick={onBack} className="back-button">
            <span className="back-button-icon">←</span>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="artist-detail">
        <div className="artist-detail-error">
          <p>Artist not found</p>
          <button onClick={onBack} className="back-button">
            <span className="back-button-icon">←</span>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="artist-detail">
      <button onClick={onBack} className="back-button">
        <span className="back-button-icon">←</span>
        Back to Home
      </button>

      <div className="artist-header">
        <img
          className="artist-image-large"
          src={placeholderImage}
          alt={`${artist.name} profile`}
        />
        <div className="artist-info">
          <h1 className="artist-name-large">{artist.name}</h1>
          <p className="artist-details">
            Country: {artist.country} | Albums: {artist.albumCount}
          </p>
        </div>
      </div>

      <div className="albums-section">
        <h3 className="albums-title">Albums ({artist.albums?.length || 0})</h3>
        {!artist.albums || artist.albums.length === 0 ? (
          <p className="no-albums">No albums available for this artist.</p>
        ) : (
          <div className="artist-albums-grid">
            {artist.albums.map((album) => (
              <div
                key={album._id}
                className="artist-album-card"
                onClick={() => onAlbumClick && onAlbumClick(album._id)}
                style={{ cursor: onAlbumClick ? "pointer" : "default" }}
              >
                <img
                  className="artist-album-image"
                  src={placeholderImage}
                  alt={`${album.title} album cover`}
                />
                <div className="artist-album-info">
                  <h4 className="artist-album-title">{album.title}</h4>
                  <p className="artist-album-year">{album.release_year}</p>
                  <p className="artist-album-genre">
                    {album.genre?.name || "Unknown Genre"}
                  </p>
                  <p className="artist-album-tracks">
                    {album.trackCount} tracks
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;
