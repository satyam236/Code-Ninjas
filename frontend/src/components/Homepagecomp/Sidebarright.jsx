import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { useNavigate } from "react-router-dom";

const Sidebarright = () => {
  // User profile data (keep name and avatar, remove static trophies)
  const user = {
    name: "Anime Fan",
    avatar: "https://i.imgur.com/4M34hi2.png", // Generic anime avatar
    level: 99, // You might want to make this dynamic too eventually
    // trophies: 25, // <-- REMOVE static trophy count
  };

  // State to manage trophy count visibility
  const [showTrophyCount, setShowTrophyCount] = useState(false);
  // State to hold the trophy count read from localStorage
  const [displayTrophies, setDisplayTrophies] = useState(0); // Initialize to 0

  const navigate = useNavigate(); // Hook for navigation

  // --- Effect to load initial trophy count from localStorage ---
  useEffect(() => {
    const savedTrophies = localStorage.getItem('totalTrophies');
    if (savedTrophies !== null) {
      setDisplayTrophies(parseInt(savedTrophies, 10));
    }
  }, []); // Empty array: run only once on component mount

  // --- Function to handle clicking the trophy icon ---
  const handleTrophyClick = () => {
    // 1. Re-read the latest value from localStorage
    const currentSavedTrophies = localStorage.getItem('totalTrophies');
    if (currentSavedTrophies !== null) {
      setDisplayTrophies(parseInt(currentSavedTrophies, 10));
    } else {
      setDisplayTrophies(0); // Reset if somehow it got removed
    }

    // 2. Toggle the visibility of the count display
    setShowTrophyCount(!showTrophyCount);
  };

  return (
    <div className="fixed top-20 right-4 flex flex-col items-center gap-24 text-white z-50">
      {/* User Profile Icon */}
      <div
        className={`rounded-full overflow-hidden border-2 border-yellow-400 shadow-md w-19 h-19 transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer bg-indigo-900/70`}
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
          className={`bg-emerald-900/70 rounded-xl p-3 flex items-center justify-center shadow-md backdrop-blur-sm w-19 h-19 transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
          // Use the state value for the title
          title={`${displayTrophies} Trophies`}
          onClick={handleTrophyClick} // Use the handler function
        >
          <span className="text-3xl">🏆</span>
        </div>

        {/* Trophy Count Section */}
        {showTrophyCount && (
          <div
            className="absolute right-[6rem] bg-yellow-200 text-black py-[0.75rem] px-[1.2rem] rounded-lg shadow-md text-sm font-bold flex items-center justify-center" // Added flex align/justify center
            style={{ height: "4rem", minWidth: "3rem" }} // Set height and min-width
            title="My Trophies"
          >
            {/* Display the state value */}
            {displayTrophies }
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebarright;