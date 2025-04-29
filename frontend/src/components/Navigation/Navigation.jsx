import React from "react";
import logo from "../../assets/logo.png";
import { NavigationMenu } from "../Navigation/NavigationMenu"; // Corrected import
import { useNavigate } from "react-router";
import { Button, Avatar } from "@mui/material";

const Navigation = ({ user, setCurrentSection, currentSection, onLogout }) => {
  // Handle the closing of the menu
  const handleClose = () => {
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    handleClose();
  };

  const navigate = useNavigate();

  // Handle section change
  const handleSectionChange = (section) => {
    setCurrentSection(section); // Update the current section
    if (section === "profile") {
      navigate(`/profile/${section}`);
    } else {
      navigate(`/${section}`);
    }
  };

  return (
    <div className="py-5 flex flex-col items-center ">
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
              item.path.replace('/', '') === currentSection ? "text-yellow-500" : ""
            }`}
            onClick={() => handleSectionChange(item.path.replace('/', ''))}
            key={item.title}
          >
            {item.icon}
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

      {/* Removed duplicate profile section at the end of the navigation panel */}
    </div>
  );
};

export default Navigation;
