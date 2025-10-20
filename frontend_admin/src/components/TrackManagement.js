/**
 * TrackManagement Component
 *
 * Admin interface for managing tracks in the Music Store.
 * Provides CRUD operations for track catalog management.
 *
 * Features:
 * - View all tracks in a table format with album information
 * - Add new tracks with form validation
 * - Edit existing track information
 * - Delete tracks with confirmation
 * - Search and filter tracks by title or album
 * - Integration with backend APIs
 * - Duration formatting (seconds to mm:ss)
 */

import React, { useState, useEffect } from "react";
import { PlusIcon, SearchIcon, EditIcon, DeleteIcon } from "./Icons";

const TrackManagement = () => {
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    duration_seconds: "",
    album_id: "",
  });
  const [error, setError] = useState("");

  // Fetch all tracks
  const fetchTracks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/track");

      if (response.ok) {
        const data = await response.json();
        console.log("Tracks data:", data);
        setTracks(data.tracks || []);
      } else {
        console.error("Failed to fetch tracks");
        setError("Failed to fetch tracks from server");
        setTracks([]);
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setError("Network error while fetching tracks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all albums for the dropdown
  const fetchAlbums = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/album");
      if (response.ok) {
        const data = await response.json();
        console.log("Albums data:", data);
        setAlbums(data.albums || []);
      } else {
        console.error("Failed to fetch albums");
        setError("Failed to fetch albums from server");
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      setError("Network error while fetching albums");
    }
  };

  useEffect(() => {
    fetchTracks();
    fetchAlbums();
  }, []);

  // Helper function to format duration from seconds to mm:ss
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper function to parse duration from mm:ss to seconds
  const parseDuration = (durationStr) => {
    const parts = durationStr.split(":");
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10) || 0;
      const secs = parseInt(parts[1], 10) || 0;
      return mins * 60 + secs;
    }
    return parseInt(durationStr, 10) || 0;
  };

  // Get album name by ID
  const getAlbumName = (albumId) => {
    const album = albums.find((a) => a.albumId === albumId);
    return album
      ? `${album.title} (${album.artistName})`
      : `Album ID: ${albumId}`;
  };

  // Filter tracks based on search term
  const filteredTracks = tracks.filter(
    (track) =>
      track.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAlbumName(track.album_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.duration_seconds || !formData.album_id) {
      setError("Title, duration, and album are required");
      return;
    }

    // Convert duration to seconds if it's in mm:ss format
    const durationInSeconds = parseDuration(formData.duration_seconds);
    if (durationInSeconds <= 0) {
      setError("Duration must be a positive number or in mm:ss format");
      return;
    }

    try {
      if (editingTrack) {
        // Update existing track
        const response = await fetch(
          `http://localhost:3000/api/track/${editingTrack.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: formData.title,
              duration_seconds: durationInSeconds,
              album_id: parseInt(formData.album_id),
            }),
          }
        );

        if (response.ok) {
          console.log("Track updated successfully");
          await fetchTracks();
          setEditingTrack(null);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to update track");
          return;
        }
      } else {
        // Add new track
        const response = await fetch("http://localhost:3000/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            duration_seconds: durationInSeconds,
            album_id: parseInt(formData.album_id),
          }),
        });

        if (response.ok) {
          console.log("Track created successfully");
          await fetchTracks();
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to create track");
          return;
        }
      }

      // Reset form
      setFormData({ title: "", duration_seconds: "", album_id: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error saving track:", error);
      setError("Network error while saving track");
    }
  };

  // Handle edit
  const handleEdit = (track) => {
    setFormData({
      title: track.title,
      duration_seconds: formatDuration(track.duration_seconds),
      album_id: track.album_id.toString(),
    });
    setEditingTrack(track);
    setShowAddForm(true);
    setError("");
  };

  // Handle delete
  const handleDelete = async (trackId) => {
    if (window.confirm("Are you sure you want to delete this track?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/track/${trackId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          console.log("Track deleted successfully");
          await fetchTracks();
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to delete track");
        }
      } catch (error) {
        console.error("Error deleting track:", error);
        setError("Network error while deleting track");
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
        background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#c1c1c1] mb-2">
            Track Management
          </h1>
          <p className="text-[#b3b3b3]">
            Manage individual tracks in your music catalog
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingTrack(null);
            setFormData({ title: "", duration_seconds: "", album_id: "" });
            setError("");
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-lg font-semibold transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          Add Track
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b3b3b3]" />
        <input
          type="text"
          placeholder="Search tracks by title or album..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-8 p-6 bg-[#1a1a1a] border border-[#444] rounded-lg">
          <h2 className="text-xl font-bold text-[#c1c1c1] mb-4">
            {editingTrack ? "Edit Track" : "Add New Track"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                Track Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
                placeholder="Enter track title..."
              />
            </div>
            <div>
              <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                Duration * (mm:ss or seconds)
              </label>
              <input
                type="text"
                value={formData.duration_seconds}
                onChange={(e) =>
                  setFormData({ ...formData, duration_seconds: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
                placeholder="3:45 or 225"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                Album *
              </label>
              <select
                value={formData.album_id}
                onChange={(e) =>
                  setFormData({ ...formData, album_id: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954] transition-colors"
              >
                <option value="">Select an album...</option>
                {albums.map((album) => (
                  <option key={album.albumId} value={album.albumId}>
                    {album.title} - {album.artistName}
                  </option>
                ))}
              </select>
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
                {editingTrack ? "Update Track" : "Add Track"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingTrack(null);
                  setFormData({
                    title: "",
                    duration_seconds: "",
                    album_id: "",
                  });
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

      {/* Tracks Table */}
      <div className="bg-[#1a1a1a] border border-[#444] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#444]">
          <h2 className="text-lg font-semibold text-[#c1c1c1]">
            All Tracks ({filteredTracks.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#222]">
              <tr>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Track Title
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Album
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTracks.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-[#b3b3b3]"
                  >
                    {searchTerm
                      ? "No tracks found matching your search."
                      : "No tracks available."}
                  </td>
                </tr>
              ) : (
                filteredTracks.map((track) => (
                  <tr
                    key={track.id}
                    className="border-t border-[#444] hover:bg-[#222] transition-colors"
                  >
                    <td className="px-6 py-4 text-[#c1c1c1] font-medium">
                      {track.title}
                    </td>
                    <td className="px-6 py-4 text-[#b3b3b3]">
                      {formatDuration(track.duration_seconds)}
                    </td>
                    <td className="px-6 py-4 text-[#b3b3b3]">
                      {getAlbumName(track.album_id)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(track)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(track.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] border border-[#444] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#c1c1c1] mb-2">
            Total Tracks
          </h3>
          <p className="text-3xl font-bold text-[#1db954]">{tracks.length}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#444] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#c1c1c1] mb-2">
            Average Duration
          </h3>
          <p className="text-3xl font-bold text-[#1db954]">
            {tracks.length > 0
              ? formatDuration(
                  Math.round(
                    tracks.reduce(
                      (sum, track) => sum + track.duration_seconds,
                      0
                    ) / tracks.length
                  )
                )
              : "0:00"}
          </p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#444] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#c1c1c1] mb-2">
            Total Duration
          </h3>
          <p className="text-3xl font-bold text-[#1db954]">
            {formatDuration(
              tracks.reduce((sum, track) => sum + track.duration_seconds, 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackManagement;
