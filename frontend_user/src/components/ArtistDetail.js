import { useEffect, useState } from "react";
import placeholderImage from "../placeholder.svg";

/**
 * ArtistDetail Component - Displays detailed information about a specific artist
 *
 * Features:
 * - Shows artist name, bio, and profile image
 * - Displays complete discography with album covers
 * - Provides navigation to individual albums
 * - Includes back navigation to main view
 * - Handles loading states and error conditions
 *
 * @param {string} artistId - The ID of the artist to display
 * @param {function} onBack - Callback function to navigate back to previous view
 * @param {function} onAlbumClick - Callback function to navigate to album detail
 */
const ArtistDetail = ({ artistId, onBack, onAlbumClick }) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches detailed artist information including albums from the backend
   * Updates loading states and handles errors appropriately
   */
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
      <div className="max-w-[1200px] mx-auto p-5 bg-[#131213]">
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <div className="w-[50px] h-[50px] border-4 border-[#333] border-t-[#1db954] rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium animate-pulse">Loading artist details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto p-5 bg-[#131213]">
        <div className="text-center py-10 px-5 text-xl text-[#ff6b6b]">
          <p>Error loading artist: {error}</p>
          <button 
            onClick={onBack} 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white border-none py-3 px-6 rounded-full cursor-pointer text-sm font-semibold mb-8 transition-all duration-300 shadow-[0_4px_15px_rgba(29,185,84,0.3)] uppercase tracking-[0.5px] relative overflow-hidden hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(29,185,84,0.3)] before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.2)] before:to-transparent before:transition-[left] before:duration-500 hover:before:left-full"
          >
            <span className="text-base transition-transform duration-300 hover:-translate-x-0.5">←</span>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="max-w-[1200px] mx-auto p-5 bg-[#131213]">
        <div className="text-center py-10 px-5 text-xl text-[#ff6b6b]">
          <p>Artist not found</p>
          <button 
            onClick={onBack} 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white border-none py-3 px-6 rounded-full cursor-pointer text-sm font-semibold mb-8 transition-all duration-300 shadow-[0_4px_15px_rgba(29,185,84,0.3)] uppercase tracking-[0.5px] relative overflow-hidden hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(29,185,84,0.3)] before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.2)] before:to-transparent before:transition-[left] before:duration-500 hover:before:left-full"
          >
            <span className="text-base transition-transform duration-300 hover:-translate-x-0.5">←</span>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-5 bg-[#131213]">
      <button 
        onClick={onBack} 
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1db954] to-[#1ed760] text-white border-none py-3 px-6 rounded-full cursor-pointer text-sm font-semibold mb-8 transition-all duration-300 shadow-[0_4px_15px_rgba(29,185,84,0.3)] uppercase tracking-[0.5px] relative overflow-hidden hover:bg-gradient-to-r hover:from-[#1ed760] hover:to-[#22e065] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(29,185,84,0.4)] active:translate-y-0 active:shadow-[0_2px_10px_rgba(29,185,84,0.3)] before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.2)] before:to-transparent before:transition-[left] before:duration-500 hover:before:left-full"
      >
        <span className="text-base transition-transform duration-300">←</span>
        Back to Home
      </button>

      <div className="flex gap-8 mb-10 p-5 bg-[#1f1f1f] rounded-[10px] max-md:flex-col max-md:text-center">
        <img
          className="w-[250px] h-[250px] object-cover rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.2)] max-md:w-[200px] max-md:h-[200px] max-md:mx-auto"
          src={placeholderImage}
          alt={`${artist.name} profile`}
        />
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-5xl m-0 mb-4 text-white font-bold max-md:text-[2.2em]">{artist.name}</h1>
          <p className="text-xl text-[#b3b3b3] m-0">
            Country: {artist.country} | Albums: {artist.albumCount}
          </p>
        </div>
      </div>

      <div className="bg-[#1f1f1f] rounded-[10px] p-5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        <h3 className="text-2xl m-0 mb-5 text-white border-b-2 border-[#1db954] pb-2.5">Albums ({artist.albums?.length || 0})</h3>
        {!artist.albums || artist.albums.length === 0 ? (
          <p className="text-center text-[#b3b3b3] italic p-5">No albums available for this artist.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 max-md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] max-md:gap-4">
            {artist.albums.map((album) => (
              <div
                key={album.id}
                className="bg-[#2a2a2a] rounded-[10px] p-4 transition-all duration-300 cursor-pointer hover:bg-[#3a3a3a] hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                onClick={() => onAlbumClick && onAlbumClick(album.id)}
                style={{ cursor: onAlbumClick ? "pointer" : "default" }}
              >
                <img
                  className="w-full aspect-square object-cover rounded-lg mb-2.5"
                  src={placeholderImage}
                  alt={`${album.title} album cover`}
                />
                <div className="text-center">
                  <h4 className="text-lg text-white m-0 mb-1.5 font-bold">{album.title}</h4>
                  <p className="text-sm text-[#b3b3b3] m-0 mb-1.5">{album.release_year}</p>
                  <p className="text-[0.85em] text-[#1db954] m-0 mb-1.5 font-medium">
                    {album.genre?.name || "Unknown Genre"}
                  </p>
                  <p className="text-xs text-[#888] m-0">
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
