import { useEffect, useState } from "react";
import "./AlbumList.css";
import placeholderImage from "../placeholder.svg";

const AlbumList = ({
  onAlbumClick,
  onArtistClick,
  onGenreClick,
  isLoggedIn,
  onCartUpdate,
  searchTerm = "",
}) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

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
        Object.entries(groupedAlbums).map(([genreName, genreAlbums]) => {
          const displayedAlbums = genreAlbums.slice(0, 9);
          const hasMoreAlbums = genreAlbums.length > 9;

          return (
            <div key={genreName} className="genre-section">
              <div className="genre-header">
                <h2 className="genre-title">{genreName}</h2>
                {hasMoreAlbums && (
                  <button
                    className="show-all-link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Show all clicked for genre:", genreName);
                      console.log("onGenreClick function:", onGenreClick);
                      if (onGenreClick) {
                        onGenreClick(genreName);
                      } else {
                        console.error("onGenreClick is not defined!");
                      }
                    }}
                  >
                    Show all {genreAlbums.length}
                  </button>
                )}
              </div>
              <div className="albums-grid">
                {displayedAlbums.map((album) => (
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
                            {album.title.length > 18
                              ? `${album.title.slice(0, 18)}...`
                              : album.title}
                          </h3>
                          <p
                            className="album-artist clickable-artist"
                            onClick={(e) => {
                              e.stopPropagation();
                              onArtistClick && onArtistClick(album.artist?._id);
                            }}
                            style={{
                              cursor: onArtistClick ? "pointer" : "default",
                            }}
                            title={album.artist?.name}
                          >
                            {album.artist?.name.length > 22
                              ? `${album.artist?.name.slice(0, 22)}...`
                              : album.artist?.name || "Unknown Artist"}
                          </p>
                        </div>
                      </div>
                      <div className="album-actions">
                        <div className="album-price">${album.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AlbumList;
