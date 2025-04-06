import React from "react";
import { useNavigate } from "react-router-dom";

// --- Define the Mewtwo background image URL ---
const MEWTWO_BACKGROUND_URL = "https://www.pixelstalk.net/wp-content/uploads/images6/Pokemon-Wallpaper-4K-Desktop.jpg";

// --- Define Time Limits (in seconds) FOR THE 3 LEVELS ---
const LEVEL_TIME_LIMITS = {
  1: 120, // Level 1: 2 minutes 00 seconds
  2: 85,  // Level 2: 1 minute 25 seconds
  3: 45,  // Level 3: 0 minutes 45 seconds
};

// --- Define the EXACT 3 levels we have ---
const gameLevels = [1, 2, 3];

const Level = () => {
  const navigate = useNavigate();

  // --- Configuration for Layout (Simplified for 3 levels in a row) ---
  const nodeSize = 96; // w-24 h-24
  const horizontalSpacing = 320; // Space between nodes
  const initialOffsetY = 200; // Vertical position of the row

  // --- Calculate positions for ONLY 3 levels ---
  const points = gameLevels.map((levelValue, index) => {
    const colIndexOffset = index - Math.floor(gameLevels.length / 2); // Offset from center (-1, 0, 1)
    const x = colIndexOffset * horizontalSpacing;
    const y = initialOffsetY;
    return { x, y, level: levelValue };
  });

  // --- Define Specific Styles FOR EACH of the 3 Levels ---
  // No need for complex conditional logic based on 'currentLevel' if all 3 are always present
  const getLevelStyles = (level) => {
    let styles = {}; // Start fresh for each level

    switch (level) {
      case 1: // Style for Level 1 (e.g., Brightest/Current)
        styles = {
          gradient: "from-purple-600 via-fuchsia-700 to-indigo-800",
          border: "border-fuchsia-400", textColor: "text-white",
          shadow: "shadow-xl shadow-fuchsia-400/70", opacity: "opacity-100",
          hoverScale: "group-hover:scale-110", hoverBorder: "group-hover:border-fuchsia-300",
          hoverShadow: "group-hover:shadow-2xl group-hover:shadow-fuchsia-300/80",
          innerRing: "ring-fuchsia-300/40", hoverRing: "group-hover:ring-fuchsia-300/50",
          nodeTextShadow: "drop-shadow",
        };
        break;
      case 2: // Style for Level 2 (e.g., Completed but distinct)
        styles = {
          gradient: "from-purple-800 via-indigo-900 to-slate-950",
          border: "border-indigo-600/70", textColor: "text-indigo-200",
          opacity: "opacity-90", hoverScale: "group-hover:scale-105",
          hoverBorder: "group-hover:border-indigo-400", innerRing: "ring-indigo-500/30",
          hoverRing: "group-hover:ring-indigo-500/40", nodeTextShadow: "drop-shadow-sm",
          shadow: "shadow-lg",
          // Locked styles (not needed here as assuming always unlocked)
          // hoverShadow: "", nodeTextShadow: "drop-shadow-none",
        };
        break;
      case 3: // Style for Level 3 (e.g., Completed/Darker)
      default: // Default serves as Level 3 style
        styles = {
          gradient: "from-slate-700 via-purple-950 to-indigo-950",
          border: "border-purple-800/60", textColor: "text-purple-300",
          opacity: "opacity-85", hoverScale: "group-hover:scale-105",
          hoverBorder: "group-hover:border-purple-600", innerRing: "ring-purple-700/30",
          hoverRing: "group-hover:ring-purple-700/40", nodeTextShadow: "drop-shadow-sm",
          shadow: "shadow-lg",
          // Locked styles (not needed here as assuming always unlocked)
          // hoverShadow: "", nodeTextShadow: "drop-shadow-none",
        };
        break;
    }
    return styles;
  };

  // --- Calculate minimum height for the container ---
  const totalHeight = initialOffsetY + nodeSize / 2 + 100;

  // --- Navigate back handler ---
  const handleGoBack = () => { navigate(-1); };

  // --- Click Handler to navigate with time limit ---
  const handleLevelClick = (level) => {
    // No need to check if locked if all 3 are always available
    const timeLimit = LEVEL_TIME_LIMITS[level];
    if (timeLimit !== undefined) {
      console.log(`Navigating to game page for level ${level} with time limit ${timeLimit}s...`);
      navigate(`/game/${timeLimit}`); // Navigate to the Gameplay route
    } else {
      console.error(`Error: No time limit defined for level ${level}`);
    }
  };

  return (
    <div
      className="relative min-h-screen w-screen text-white font-sans overflow-y-auto bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url('${MEWTWO_BACKGROUND_URL}')` }}
    >
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-800 text-white text-sm font-semibold shadow-md hover:shadow-lg border border-fuchsia-500 hover:border-fuchsia-400 transition-all duration-300 ease-in-out transform hover:scale-105"
        aria-label="Go back"
      >
        ← Back
      </button>

      <div className="relative z-10 p-4 pt-20 sm:p-8 sm:pt-24 flex flex-col items-center min-h-screen">
        <h1 className="text-center text-fuchsia-400 text-4xl sm:text-5xl font-bold mb-16 sm:mb-24 drop-shadow-lg filter brightness-125">
          🌌 Psychic Challenge Levels 🌌
        </h1>

        {/* Container for the EXACTLY 3 levels */}
        <div
          className="relative z-10 w-full max-w-4xl flex justify-center items-start"
          style={{ minHeight: `${totalHeight}px` }}
        >
          {/* Map directly over the 3 calculated points */}
          {points.map((point) => {
            // Get styles specific to this level (1, 2, or 3)
            const levelStyles = getLevelStyles(point.level);
            // Assuming all 3 levels are always unlocked in this simplified version
            const isLocked = false; // Hardcoded as false

            return (
              // The clickable wrapper for the level node
              <div
                key={point.level}
                className={`absolute z-10 flex items-center group cursor-pointer`} // Always cursor-pointer now
                style={{
                  top: `${point.y - nodeSize / 2}px`,
                  left: `50%`,
                  transform: `translateX(calc(${point.x}px - 50%))`,
                }}
                title={`Level ${point.level}. Time Limit: ${LEVEL_TIME_LIMITS[point.level]}s`}
                onClick={() => handleLevelClick(point.level)} // Call handler on click
              >
                {/* The visual level node */}
                <div
                  className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${levelStyles.gradient}
                             flex items-center justify-center
                             ${levelStyles.textColor} text-2xl font-bold
                             ${levelStyles.nodeTextShadow} ${levelStyles.shadow} border-2 ${levelStyles.border}
                             ${levelStyles.opacity} transition-all duration-300 ease-in-out
                             ${levelStyles.hoverScale} ${levelStyles.hoverBorder} ${levelStyles.hoverShadow}`
                           }
                >
                  <div className={`absolute inset-0 rounded-full ring-1 ring-inset ${levelStyles.innerRing} transition-all duration-300 ${levelStyles.hoverRing}`}></div>
                  {point.level}
                </div>

                {/* Level Name Text (positioned below) */}
                <span
                  className={`absolute whitespace-nowrap text-lg font-semibold text-purple-200 drop-shadow filter brightness-110
                              transition-all duration-300 text-center opacity-80 group-hover:opacity-100 group-hover:text-fuchsia-200
                              top-full mt-3
                              left-1/2 transform -translate-x-1/2
                            `}
                >
                  Lv. {point.level}
                   {/* <span className="block text-xs opacity-70">({LEVEL_TIME_LIMITS[point.level]}s)</span> */}
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