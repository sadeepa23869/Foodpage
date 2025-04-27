import React, { useState, useEffect } from "react";
import { getRecommendedUsers, followUser, unfollowUser } from '../../api';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

const ExploreSection = ({ user }) => {
  const [tab, setTab] = useState("recommendations");
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const recommendations = await getRecommendedUsers();
        setRecommendedUsers(recommendations.data);
        
        // For demo purposes, we'll use a mock following list
        // In a real app, you would fetch this from your API
        setFollowing(user?.following || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      setFollowing([...following, userId]);
      setRecommendedUsers(recommendedUsers.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await unfollowUser(userId);
      setFollowing(following.filter(id => id !== userId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md mt-0 border border-gray-200 flex flex-col min-h-[500px] max-h-full p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Explore</h2>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold ${tab === "recommendations" ? "bg-blue-600 text-white" : "bg-gray-200 text-blue-700"}`}
          onClick={() => setTab("recommendations")}
        >
          Recommendations
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold ${tab === "following" ? "bg-blue-600 text-white" : "bg-gray-200 text-blue-700"}`}
          onClick={() => setTab("following")}
        >
          Following
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === "recommendations" ? (
          recommendedUsers.length === 0 ? (
            <p className="text-gray-500">No recommendations available.</p>
          ) : (
            <ul className="space-y-4">
              {recommendedUsers.map((user) => (
                <li key={user.id} className="flex items-center justify-between space-x-4 border-b pb-4 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <Avatar src={user.photo || "https://via.placeholder.com/150"} alt={user.name} />
                    <div>
                      <div className="font-semibold text-gray-800">{user.name}</div>
                      <div className="text-xs text-gray-500">@{user.email.split('@')[0]}</div>
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleFollow(user.id)}
                  >
                    Follow
                  </Button>
                </li>
              ))}
            </ul>
          )
        ) : (
          following.length === 0 ? (
            <p className="text-gray-500">Not following anyone yet.</p>
          ) : (
            <ul className="space-y-4">
              {following.map((userId) => {
                // In a real app, you would have the full user object
                const user = recommendedUsers.find(u => u.id === userId) || {
                  id: userId,
                  name: `User ${userId}`,
                  email: `user${userId}@example.com`
                };
                
                return (
                  <li key={userId} className="flex items-center justify-between space-x-4 border-b pb-4 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <Avatar src={user.photo || "https://via.placeholder.com/150"} alt={user.name} />
                      <div>
                        <div className="font-semibold text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-500">@{user.email.split('@')[0]}</div>
                      </div>
                    </div>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleUnfollow(userId)}
                    >
                      Unfollow
                    </Button>
                  </li>
                );
              })}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default ExploreSection;