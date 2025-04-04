import React, { useState } from "react";

const Sidebarright = () => {
  // User profile data
  const user = {
    name: "Anime Fan",
    avatar: "https://i.imgur.com/4M34hi2.png", // Generic anime avatar
    level: 99,
    trophies: 25,
    badges: 12,
  };

  // State to manage trophy count visibility
  const [showTrophyCount, setShowTrophyCount] = useState(false);

  return (
    <div className="fixed top-4 right-4 w-20 p-3 flex flex-col items-center gap-8 text-white z-50">
      {/* User Profile Icon */}
      <div
        className={`rounded-full overflow-hidden border-2 border-yellow-400 shadow-md w-14 h-14 transition-transform duration-200 ease-in-out hover:scale-110`}
        title={`${user.name} - Level ${user.level}`}
      >
        <img
          src={user.avatar}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Trophies Button */}
      <div
        className={`bg-yellow-500/30 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm w-14 h-14 transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
        title={`${user.trophies} Trophies`}
        onClick={() => setShowTrophyCount(!showTrophyCount)} // Toggle trophy count visibility
      >
        <span className="text-3xl">🏆</span>
      </div>

      {/* Trophy Count Popup */}
      {showTrophyCount && (
        <div className="absolute top-[6rem] right-[5rem] bg-yellow-500 text-black p-4 rounded-lg shadow-lg text-center animate-fade-in">
          <p className="text-lg font-bold">🏆 Trophies: {user.trophies}</p>
        </div>
      )}

      {/* Badges Button */}
      <div
        className={`bg-yellow-500/30 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm w-14 h-14 transition-transform duration-200 ease-in-out hover:scale-110`}
        title={`${user.badges} Badges`}
      >
        <span className="text-3xl">🥇</span>
      </div>
    </div>
  );
};

export default Sidebarright;
