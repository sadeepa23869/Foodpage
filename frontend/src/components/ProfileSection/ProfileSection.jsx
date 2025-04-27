import React, { useState } from "react";
import ProfileSettings from "./ProfileSettings";

const mockPosts = [
  {
    id: 1,
    content: "This is my first post!",
    date: "2025-04-17",
  },
  {
    id: 2,
    content: "Excited to join SkillSync!",
    date: "2025-04-16",
  },
];

// Mock data for followers and following
const followers = [
  { id: 1, name: "John Doe", handle: "@johndoe", photo: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Jane Smith", handle: "@janesmith", photo: "https://randomuser.me/api/portraits/women/2.jpg" },
];
const following = [
  { id: 3, name: "Michael Lee", handle: "@michaell", photo: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Sara Kim", handle: "@sarakim", photo: "https://randomuser.me/api/portraits/women/4.jpg" },
];

const ProfileSection = ({ user }) => {
  const [showSettings, setShowSettings] = useState(false);

  const handleSave = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4043/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("profileUpdated", { detail: updated }));
      }
      setShowSettings(false);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4043/api/users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete profile");
      // Log out and reload app
      localStorage.removeItem("token");
      window.location.reload();
    } catch (err) {
      alert("Failed to delete profile: " + err.message);
    }
  };

  if (showSettings) {
    return (
      <ProfileSettings
        initialProfile={user}
        onSave={handleSave}
        onCancel={() => setShowSettings(false)}
        onDelete={handleDeleteProfile}
      />
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md mt-0 border border-gray-200 flex flex-col min-h-[500px] max-h-full">
      <div className="flex items-center space-x-4 p-6 border-b">
        <img src={user?.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
        <div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{user?.name}</div>
          <div className="text-gray-500">{user?.email}</div>
          {user?.bio && <div className="text-gray-600 text-sm mt-1">{user?.bio}</div>}
        </div>
        <button
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
          onClick={() => setShowSettings(true)}
        >
          Edit Profile
        </button>
      </div>
      <div className="flex space-x-8 px-6 py-4 border-b">
        <div>
          <span className="font-bold text-lg text-blue-700">{followers.length}</span>
          <span className="ml-1 text-gray-600">Followers</span>
        </div>
        <div>
          <span className="font-bold text-lg text-blue-700">{following.length}</span>
          <span className="ml-1 text-gray-600">Following</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto">
        <div className="flex-1 p-6 border-r">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">Followers</h3>
          {followers.length === 0 ? (
            <p className="text-gray-500">No followers yet.</p>
          ) : (
            <ul className="space-y-4">
              {followers.map((user) => (
                <li key={user.id} className="flex items-center space-x-4">
                  <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.handle}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex-1 p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">Following</h3>
          {following.length === 0 ? (
            <p className="text-gray-500">Not following anyone yet.</p>
          ) : (
            <ul className="space-y-4">
              {following.map((user) => (
                <li key={user.id} className="flex items-center space-x-4">
                  <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.handle}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto">
        <div className="flex-1 p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-700">Posts</h3>
          {mockPosts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <div key={post.id} className="border rounded p-4 bg-gray-50">
                  <div className="text-gray-800 mb-2">{post.content}</div>
                  <div className="text-xs text-gray-400">{post.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
