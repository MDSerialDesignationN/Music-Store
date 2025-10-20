/**
 * AlbumManagement Component
 *
 * Admin interface for managing albums in the Music Store.
 * Provides CRUD operations for album catalog management.
 *
 * Features:
 * - View all albums in a table/grid format
 * - Add new albums with form validation
 * - Edit existing album information
 * - Delete albums with confirmation
 * - Search and filter albums
 * - Integration with backend APIs
 */

import React, { useState, useEffect } from "react";
import { PlusIcon, SearchIcon, EditIcon, DeleteIcon } from "./Icons";

const AlbumManagement = ({ openAddForm = false }) => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(openAddForm);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genres, setGenres] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    genreId: "",
    releaseYear: "",
    price: "",
  });

  // Demo genres

  // Fetch albums and artists
  const fetchData = async () => {
    try {
      setLoading(true);

      const [albumsRes, artistsRes, genresRes] = await Promise.all([
        fetch("/api/album/all").catch(() => ({ ok: false })),
        fetch("/api/artist").catch(() => ({ ok: false })),
        fetch("/api/genre").catch(() => ({ ok: false })),
      ]);

      if (albumsRes.ok) {
        const albumData = await albumsRes.json();
        setAlbums(albumData.albums || []);
      } else {
        // Demo data if API fails
        setAlbums([]);
      }

      if (artistsRes.ok) {
        const artistData = await artistsRes.json();
        setArtists(artistData.artists || []);
      } else {
        // Demo artists if API fails
        setArtists([]);
      }
      if (genresRes.ok) {
        const genreData = await genresRes.json();
        setGenres(genreData.genres || []);
      } else {
        // Demo genres if API fails
        setGenres([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter albums based on search term
  const filteredAlbums = albums.filter(
    (album) =>
      album.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artist?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.genre?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const albumData = {
        ...formData,
        artistName: artists.find((a) => a.id == formData.artistId)?.name || "",
        genreName: genres.find((g) => g.id == formData.genreId)?.name || "",
      };

      if (editingAlbum) {
        // Update existing album (demo)
        const updatedAlbums = albums.map((album) =>
          album.albumId === editingAlbum.albumId
            ? {
                ...album,
                title: albumData.title,
                artist: { id: albumData.artistId, name: albumData.artistName },
                genre: { id: albumData.genreId, name: albumData.genreName },
                release_year: parseInt(albumData.releaseYear),
                price: parseFloat(albumData.price),
              }
            : album
        );
        setAlbums(updatedAlbums);
        setEditingAlbum(null);
      } else {
        // Add new album (demo)
        const newAlbum = {
          id: Date.now(), // Demo ID
          title: albumData.title,
          artist: { id: albumData.artistId, name: albumData.artistName },
          genre: { id: albumData.genreId, name: albumData.genreName },
          release_year: parseInt(albumData.releaseYear),
          price: parseFloat(albumData.price),
        };
        setAlbums([newAlbum, ...albums]);
      }

      // Reset form
      setFormData({
        title: "",
        artistId: "",
        genreId: "",
        releaseYear: "",
        price: "",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error saving album:", error);
    }
  };

  // Handle edit
  const handleEdit = (album) => {
    setFormData({
      title: album.title,
      artistId: album.artist.id,
      genreId: album.genre.id,
      releaseYear: album.release_year,
      price: album.price,
    });
    setEditingAlbum(album);
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (albumId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this album? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/album/${albumId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          console.log("Album deleted successfully");
          await fetchData();
        } else {
        }
      } catch (error) {
        console.error("Error deleting album:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-[60px] h-[60px] border-[3px] border-[#333] border-t-[#1db954] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6"
      style={{
        background:
          "linear-gradient(180deg, rgba(18, 18, 18, 0.6) 0%, #121212 100%)",
        minHeight: "calc(100vh - 80px)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[#c1c1c1] text-3xl font-bold mb-2">
            Album Management
          </h1>
          <p className="text-[#b3b3b3]">Manage your music catalog</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingAlbum(null);
            setFormData({
              title: "",
              artistId: "",
              genreId: "",
              releaseYear: "",
              price: "",
            });
          }}
          className="px-6 py-3 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Album
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search albums, artists, or genres..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-3 bg-[#333] border border-[#555] rounded-lg text-[#c1c1c1] placeholder-[#888] focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-colors"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-[#333] border border-[#444] rounded-lg p-6 mb-6">
          <h2 className="text-[#c1c1c1] text-xl font-bold mb-4">
            {editingAlbum ? "Edit Album" : "Add New Album"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                Artist
              </label>
              <select
                value={formData.artistId}
                onChange={(e) =>
                  setFormData({ ...formData, artistId: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
              >
                <option value="">Select Artist</option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                Genre
              </label>
              <select
                value={formData.genreId}
                onChange={(e) =>
                  setFormData({ ...formData, genreId: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                Release Year
              </label>
              <input
                type="number"
                value={formData.releaseYear}
                onChange={(e) =>
                  setFormData({ ...formData, releaseYear: e.target.value })
                }
                required
                min="1900"
                max="2030"
                className="w-full px-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                min="0"
                className="w-full px-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-lg font-semibold transition-colors duration-200"
              >
                {editingAlbum ? "Update Album" : "Add Album"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAlbum(null);
                  setFormData({
                    title: "",
                    artistId: "",
                    genreId: "",
                    releaseYear: "",
                    price: "",
                  });
                }}
                className="px-6 py-3 bg-[#333] hover:bg-[#444] text-[#c1c1c1] rounded-lg font-semibold transition-colors duration-200 border border-[#555]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Albums Table */}
      <div className="bg-[#333] border border-[#444] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#222]">
              <tr>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Album
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Artist
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Genre
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Year
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAlbums.map((album) => (
                <tr
                  key={album.albumId}
                  className="border-t border-[#444] hover:bg-[#222] transition-colors"
                >
                  <td className="px-6 py-4 text-[#c1c1c1] font-medium">
                    {album.title}
                  </td>
                  <td className="px-6 py-4 text-[#b3b3b3]">
                    {album.artist?.name}
                  </td>
                  <td className="px-6 py-4 text-[#b3b3b3]">
                    {album.genre?.name}
                  </td>
                  <td className="px-6 py-4 text-[#b3b3b3]">
                    {album.release_year}
                  </td>
                  <td className="px-6 py-4 text-[#b3b3b3]">${album.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(album)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(album.albumId)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-700"
                        disabled={album.tracks && album.tracks.length > 0}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAlbums.length === 0 && (
            <div className="p-8 text-center text-[#888]">
              {searchTerm
                ? "No albums found matching your search."
                : "No albums available."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumManagement;
