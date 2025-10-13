/**
 * AlbumList Component
 *
 * Displays the main catalog of albums in a grid layout.
 * Provides filtering, search functionality, and quick add-to-cart options.
 *
 * Features:
 * - Grid display of albums with cover images, titles, and artist info
 * - Real-time search filtering by album title, artist name, or genre
 * - Quick add-to-cart functionality for logged-in users
 * - Click navigation to album details, artist pages, and genre pages
 * - Loading states and error handling
 * - Responsive grid layout
 *
 * @param {Function} onAlbumClick - Handler for album detail navigation
 * @param {Function} onArtistClick - Handler for artist page navigation
 * @param {Function} onGenreClick - Handler for genre page navigation
 * @param {boolean} isLoggedIn - User authentication status
 * @param {Function} onCartUpdate - Handler for cart updates
 * @param {string} searchTerm - Current search filter term
 */

import { useEffect, useState } from "react";
import placeholderImage from "../placeholder.svg";

const AlbumList = ({
  onAlbumClick,
  onArtistClick,
  onGenreClick,
  isLoggedIn,
  onCartUpdate,
  searchTerm = "",
}) => {
  // Component state for albums data and loading status
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the complete album catalog from the backend API
   * Includes error handling and loading state management
   */
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

  /**
   * Filter albums based on search term
   * Searches through album titles, artist names, and genre names
   */
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
    <div className="px-6 pb-8 min-h-screen max-md:px-4 max-md:pb-4" style={{background: 'linear-gradient(180deg, rgba(18, 18, 18, 0.6) 0%, #121212 100%)'}}>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
          <div className="w-[60px] h-[60px] border-[3px] border-[#333] border-t-[#1db954] rounded-full animate-spin"></div>
          <p className="text-[#b3b3b3] text-lg font-normal animate-pulse">Loading albums...</p>
        </div>
      ) : Object.keys(groupedAlbums).length === 0 ? (
        <p className="text-[#b3b3b3] text-xl text-center mt-12 font-normal">No albums available</p>
      ) : (
        Object.entries(groupedAlbums).map(([genreName, genreAlbums]) => {
          const displayedAlbums = genreAlbums.slice(0, 9);
          const hasMoreAlbums = genreAlbums.length > 9;

          return (
            <div key={genreName} className="mb-10">
              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-white text-2xl font-bold m-0 tracking-tight max-md:text-xl">{genreName}</h2>
                {hasMoreAlbums && (
                  <button
                    className="bg-transparent border-none text-[#b3b3b3] text-sm font-bold no-underline uppercase tracking-wider transition-colors duration-200 cursor-pointer p-0 hover:text-white hover:underline"
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6 p-2 max-xl:gap-5 max-md:gap-4 max-sm:gap-3">
                {displayedAlbums.map((album) => (
                  <div key={album.id} className="group bg-[#181818] rounded-lg p-4 transition-all duration-300 cursor-pointer relative overflow-hidden hover:bg-[#282828] hover:-translate-y-1 hover:shadow-2xl max-md:p-3 max-sm:p-2">
                    <div className="flex flex-col h-full">
                      <div
                        onClick={() => onAlbumClick && onAlbumClick(album.id)}
                        style={{ cursor: onAlbumClick ? "pointer" : "default" }}
                      >
                        <div className="relative mb-4 rounded-md overflow-hidden shadow-2xl">
                          <img
                            className="w-full h-40 object-cover block transition-transform duration-300 group-hover:scale-105 max-md:h-[140px] max-sm:h-[120px]"
                            src={placeholderImage}
                            alt={`${album.title} album cover`}
                          />
                          <div className="absolute bottom-2 right-2 bg-[#1db954] w-12 h-12 rounded-full flex items-center justify-center translate-y-2 opacity-0 transition-all duration-300 shadow-xl hover:scale-105 group-hover:translate-y-0 group-hover:opacity-100 max-sm:w-10 max-sm:h-10 max-sm:bottom-1 max-sm:right-1">
                            <svg
                              className="w-6 h-6 text-black ml-0.5 max-sm:w-5 max-sm:h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path d="M8 5v14l11-7z" fill="currentColor" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-grow mb-3">
                          <h3 className="text-white text-base font-bold m-0 mb-1 leading-tight line-clamp-1" title={album.title}>
                            {album.title.length > 18
                              ? `${album.title.slice(0, 18)}...`
                              : album.title}
                          </h3>
                          <p
                            className="text-[#b3b3b3] text-sm font-normal m-0 leading-normal transition-colors duration-200 cursor-pointer line-clamp-2 hover:text-white hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onArtistClick && onArtistClick(album.artist?.id);
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
                      <div className="flex justify-between items-center mt-auto">
                        <div className="text-[#1db954] font-bold text-base">${album.price}</div>
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
