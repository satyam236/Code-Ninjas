import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Sideleft = () => {
  const navigate = useNavigate();

  // Updated styling variables to match right sidebar
  const iconSizeClass = "w-19 h-19"; // Matching the right sidebar size
  const smallIconSizeClass = "w-14 h-14"; // Proportionally adjusted

  // State for volume visibility and mute status
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleVolumeVisibility = () => setIsVolumeVisible(!isVolumeVisible);
  const toggleMute = () => setIsMuted(!isMuted);

  // Navigation Handlers
  const handleLeaderboardClick = () => {
    navigate('/leaderboard');
  };

  const handlePlayFriendsClick = () => {
    navigate('/play-with-friend');
  };

  return (
    <div className="fixed top-20 left-4 w-24 p-3 flex flex-col items-center gap-24 text-white z-50">
      {/* Leaderboard Icon */}
      <div
        className={`bg-purple-900/70 rounded-xl p-3 flex items-center justify-center shadow-md backdrop-blur-sm ${iconSizeClass} transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
        onClick={handleLeaderboardClick}
        title="Leaderboard"
      >
        <span className="text-3xl text-yellow-400">🏆</span>
      </div>

      {/* Play with Friends Icon */}
      <div
        className={`bg-teal-900/70 rounded-xl p-3 flex items-center justify-center shadow-md backdrop-blur-sm ${iconSizeClass} transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
        onClick={handlePlayFriendsClick}
        title="Play with Friends"
      >
        <span className="text-3xl text-green-400">🎮</span>
      </div>

      {/* Settings Icon */}
      <div
        className={`bg-slate-900/70 rounded-xl p-3 flex items-center justify-center shadow-md backdrop-blur-sm ${iconSizeClass} transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
        onClick={toggleVolumeVisibility}
        title="Settings"
      >
        <span className="text-3xl text-gray-400">⚙️</span>
      </div>

      {/* Volume Icon */}
      {isVolumeVisible && (
        <div
          className={`bg-rose-900/70 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm ${smallIconSizeClass} transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
        >
          <span
            className={`text-2xl ${
              isMuted ? "text-red-400" : "text-green-400"
            }`}
          >
            {isMuted ? "🔇" : "🔊"}
          </span>
        </div>
      )}
    </div>
  );
};

export default Sideleft;
