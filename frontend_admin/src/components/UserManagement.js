/**
 * UserManagement Component
 *
 * Simple admin interface for managing users in the Music Store.
 *
 * Features:
 * - View all registered users
 * - Search users by name or email
 * - Edit user details (username, email, password, admin status)
 */

import React, { useState, useEffect } from "react";
import { SearchIcon, CloseIcon } from "./Icons";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  // Fetch users from backend API
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        // Transform backend user data to match frontend expectations
        const transformedUsers = data.users.map((user) => ({
          id: user.userId,
          email: user.email,
          username: user.username,
          isAdmin: !!user.isAdmin, // Convert to boolean
          registrationDate: user.createdAt
            ? user.createdAt.split("T")[0]
            : "N/A",
        }));
        setUsers(transformedUsers);
      } else {
        console.error("Failed to fetch users from API");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Open edit modal for user
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      password: "", // Empty for security
      isAdmin: user.isAdmin,
    });
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save user changes
  const saveUserChanges = async () => {
    try {
      // Prepare update data (only send fields that have values)
      const updateData = {
        username: editFormData.username,
        email: editFormData.email,
        isAdmin: editFormData.isAdmin,
      };

      // Only include password if it's provided
      if (editFormData.password.trim()) {
        updateData.password = editFormData.password;
      }

      const response = await fetch(`/api/user/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // Update local state
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                username: editFormData.username,
                email: editFormData.email,
                isAdmin: editFormData.isAdmin,
              }
            : user
        );
        setUsers(updatedUsers);
        setShowEditModal(false);
        alert("User updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Failed to update user"}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
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
            User Management
          </h1>
          <p className="text-[#b3b3b3]">Manage registered users and accounts</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#333] border border-[#444] rounded-lg px-4 py-2">
            <span className="text-[#c1c1c1] text-sm font-medium">
              Total Users:{" "}
            </span>
            <span className="text-[#1db954] font-bold">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-[#333] border border-[#555] rounded-lg text-[#c1c1c1] placeholder-[#888] focus:outline-none focus:border-[#1db954] focus:ring-1 focus:ring-[#1db954] transition-colors"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#333] border border-[#444] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#222]">
              <tr>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Registration
                </th>
                <th className="px-6 py-4 text-left text-[#c1c1c1] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-[#444] hover:bg-[#222] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1db954] flex items-center justify-center text-black font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div className="text-[#c1c1c1] font-medium">
                        {user.username}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#b3b3b3]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        user.isAdmin ? "bg-yellow-500" : "bg-gray-500"
                      } text-white px-2 py-1 rounded-full text-xs font-bold`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#b3b3b3]">
                    {user.registrationDate}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openEditModal(user)}
                      className="px-4 py-2 bg-[#1db954] hover:bg-[#1ed760] text-black rounded text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-[#888]">
              {searchTerm
                ? "No users found matching your search."
                : "No users available."}
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#333] border border-[#444] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-[#c1c1c1] text-2xl font-bold">Edit User</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-[#888] hover:text-[#c1c1c1]"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#c1c1c1] text-sm font-medium mb-2">
                  Password (leave empty to keep current)
                </label>
                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password..."
                  className="w-full px-3 py-2 bg-[#222] border border-[#555] rounded-lg text-[#c1c1c1] focus:outline-none focus:border-[#1db954]"
                />
              </div>

              {/* Admin Status */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={editFormData.isAdmin}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#1db954] bg-[#222] border-[#555] rounded focus:ring-[#1db954]"
                  />
                  <span className="text-[#c1c1c1] text-sm font-medium">
                    Administrator
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#444]">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-[#444] hover:bg-[#555] text-[#c1c1c1] rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveUserChanges}
                  className="flex-1 px-4 py-2 bg-[#1db954] hover:bg-[#1ed760] text-black rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
