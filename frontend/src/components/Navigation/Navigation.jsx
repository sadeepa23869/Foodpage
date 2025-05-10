import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { NavigationMenu } from "../Navigation/NavigationMenu";
import { useNavigate } from "react-router";
import { Button, Avatar, Badge } from "@mui/material";
import { getUnreadCount } from "../../api"; // Import the API function

const Navigation = ({ user, setCurrentSection, currentSection, onLogout }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };
    
    // Fetch immediately and then every 30 seconds
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    // Handle menu closing if needed
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    handleClose();
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    if (section === "profile") {
      navigate(`/profile/${section}`);
    } else {
      navigate(`/${section}`);
    }
  };

  return (
    <div className="py-5 flex flex-col items-center">
      <img src={logo} alt="Logo" className="w-32 h-auto mx-auto" />
      <div className="space-y-6">
        {/* User Profile Details */}
        {user && (
          <div className="my-6 flex flex-col items-center">
            <Avatar src={user.photo || undefined} alt={user.name} sx={{ width: 64, height: 64, mb: 1 }} />
            <div className="font-bold text-lg">{user.name}</div>
            <div className="text-gray-500 text-sm">{user.email}</div>
            {user.bio && <div className="text-gray-600 text-xs mt-1 text-center">{user.bio}</div>}
          </div>
        )}
        {NavigationMenu.filter(item => item.title !== "Post" && item.title !== "Messages").map((item) => (
          <div
            className={`cursor-pointer flex space-x-3 items-center ${
              item.path.replace('/', '') === currentSection ? "text-blue-500" : ""
            }`}
            onClick={() => handleSectionChange(item.path.replace('/', ''))}
            key={item.title}
          >
            {item.showBadge ? (
              <Badge badgeContent={unreadCount} color="primary">
                {item.icon}
              </Badge>
            ) : (
              item.icon
            )}
            <span className="font-semibold text-lg">{item.title}</span>
          </div>
        ))}
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleLogout}
          className="mt-10 font-semibold"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navigation;