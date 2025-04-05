import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Instruction = () => {
  const navigate = useNavigate(); // Get the navigate function

  // Replace these URLs with the GIFs you provide
  const gifs = {
    rules: "https://media.giphy.com/media/3o6ZsYm5P38Nv2z5FK/giphy.gif", // Example GIF
    points: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif", // Example GIF
    playGame: "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif", // Example GIF
  };

  const goBack = () => {
    navigate(-1); // Go back to the previous page (usually HomePage)
  };

  return (
    // Main container: Full screen, background, padding, flex column layout, centers content block horizontally
    <div className="min-h-screen w-screen bg-gray-900 text-white p-8 flex flex-col items-center pt-16"> {/* Added padding-top for spacing */}

      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-12">
        Game Instructions
      </h1>

      {/* Wrapper for the sections - ensures vertical stacking and controls width/spacing */}
      {/* flex-col: Stacks the sections vertically */}
      {/* items-center: Centers the sections horizontally within this wrapper */}
      {/* space-y-16: Adds significant vertical space between each section */}
      {/* w-full max-w-4xl: Takes full width up to a maximum */}
      <div className="flex flex-col items-center w-full max-w-4xl space-y-16">

        {/* Section 1: Game Rules */}
        {/* Section layout: flex-col on small screens, flex-row on medium+ */}
        {/* items-center aligns vertically in center, md:items-start aligns to top on medium+ */}
        {/* w-full ensures it takes the width of the parent wrapper */}
        {/* space-y-6 adds space between img/text when stacked, md:space-x-8 adds space when side-by-side */}
        <div className="flex flex-col md:flex-row items-center md:items-start w-full space-y-6 md:space-y-0 md:space-x-8">
          {/* GIF */}
          <img
            src={gifs.rules}
            alt="Game Rules"
            // Responsive width/height, object-cover maintains aspect ratio, flex-shrink-0 prevents shrinking
            className="w-40 h-40 lg:w-48 lg:h-48 rounded-lg shadow-lg object-cover flex-shrink-0"
          />
          {/* Text Content */}
          {/* text-center on small, md:text-left on medium+, flex-grow allows text block to take remaining width */}
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-2xl lg:text-3xl font-semibold text-green-400 mb-4">
              Game Rules
            </h2>
            <p className="text-lg">
              Learn how to play the game:
              <ul className="list-disc list-inside mt-2 space-y-1 text-base">
                <li>Choose your favorite character.</li>
                <li>Follow the instructions on the screen.</li>
                <li>Complete objectives to earn points.</li>
                <li>Play fair and have fun!</li>
              </ul>
            </p>
          </div>
        </div>

        {/* Section 2: Pointing/Trophy System (Same structure as Section 1) */}
        <div className="flex flex-col md:flex-row items-center md:items-start w-full space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={gifs.points}
            alt="Pointing System"
            className="w-40 h-40 lg:w-48 lg:h-48 rounded-lg shadow-lg object-cover flex-shrink-0"
          />
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-2xl lg:text-3xl font-semibold text-blue-400 mb-4">
              Pointing/Trophy System
            </h2>
            <p className="text-lg">
              Here's how you can earn points and trophies:
              <ul className="list-disc list-inside mt-2 space-y-1 text-base">
                <li>Win battles to earn 10 points.</li>
                <li>Special moves give bonus points!</li>
                <li>Earn trophies by completing challenges.</li>
                <li>Climb the leaderboard to become the champion!</li>
              </ul>
            </p>
          </div>
        </div>

        {/* Section 3: How to Use Play Game (Same structure as Section 1) */}
        <div className="flex flex-col md:flex-row items-center md:items-start w-full space-y-6 md:space-y-0 md:space-x-8">
          <img
            src={gifs.playGame}
            alt="How to Play Game"
            className="w-40 h-40 lg:w-48 lg:h-48 rounded-lg shadow-lg object-cover flex-shrink-0"
          />
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-2xl lg:text-3xl font-semibold text-pink-400 mb-4">
              How to Use Play Game
            </h2>
            <p className="text-lg">
              Follow these steps to start playing:
              <ul className="list-disc list-inside mt-2 space-y-1 text-base">
                <li>Click "Play Game" on the homepage.</li>
                <li>Select your favorite anime universe.</li>
                <li>Start your adventure and enjoy!</li>
              </ul>
            </p>
          </div>
        </div>

      </div> {/* End of sections wrapper */}

      {/* Back Button */}
      <div className="text-center mt-16 mb-8"> {/* Added bottom margin */}
        <button
          onClick={goBack}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer font-semibold"
        >
          Back
        </button>
      </div>
    </div> // End of main container
  );
};

export default Instruction;