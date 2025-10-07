import { useEffect, useState } from "react";
import placeholderImage from "../placeholder.svg";

/**
 * AlbumDetail Component - Displays detailed information about a specific album
 *
 * Features:
 * - Shows album cover, title, artist, and genre information
 * - Displays complete track listing with durations
 * - Provides add-to-cart functionality for logged-in users
 * - Includes navigation back to album list and to artist page
 * - Handles loading states and error conditions
 *
 * @param {string} albumId - The ID of the album to display
 * @param {function} onBack - Callback function to navigate back to album list
 * @param {function} onArtistClick - Callback function to navigate to artist page
 * @param {boolean} isLoggedIn - Whether the user is authenticated
 * @param {function} onCartUpdate - Callback function to refresh cart count after additions
 */
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

  /**
   * Formats track duration from seconds to MM:SS format
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration string (e.g., "3:45")
   */
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  /**
   * Adds the current album to the user's shopping cart
   * Only works if user is logged in and album is loaded
   * Shows loading state during the operation
   */
  const addToCart = async () => {
    if (!isLoggedIn || !album) return;

    setAddingToCart(true);
    try {
      const response = await fetch("/api/cart/add", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ albumId: album.id, quantity: 1 }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Album add to cart response:", data);
        alert(`"${album.title}" has been added to your cart!`);
        if (onCartUpdate) {
          onCartUpdate();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || "Failed to add album to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error adding album to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 px-5 text-[1.2em] text-[#b3b3b3]">
        Loading album details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 px-5 text-[1.2em] text-[#ff6b6b]">
        <p>Error loading album: {error}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white border-none px-6 py-3 rounded-[50px] cursor-pointer text-sm font-semibold mt-4 transition-all duration-300 shadow-[0_4px_15px_rgba(29,185,84,0.3)] uppercase tracking-[0.5px] relative overflow-hidden hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(29,185,84,0.3)]"
        >
          <span className="text-base transition-transform duration-300 hover:-translate-x-[2px]">
            ←
          </span>
          Back to Home
        </button>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-10 px-5 text-[1.2em] text-[#ff6b6b]">
        <p>Album not found</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white border-none px-6 py-3 rounded-[50px] cursor-pointer text-sm font-semibold mt-4 transition-all duration-300 shadow-[0_4px_15px_rgba(29,185,84,0.3)] uppercase tracking-[0.5px] relative overflow-hidden hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(29,185,84,0.3)]"
        >
          <span className="text-base transition-transform duration-300 hover:-translate-x-[2px]">
            ←
          </span>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-5 bg-[#131213]">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white border-none px-6 py-3 rounded-[50px] cursor-pointer text-sm font-semibold mb-[30px] transition-all duration-300 shadow-[0_4px_15px_rgba(29,185,84,0.3)] uppercase tracking-[0.5px] relative overflow-hidden hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(29,185,84,0.3)]"
      >
        <span className="text-base transition-transform duration-300 hover:-translate-x-[2px]">
          ←
        </span>
        Back to Home
      </button>

      <div className="flex gap-[30px] mb-10 p-5 bg-[#1f1f1f] rounded-[10px] flex-col md:flex-row text-center md:text-left">
        <img
          className="w-[250px] h-[250px] object-cover rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] mx-auto md:mx-0 md:w-[200px] md:h-[200px]"
          src={placeholderImage}
          alt={`${album.title} album cover`}
        />
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-[2.5em] md:text-[2em] m-0 mb-[10px] text-white">
            {album.title}
          </h1>
          <h2
            className="text-[1.8em] md:text-[1.4em] m-0 mb-[15px] text-[#b3b3b3] font-normal transition-colors duration-300 hover:text-[#1db954] hover:underline"
            onClick={() => onArtistClick && onArtistClick(album.artist?.id)}
            style={{ cursor: onArtistClick ? "pointer" : "default" }}
          >
            by {album.artist?.name || "Unknown Artist"}
          </h2>
          <p className="text-[1.1em] text-[#b3b3b3] m-0 mb-5">
            Released: {album.release_year} | Genre:{" "}
            {album.genre?.name || "Unknown"} | Country:{" "}
            {album.artist?.country || "Unknown"}
          </p>
          {isLoggedIn && (
            <button
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white border-none px-7 py-[14px] rounded-[50px] cursor-pointer text-base font-semibold transition-all duration-300 shadow-[0_4px_15px_rgba(29,185,84,0.3)] uppercase tracking-[0.5px] relative overflow-hidden min-w-[140px] hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(29,185,84,0.3)] disabled:bg-[#666] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:hover:bg-[#666] disabled:hover:transform-none disabled:hover:shadow-none"
              onClick={addToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>

      <div className="bg-[#1f1f1f] rounded-[10px] p-5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <h3 className="text-[1.5em] m-0 mb-5 text-white border-b-2 border-[#1db954] pb-[10px]">
          Tracks ({tracks.length})
        </h3>
        {tracks.length === 0 ? (
          <p className="text-center text-[#b3b3b3] italic p-5">
            No tracks available for this album.
          </p>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[30px_1fr_auto] items-center p-3 md:p-[10px] bg-[#2a2a2a] rounded-lg transition-colors duration-300 hover:bg-[#3a3a3a]"
              >
                <span className="font-bold text-[#b3b3b3] text-center">
                  {index + 1}
                </span>
                <span className="text-[1.1em] text-white">{track.title}</span>
                <span className="font-mono text-[#b3b3b3] text-sm">
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
