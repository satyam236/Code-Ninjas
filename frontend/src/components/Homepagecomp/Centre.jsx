import React from "react";
import { useNavigate } from "react-router-dom"; // For navigation

const Centre = () => {
  const navigate = useNavigate(); // React Router's navigation hook

  // --- Navigation Handlers ---
  const handlePlayGameClick = () => {
    // Navigate to the actual game route (you'll need to define this route in App.jsx)
    navigate("/level");
  };

  const handleInstructionsClick = () => {
    // Navigate to the instructions page (this uses the correct path)
    navigate("/instructions"); // Ensure this path matches the Route in App.jsx
  };

  return (
    <div
      className={`
        absolute inset-0 flex flex-col items-center justify-center /* Centered content */
        text-white z-20 /* Positioned above background but below sidebars */
        pointer-events-auto /* Allows interaction with buttons */
      `}
    >
      {/* Game Name */}
      <h1
        className={`
          mb-32 text-6xl font-bold tracking-wide text-yellow-400 /* Increased gap */
          drop-shadow-lg animate-bounce
        `}
      >
        Number Pokemon
      </h1>

      {/* Play New Game Button */}
      <button
        className={`
          px-8 py-4 rounded-full
          bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500
          text-white text-xl font-semibold tracking-wide uppercase
          shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
          hover:scale-110 animate-pulse
        `}
        onClick={handlePlayGameClick} // Correct handler
      >
        Play New Game
      </button>

      {/* Creative Arrow pointing upward */}
      <div className="relative mt-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 50"
          className="w-16 h-8 text-yellow-400 animate-bounce"
        >
          <path
            d="M10 40 C 40 10, 60 10, 90 40"
            stroke="yellow"
            strokeWidth="4"
            fill="none"
          />
          <polygon
            points="85,35 90,40 85,45"
            fill="yellow"
          />
        </svg>
      </div>

      {/* Instructions Button */}
      <button
        className={`
          mt-2 px-6 py-3 rounded-full
          bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500
          text-white text-lg font-medium tracking-wide uppercase
          shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
          hover:scale-110
        `}
        // 👇 --- THIS IS THE CORRECTED LINE --- 👇
        onClick={handleInstructionsClick} // Use the navigation handler function
      >
        Instructions
      </button>
    </div>
  );
};

export default Centre;