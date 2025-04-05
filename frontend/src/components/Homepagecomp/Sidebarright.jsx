import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebarright = () => {
  // User profile data
  const user = {
    name: "Anime Fan",
    avatar: "https://i.imgur.com/4M34hi2.png", // Generic anime avatar
    level: 99,
    trophies: 25,
  };

  // State to manage trophy count visibility
  const [showTrophyCount, setShowTrophyCount] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="fixed top-4 right-4 flex flex-col items-center gap-8 text-white z-50">
      {/* User Profile Icon */}
      <div
        className={`rounded-full overflow-hidden border-2 border-yellow-400 shadow-md w-14 h-14 transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
        title={`${user.name} - Level ${user.level}`}
        onClick={() => navigate("/profile")} // Navigate to Profile page on click
      >
        <img
          src={user.avatar}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Trophies Section */}
      <div className="relative flex items-center">
        {/* Trophies Button */}
        <div
          className={`bg-yellow-300/30 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm w-14 h-14 transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
          title={`${user.trophies} Trophies`}
          onClick={() => setShowTrophyCount(!showTrophyCount)} // Toggle trophy count visibility
        >
          <span className="text-3xl">🏆</span>
        </div>

        {/* Trophy Count Section */}
        {showTrophyCount && (
          <div
            className="absolute right-[4.5rem] bg-yellow-200 text-black py-[0.5rem] px-[0.8rem] rounded-lg shadow-md text-sm font-bold"
            style={{ height: "3rem" }} // Slightly smaller than button height
            title="Number of Trophies"
          >
            {user.trophies}
          </div>
        )}
      </div>

      {/* 2 Player Button */}
      <div
        className={`bg-yellow-300/30 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm w-14 h-14 transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
        title="2 Player Mode"
        onClick={() => navigate("/2player")} // Navigate to 2 Player page on click
      >
        <span className="text-xl font-bold">⚔️</span>
      </div>
    </div>
  );
};

export default Sidebarright;
