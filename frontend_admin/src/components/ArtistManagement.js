/**
 * ArtistManagement Component
 *
 * Admin interface for managing artists in the Music Store.
 * Provides CRUD operations for artist catalog management.
 *
 * Features:
 * - View all artists in a table format
 * - Add new artists with form validation
 * - Edit existing artist information
 * - Delete artists with confirmation
 * - Search and filter artists
 * - View artist albums count
 */

import React, { useState, useEffect } from "react";
import { PlusIcon, SearchIcon, EditIcon, DeleteIcon } from "./Icons";

const ArtistManagement = ({ openAddForm = false }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(openAddForm);
  const [editingArtist, setEditingArtist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    country: "",
  });
  const [error, setError] = useState("");

  // Fetch artists
  const fetchArtists = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/artist");

      if (response.ok) {
        const data = await response.json();
        console.log("Artists data:", data);
        setArtists(data.artists || []);
      } else {
        console.error("Failed to fetch artists");
        setError("Failed to fetch artists from server");
        setArtists([]);
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // Filter artists based on search term
  const filteredArtists = artists.filter(
    (artist) =>
      artist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.country) {
      setError("Name and country are required");
      return;
    }

    try {
      if (editingArtist) {
        // Update existing artist
        const response = await fetch(
          `http://localhost:3000/api/artist/${editingArtist.artistId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              country: formData.country,
            }),
          }
        );

        if (response.ok) {
          console.log("Artist updated successfully");
          await fetchArtists(); // Refresh the list
          setEditingArtist(null);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to update artist");
          return;
        }
      } else {
        // Add new artist
        const response = await fetch("http://localhost:3000/api/artist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            country: formData.country,
          }),
        });

        if (response.ok) {
          console.log("Artist created successfully");
          await fetchArtists(); // Refresh the list
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to create artist");
          return;
        }
      }

      // Reset form
      setFormData({ name: "", country: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error saving artist:", error);
      setError("Network error while saving artist");
    }
  };

  // Handle edit
  const handleEdit = (artist) => {
    setFormData({
      name: artist.name,
      country: artist.country,
    });
    setEditingArtist(artist);
    setShowAddForm(true);
    setError("");
  };

  // Handle delete
  const handleDelete = async (artistId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this artist? This will also remove all their albums."
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/artist/${artistId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          console.log("Artist deleted successfully");
          await fetchArtists(); // Refresh the list
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to delete artist");
        }
      } catch (error) {
        console.error("Error deleting artist:", error);
        setError("Network error while deleting artist");
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
            Artist Management
          </h1>
          <p className="text-[#b3b3b3]">Manage your artist catalog</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingArtist(null);
            setFormData({ name: "", country: "", bio: "" });
          }}
          className="px-6 py-3 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Artist
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search artists or countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-3 bg-[#333] border border-[#555] rounded-lg text-[#c1c1c1] placeholder-[#888] focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-colors"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-[#333] border border-[#444] rounded-lg p-6 mb-6">
          <h2 className="text-[#c1c1c1] text-xl font-bold mb-4">
            {editingArtist ? "Edit Artist" : "Add New Artist"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                Artist Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
              />
            </div>
            {error && (
              <div className="md:col-span-2 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
                {error}
              </div>
            )}
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-lg font-semibold transition-colors duration-200"
              >
                {editingArtist ? "Update Artist" : "Add Artist"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingArtist(null);
                  setFormData({ name: "", country: "" });
                  setError("");
                }}
                className="px-6 py-3 bg-[#333] hover:bg-[#444] text-[#c1c1c1] rounded-lg font-semibold transition-colors duration-200 border border-[#555]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Artists Table */}
      <div className="bg-[#333] border border-[#444] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#222]">
              <tr>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Artist Name
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Country
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Albums
                </th>

                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredArtists.map((artist) => (
                <tr
                  key={artist.artistId}
                  className="border-t border-[#444] hover:bg-[#222] transition-colors"
                >
                  <td className="px-6 py-4 text-[#c1c1c1] font-medium">
                    {artist.name}
                  </td>
                  <td className="px-6 py-4 text-[#b3b3b3]">{artist.country}</td>
                  <td className="px-6 py-4 text-[#b3b3b3]">
                    <span className="bg-[#1db954] text-black px-2 py-1 rounded-full text-xs font-bold">
                      {artist.albumCount || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(artist)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(artist.artistId)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredArtists.length === 0 && (
            <div className="p-8 text-center text-[#888]">
              {searchTerm
                ? "No artists found matching your search."
                : "No artists available."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistManagement;
