import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate

const Sideleft = () => {
  const navigate = useNavigate(); // <--- Get the navigate function

  // ... (other state and functions remain the same) ...
  const iconSizeClass = "w-14 h-14";
  const smallIconSizeClass = "w-10 h-10";
  const emojiSizeClass = "text-3xl";
  const smallEmojiSizeClass = "text-2xl";

  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleVolumeVisibility = () => setIsVolumeVisible(!isVolumeVisible);
  const toggleMute = () => setIsMuted(!isMuted);

  // --- Navigation Handler ---
  const handleLeaderboardClick = () => {
    navigate('/leaderboard'); // <--- Navigate to the leaderboard route
  };

  return (
    <div className="fixed top-4 left-4 w-20 p-3 flex flex-col items-center gap-8 text-white z-50"> {/* Ensure z-index is high */}
      {/* Leaderboard Icon */}
      <div
        className={`bg-blue-500/30 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm ${iconSizeClass} transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`} // <--- Added cursor-pointer
        onClick={handleLeaderboardClick} // <--- Added onClick handler
        title="Leaderboard"
      >
        <span className={`${emojiSizeClass} text-yellow-400`}>🏆</span>
      </div>

      {/* Play with Friends Icon */}
      <div
        className={`bg-green-500/30 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm ${iconSizeClass} transition-transform duration-200 ease-in-out hover:scale-110`}
        // Add onClick={handlePlayFriendsClick} and define it if needed
        title="Play with Friends"
      >
        <span className={`${emojiSizeClass} text-green-400`}>🎮</span>
      </div>

      {/* Settings Icon */}
      <div
        className={`bg-gray-500/30 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm ${iconSizeClass} transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
        onClick={toggleVolumeVisibility}
        title="Settings"
      >
        <span className={`${emojiSizeClass} text-gray-400`}>⚙️</span>
      </div>

      {/* Volume Icon */}
      {isVolumeVisible && (
        <div
          className={`bg-gray-500/30 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm ${smallIconSizeClass} transition-transform duration-200 ease-in-out hover:scale-110 cursor-pointer`}
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
        >
          <span
            className={`${smallEmojiSizeClass} ${
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