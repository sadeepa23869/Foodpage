import React from "react";
import Navigation from "../Navigation/Navigation";
import HomeSection from "../HomeSection/HomeSection";

const HomePage = () => {
  return (
    <div className="flex">
      {/* Left part (navigation) */}
      <div className="w-1/4 ml-10 ">
        {" "}
        <Navigation />
      </div>

      {/* Middle part */}
      <div className="w-1/2">
        <HomeSection />
      </div>

      {/* Right part */}
      <div className="w-1/4">
        <p className="text-center">right part</p>
      </div>
    </div>
  );
};

export default HomePage;
