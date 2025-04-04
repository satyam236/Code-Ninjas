import React, { useState } from "react";

const Sideleft = () => {
  // Size classes for icons
  const iconSizeClass = "w-14 h-14"; // Standard size for main icons
  const smallIconSizeClass = "w-10 h-10"; // Smaller size for volume icon
  const emojiSizeClass = "text-3xl"; // Standard emoji size
  const smallEmojiSizeClass = "text-2xl"; // Smaller emoji size

  // State to manage volume icon visibility and mute status
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Toggle visibility of the volume icon
  const toggleVolumeVisibility = () => {
    setIsVolumeVisible(!isVolumeVisible);
  };

  // Toggle mute/unmute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed top-4 left-4 w-20 p-3 flex flex-col items-center gap-8 text-white z-50">
      {/* Leaderboard Icon */}
      <div
        className={`bg-blue-500/30 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm ${iconSizeClass} transition-transform duration-200 ease-in-out hover:scale-110`}
        title="Leaderboard"
      >
        <span className={`${emojiSizeClass} text-yellow-400`}>🏆</span>
      </div>

      {/* Play with Friends Icon */}
      <div
        className={`bg-green-500/30 rounded-xl p-2 flex items-center justify-center shadow-md backdrop-blur-sm ${iconSizeClass} transition-transform duration-200 ease-in-out hover:scale-110`}
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

      {/* Volume Icon - Appears below settings when visible */}
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
