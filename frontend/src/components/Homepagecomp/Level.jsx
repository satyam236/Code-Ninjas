import React from "react";
import { useNavigate } from "react-router-dom";

// Assume this comes from props or state in a real app
const CURRENT_LEVEL = 12; // Example: The player is currently on level 12

// --- Define the Mewtwo background image URL ---
const MEWTWO_BACKGROUND_URL = "https://www.pixelstalk.net/wp-content/uploads/images6/Pokemon-Wallpaper-4K-Desktop.jpg";

const Level = ({ currentLevel = CURRENT_LEVEL }) => {
  const navigate = useNavigate();
  const levels = Array.from({ length: 30 }, (_, i) => i + 1); // Generate levels

  // --- Configuration ---
  const columns = 3;
  const nodeSize = 80; // w-20 h-20
  const verticalSpacing = 180;
  const horizontalSpacing = 280;
  const initialOffsetY = 120;

  // --- Calculate node positions (3-Column Grid) ---
  const points = levels.map((levelValue, index) => {
    const rowIndex = Math.floor(index / columns);
    const colIndexOffset = (index % columns) - Math.floor(columns / 2);
    const x = colIndexOffset * horizontalSpacing;
    const y = initialOffsetY + rowIndex * verticalSpacing;
    return { x, y, level: levelValue };
  });

  // --- Define Style Variations (Mewtwo Psychic Theme) ---
  const getLevelStyles = (level) => {
     // Base styles for locked levels (Dark & Muted)
     let styles = {
        gradient: "from-slate-800 via-gray-900 to-black", // Dark, almost invisible
        border: "border-gray-700",
        textColor: "text-gray-600", // Very muted text
        shadow: "shadow-inner", // Subtle inner shadow
        opacity: "opacity-50", // More dimmed
        hoverScale: "group-hover:scale-100", // No hover growth
        innerRing: "ring-gray-700/20",
        hoverBorder: "group-hover:border-gray-600",
        hoverShadow: "",
        hoverRing: "group-hover:ring-gray-700/30",
        nodeTextShadow: "drop-shadow-none",
      };

    if (level < currentLevel) { // COMPLETED - Shades of Dark Purple/Indigo (Master Ball Purple)
      styles.gradient = "from-slate-700 via-purple-950 to-indigo-950"; // Deep, completed feel
      styles.border = "border-purple-800/60";
      styles.textColor = "text-purple-300"; // Lighter purple text
      styles.opacity = "opacity-80"; // Slightly less opaque
      styles.hoverScale = "group-hover:scale-105";
      styles.hoverBorder = "group-hover:border-purple-600"; // Slightly brighter hover border
      styles.innerRing = "ring-purple-700/30";
      styles.hoverRing = "group-hover:ring-purple-700/40";
      styles.nodeTextShadow = "drop-shadow-sm";
      styles.shadow = "shadow-lg";

    } else if (level === currentLevel) { // ONGOING - Bright Psychic Purple/Fuchsia Glow (Mewtwo Energy / Master Ball Center)
      styles.gradient = "from-purple-600 via-fuchsia-700 to-indigo-800"; // Vibrant psychic energy
      styles.border = "border-fuchsia-400"; // Bright pinkish-purple border
      styles.textColor = "text-white"; // High contrast text
      styles.shadow = "shadow-xl shadow-fuchsia-400/70"; // Strong psychic glow effect
      styles.opacity = "opacity-100"; // Fully opaque
      styles.hoverScale = "group-hover:scale-110";
      styles.hoverBorder = "group-hover:border-fuchsia-300";
      styles.hoverShadow = "group-hover:shadow-2xl group-hover:shadow-fuchsia-300/80"; // Enhanced hover glow
      styles.innerRing = "ring-fuchsia-300/40";
      styles.hoverRing = "group-hover:ring-fuchsia-300/50";
      styles.nodeTextShadow = "drop-shadow"; // Clear text shadow

    }
    // Locked levels (level > currentLevel) retain the base styles defined initially.

    return styles;
  };

  // --- Calculate total height based on number of rows ---
  const numRows = Math.ceil(levels.length / columns);
  const totalHeight = initialOffsetY + (numRows > 0 ? (numRows - 1) : 0) * verticalSpacing + nodeSize / 2 + 50;

  // --- Navigate back one step in history ---
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleLevelClick = (level) => {
    if (level <= currentLevel) {
      console.log(`Navigating to game page for level ${level}...`);
      navigate("/game"); // Or navigate(`/game/${level}`)
    } else {
      console.log(`Level ${level} is locked.`);
    }
  };

  return (
    // --- 1. Apply Mewtwo background image URL ---
    <div
      className="relative min-h-screen w-screen text-white font-sans overflow-y-auto
                 bg-cover bg-center bg-no-repeat bg-fixed" // Background image properties
      style={{ backgroundImage: `url('${MEWTWO_BACKGROUND_URL}')` }} // Set the image URL
    >
      {/* --- 2. Optional: Add overlay for readability --- */}
       <div className="absolute inset-0 bg-black/40 z-0"></div> {/* Slightly darker overlay */}

      {/* --- 3. Themed Back Button --- */}
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 px-4 py-2 rounded-lg
                   bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-800
                   text-white text-sm font-semibold shadow-md hover:shadow-lg
                   border border-fuchsia-500 hover:border-fuchsia-400
                   transition-all duration-300 ease-in-out transform hover:scale-105"
        aria-label="Go back"
      >
        ← Back {/* Left arrow symbol */}
      </button>

      {/* Content Area (Ensure z-index is above overlay) */}
      <div className="relative z-10 p-4 pt-20 sm:p-8 sm:pt-24 flex flex-col items-center min-h-screen"> {/* Added top padding for back button */}

        {/* --- 4. Adjust Title Style for Mewtwo/Pokemon Theme --- */}
        <h1 className="text-center text-fuchsia-400 text-4xl sm:text-5xl font-bold mb-16 sm:mb-24 drop-shadow-lg filter brightness-125">
          🌌 Psychic Challenge Levels 🌌 {/* Themed title */}
        </h1>

        {/* Container for Levels */}
        <div
          className="relative z-10 w-full max-w-4xl" // Keep z-10
          style={{ height: `${totalHeight}px` }}
        >
          {/* Level Nodes */}
          {points.map((point) => {
            // --- 5. Use the Mewtwo-themed getLevelStyles ---
            const levelStyles = getLevelStyles(point.level);
            const isLocked = point.level > currentLevel;

            return (
              <div
                key={point.level}
                className={`absolute z-10 flex items-center group ${ // Keep z-10
                  !isLocked ? "cursor-pointer" : "cursor-default"
                }`}
                style={{
                  top: `${point.y - nodeSize / 2}px`,
                  left: `50%`,
                  transform: `translateX(calc(${point.x}px - 50%))`,
                }}
                title={`Level ${point.level}${isLocked ? " (Locked)" : ""}`}
                onClick={() => handleLevelClick(point.level)}
              >
                {/* Level Node (visual part - uses new styles) */}
                <div
                  className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${levelStyles.gradient}
                             flex items-center justify-center
                             ${levelStyles.textColor}
                             text-xl font-bold ${/* Text size kept at xl */''}
                             ${levelStyles.nodeTextShadow}
                             ${levelStyles.shadow} border-2 ${levelStyles.border}
                             ${levelStyles.opacity}
                             transition-all duration-300 ease-in-out
                             ${levelStyles.hoverScale} ${levelStyles.hoverBorder} ${levelStyles.hoverShadow}
                           `}
                >
                  <div
                    className={`absolute inset-0 rounded-full ring-1 ring-inset ${levelStyles.innerRing} transition-all duration-300 ${levelStyles.hoverRing}`}
                  ></div>
                  {point.level}
                </div>

                {/* Level Name - Adjusted text color */}
                <span
                  className={`absolute whitespace-nowrap text-lg font-semibold text-purple-200 drop-shadow filter brightness-110 ${/* Adjusted text color */''}
                              transition-all duration-300
                              ${
                                isLocked
                                  ? "opacity-0 group-hover:opacity-0 pointer-events-none"
                                  : "opacity-0 group-hover:opacity-100 group-hover:translate-y-[-2px] group-hover:text-fuchsia-200" // Brighter fuchsia/pink on hover
                              }
                              left-full ml-4
                            `}
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  Level {point.level}
                </span>
              </div>
            );
          })}
        </div> {/* End Levels Container */}
      </div> {/* End Content Area */}
    </div> // End Main Wrapper
  );
};

export default Level;