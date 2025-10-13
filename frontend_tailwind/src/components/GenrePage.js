import { useEffect, useState } from "react";
import placeholderImage from "../placeholder.svg";

/**
 * GenrePage Component - Displays albums filtered by a specific genre
 * 
 * Features:
 * - Shows all albums belonging to a specific genre
 * - Provides album grid layout with covers and details
 * - Includes quick add-to-cart functionality
 * - Allows navigation to album details and artist pages
 * - Handles loading states and empty genre scenarios
 * 
 * @param {string} genreName - The name of the genre to display albums for
 * @param {function} onAlbumClick - Callback function to navigate to album detail
 * @param {function} onArtistClick - Callback function to navigate to artist page
 * @param {function} onBack - Callback function to navigate back to main view
 * @param {boolean} isLoggedIn - Whether the user is authenticated
 * @param {function} onCartUpdate - Callback function to refresh cart count after additions
 */
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

  /**
   * Adds an album to the user's shopping cart
   * Provides visual feedback and prevents event bubbling
   * @param {string} albumId - The ID of the album to add to cart
   * @param {Event} e - The click event (to prevent bubbling and provide feedback)
   */
  const addToCart = async (albumId, e) => {
    e.stopPropagation(); // Prevent album click navigation

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
        const data = await response.json();
        console.log("Genre page add to cart response:", data);
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

  /**
   * Fetches all albums and filters them by the current genre
   * Updates loading state and handles API errors
   */
  const fetchGenreAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/album`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const allAlbums = data.albums || [];

      // Filter albums by the selected genre name
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
    <div className="px-6 pb-8 min-h-screen max-md:px-4 max-md:pb-4" style={{background: 'linear-gradient(180deg, rgba(18, 18, 18, 0.6) 0%, #121212 100%)'}}>
      <div className="py-8 flex flex-col gap-2 max-md:py-6">
        <button 
          className="bg-transparent border-none text-[#b3b3b3] text-sm font-semibold cursor-pointer flex items-center gap-2 py-2 px-0 transition-colors duration-200 self-start uppercase tracking-wider hover:text-white" 
          onClick={onBack}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
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
        <h1 className="text-white text-6xl font-black m-0 tracking-tight leading-none max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">{genreName}</h1>
        <p className="text-[#b3b3b3] text-base font-normal mt-2 mb-0">{albums.length} albums</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
          <div className="w-[60px] h-[60px] border-[3px] border-[#333] border-t-[#1db954] rounded-full animate-spin"></div>
          <p className="text-[#b3b3b3] text-lg font-normal animate-pulse">Loading {genreName} albums...</p>
        </div>
      ) : albums.length === 0 ? (
        <p className="text-[#b3b3b3] text-xl text-center mt-12 font-normal">No albums found in this genre</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6 p-2 max-xl:gap-5 max-md:gap-4 max-sm:gap-3">
          {albums.map((album) => (
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
                    <h3 className="text-white text-base font-bold m-0 mb-1 leading-tight" title={album.title}>
                      {album.title}
                    </h3>
                    <p
                      className="text-[#b3b3b3] text-sm font-normal m-0 leading-normal transition-colors duration-200 cursor-pointer hover:text-white hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArtistClick && onArtistClick(album.artist?.id);
                      }}
                      style={{ cursor: onArtistClick ? "pointer" : "default" }}
                      title={album.artist?.name}
                    >
                      {album.artist?.name || "Unknown Artist"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="text-[#1db954] font-bold text-base">${album.price}</div>
                  {isLoggedIn && (
                    <button
                      className="bg-transparent border-none text-[#b3b3b3] w-8 h-8 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center p-0 hover:bg-[#1a1a1a] hover:text-[#1db954] hover:scale-110"
                      onClick={(e) => addToCart(album.id, e)}
                      title="Add to Cart"
                    >
                      <svg
                        className="w-[18px] h-[18px]"
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
