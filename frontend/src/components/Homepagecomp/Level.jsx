import React from "react";
import { useNavigate } from "react-router-dom";

// --- 1. Removed the local image import ---
// import omnitrixBackground from "../../assets/level-background.jpg"; // No longer needed

// Assume this comes from props or state in a real app
const CURRENT_LEVEL = 12; // Example: The player is currently on level 12

// --- Define the background image URL ---
const BACKGROUND_IMAGE_URL = "https://wallpaperbat.com/img/875934-download-ben-10-omnitrix-glowing-in-the-dark-wallpaper.jpg";

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

  // --- Define Style Variations (Green/Black Omnitrix Theme) ---
  const getLevelStyles = (level) => {
     // Base styles for locked levels (often similar to default)
     let styles = {
        gradient: "from-slate-800 via-gray-900 to-black", // Dark, unobtrusive
        border: "border-gray-700",
        textColor: "text-gray-600", // Muted text
        shadow: "shadow-inner", // Subtle inner shadow
        opacity: "opacity-60", // Dimmed
        hoverScale: "group-hover:scale-100", // No hover growth for locked
        innerRing: "ring-gray-700/20",
        hoverBorder: "group-hover:border-gray-600",
        hoverShadow: "",
        hoverRing: "group-hover:ring-gray-700/30",
        nodeTextShadow: "drop-shadow-none",
      };

    if (level < currentLevel) { // COMPLETED - Shades of Dark Green
      styles.gradient = "from-emerald-900 via-green-950 to-black"; // Deeper greens
      styles.border = "border-emerald-700/70";
      styles.textColor = "text-emerald-300"; // Lighter green text
      styles.opacity = "opacity-80"; // Slightly less opaque than current
      styles.hoverScale = "group-hover:scale-105";
      styles.hoverBorder = "group-hover:border-emerald-500";
      styles.innerRing = "ring-emerald-600/30";
      styles.hoverRing = "group-hover:ring-emerald-600/40";
      styles.nodeTextShadow = "drop-shadow-sm"; // Subtle shadow
      styles.shadow = "shadow-lg";

    } else if (level === currentLevel) { // ONGOING - Bright Green Glow (Omnitrix Active)
      styles.gradient = "from-lime-600 via-green-600 to-emerald-700"; // Vibrant greens
      styles.border = "border-lime-400"; // Bright border
      styles.textColor = "text-white"; // High contrast text
      styles.shadow = "shadow-xl shadow-lime-400/60"; // Prominent glow effect
      styles.opacity = "opacity-100"; // Fully opaque
      styles.hoverScale = "group-hover:scale-110";
      styles.hoverBorder = "group-hover:border-lime-300";
      styles.hoverShadow = "group-hover:shadow-2xl group-hover:shadow-lime-300/70"; // Enhanced hover glow
      styles.innerRing = "ring-lime-300/40";
      styles.hoverRing = "group-hover:ring-lime-300/50";
      styles.nodeTextShadow = "drop-shadow"; // Clear text shadow

    }
    // Locked levels (level > currentLevel) retain the base styles defined initially.

    return styles;
  };

  // --- Calculate total height based on number of rows ---
  const numRows = Math.ceil(levels.length / columns);
  const totalHeight = initialOffsetY + (numRows > 0 ? (numRows - 1) : 0) * verticalSpacing + nodeSize / 2 + 50;

  const handleLevelClick = (level) => {
    if (level <= currentLevel) {
      console.log(`Navigating to game page for level ${level}...`);
      navigate("/game"); // Or navigate(`/game/${level}`)
    } else {
      console.log(`Level ${level} is locked.`);
    }
  };

  return (
    // --- 2. Apply background image URL to the main container ---
    <div
      className="relative min-h-screen w-screen text-white font-sans overflow-y-auto
                 bg-cover bg-center bg-no-repeat bg-fixed" // Add background properties
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }} // Set the image using the URL string
    >
      {/* Optional: Add a semi-transparent overlay if needed for text readability */}
      {/* <div className="absolute inset-0 bg-black/50 z-0"></div> */}

      {/* Content Area */}
      <div className="relative z-10 p-4 sm:p-8 flex flex-col items-center min-h-screen">
        {/* --- 3. Adjust Title Style --- */}
        <h1 className="text-center text-lime-400 text-4xl sm:text-5xl font-bold mb-16 sm:mb-24 drop-shadow-lg filter brightness-125">
          ⚡ Ben 10 Levels ⚡ {/* Changed title text slightly */}
        </h1>

        {/* Container for Levels */}
        <div
          className="relative z-10 w-full max-w-4xl"
          style={{ height: `${totalHeight}px` }}
        >
          {/* Level Nodes */}
          {points.map((point) => {
            const levelStyles = getLevelStyles(point.level);
            const isLocked = point.level > currentLevel;

            return (
              <div
                key={point.level}
                className={`absolute z-10 flex items-center group ${
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
                {/* Level Node (visual part) */}
                <div
                  className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${levelStyles.gradient}
                             flex items-center justify-center
                             ${levelStyles.textColor}
                             text-xl font-bold ${/* --- 4. Adjusted text size --- */ ''}
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

                {/* Level Name - Positioned right */}
                <span
                  className={`absolute whitespace-nowrap text-lg font-semibold text-lime-200 drop-shadow filter brightness-110 ${/* --- 5. Adjusted popup text --- */''}
                              transition-all duration-300
                              ${
                                isLocked
                                  ? "opacity-0 group-hover:opacity-0 pointer-events-none"
                                  : "opacity-0 group-hover:opacity-100 group-hover:translate-y-[-2px] group-hover:text-lime-100" // Brighter lime on hover
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