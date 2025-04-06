import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Instruction = () => {
  const navigate = useNavigate(); // Get the navigate function

  // Replace these URLs with the GIFs you provide
  const gifs = {
    rules: "https://i.pinimg.com/originals/02/0c/96/020c966afcc1bc1a93ee1ff4511f512c.gif", // Example GIF
    points: "https://i.pinimg.com/originals/10/d5/91/10d59117c43360f3642b64efde4484bd.gif", // Example GIF
    playGame: "https://cdn.dribbble.com/userupload/42496707/file/original-1648c9a929b360270d79cdcca18f346a.gif", // Example GIF
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
            Game Objective
            </h2>
            <p className="text-lg">
              Learn how to play the game:
              <ul className="list-disc list-inside mt-2 space-y-1 text-base">
                <li>Combine 6 numbers (1-9) using +, -, *, /, ^, () to reach exactly 100.</li>
                <li>Level Progression	Levels 1-5: Basic ops; Levels 6-10: Parentheses; Levels 11-30: Exponents.</li>
                <li>Win the game to unlock the next level.</li>
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
              Trophy System
            </h2>
            <p className="text-lg">
              Here's how you can earn  trophies:
              <ul className="list-disc list-inside mt-2 space-y-1 text-base">
                <li>Level 1 (Very Forgiving):
First attempt: +6 🏆
Second attempt: +4 🏆
Third attempt: +3 🏆
Fourth attempt: +1 🏆 (Added 4th attempt reward)
Penalty per wrong attempt: -1 🏆</li>
                <li>Level 2 (Standard):
First attempt: +7 🏆
Second attempt: +4 🏆
Third attempt: +2 🏆
Penalty per wrong attempt: -2 🏆</li>
                <li>Level 3 (Strict Penalty):
First attempt: +9 🏆
Second attempt: +5 🏆
Third attempt: +3 🏆
Penalty per wrong attempt: -5 🏆 (High penalty)</li>
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
                <li>Pick a Level: Click Lv. 1, 2, or 3 to start the timed challenge.</li>
                <li>Make 100: Add operators (+, -, ×, etc.) to the digits to reach 100.</li>
                <li>Check or Reset: Hit "Check Solution" or use "Reset"/"New Number" to try again.</li>
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