// NavigationMenu.js
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationIcon from "@mui/icons-material/Notifications";
import ListAlt from "@mui/icons-material/ListAlt";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";

export const NavigationMenu = [
  {
    title: "Home",
    icon: <HomeIcon />,
    path: "/home",
  },
  {
    title: "Explore",
    icon: <ExploreIcon />,
    path: "/explore",
  },
  {
    title: "Notifications",
    icon: <NotificationIcon />,
    path: "/notifications",
  },
  // Removed Messages section
  // {
  //   title: "Messages",
  //   icon: <MessageIcon />, 
  //   path: "/messages",
  // },
  {
    title: "Learning Plans",
    icon: <ListAlt />,
    path: "/learning-plans",
  },
  
  {
    title: "Profile",
    icon: <AccountCircleIcon />,
    path: "/profile",
  },
];
export default NavigationMenu;
