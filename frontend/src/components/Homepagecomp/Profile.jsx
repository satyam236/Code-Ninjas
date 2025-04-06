// src/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

// --- Data (remains the same) ---
const avatarList = [
  "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24458108/captain_pikachu.jpg?quality=90&strip=all&crop=7.8125,0,84.375,100",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXzZfFLLZ0j7Y11fCqWITLQDRQm0CrOZT6iA&s",
  "https://i.pinimg.com/564x/68/09/ab/6809ab885ff3878a939bd307cfbfec2d.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPj5Rg21GqUBxemt0kFPE-1_9bdqJJ0e1ieg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-77UzkSh1n7ueLBHQBZNejYVF3aQTSY38vw&s",
  "https://in.portal-pokemon.com/play/resources/pokedex/img/pm/0aa78a0061bda9d88cbb0bbf739cd9cc56522fe9.png"
];

const themePokemon = {
  synthwave: {
    left: "https://img.pokemondb.net/artwork/large/mewtwo.jpg",
    right: "https://img.pokemondb.net/artwork/large/mewtwo.jpg"
  },
  retro: {
    left: "https://img.pokemondb.net/artwork/large/pikachu.jpg",
    right: "https://img.pokemondb.net/artwork/large/pikachu.jpg"
  },
  alien: {
    left: "https://img.pokemondb.net/artwork/large/deoxys.jpg",
    right: "https://img.pokemondb.net/artwork/large/deoxys.jpg"
  },
  shadow: {
    left: "https://img.pokemondb.net/artwork/large/darkrai.jpg",
    right: "https://img.pokemondb.net/artwork/large/darkrai.jpg"
  }
};

export default function Profile() {
  const navigate = useNavigate(); // Get the navigate function

  // --- State & Effects ---
  const [username, setUsername] = useState("CyberPlayer");
  const [theme, setTheme] = useState("synthwave");
  const [avatar, setAvatar] = useState(avatarList[0]);

  useEffect(() => {
    const savedName = localStorage.getItem("username");
    const savedAvatar = localStorage.getItem("avatar");
    const savedTheme = localStorage.getItem("theme");

    if (savedName) setUsername(savedName);
    if (savedAvatar) setAvatar(savedAvatar);
    if (savedTheme && themePokemon[savedTheme]) setTheme(savedTheme);

  }, []); // No need for navigate in dependency array here

  // --- Handlers ---
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    localStorage.setItem("theme", e.target.value);
  };

  const handleSave = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("avatar", avatar);
    localStorage.setItem("theme", theme);
    alert("✅ Profile saved!");
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("🚪 Logged out!");
    navigate('/login'); // Navigate to the login page
  };

  // --- NEW Handler for Back Button ---
  const handleBack = () => {
    navigate(-1); // Go back one step in history
  };

  const pokemon = themePokemon[theme];

  // --- Theme Styling Logic ---
  const getThemeClasses = () => {
    switch (theme) {
      case "retro":
        return "bg-[repeating-linear-gradient(45deg,#2b2b2b,#2b2b2b_10px,#3d3d3d_10px,#3d3d3d_20px)] text-[#00ff99]";
      case "alien":
        return "bg-gradient-to-br from-[#000428] to-[#004e92] text-[#00ffcc]";
      case "shadow":
        return "bg-gradient-to-r from-[#232526] to-[#414345] text-[#f5f5f5]";
      case "synthwave":
      default:
        return "bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white";
    }
  };

  // --- Main Render using Tailwind ---
  return (
    // App Container
    <div
      className={`w-screen h-screen flex flex-col justify-center items-center overflow-hidden transition-colors duration-300 ease-in-out font-[Orbitron] relative ${getThemeClasses()}`} // Added relative positioning
    >
      {/* --- ADDED Back Button --- */}
      <button
        onClick={handleBack}
        className="absolute top-5 left-5 z-[100] bg-[#00ffff]/80 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out hover:bg-[#00ffff] hover:scale-105 shadow-md"
        aria-label="Go back"
      >
        ← Back {/* Using HTML arrow entity */}
      </button>

      {/* Theme Selector */}
      <div className="absolute top-5 right-5 sm:right-[30px] z-[100] text-sm"> {/* Adjusted right padding for consistency */}
        <label className="align-middle hidden sm:inline">🎨 Theme:</label> {/* Hide label on very small screens */}
        <select
          value={theme}
          onChange={handleThemeChange}
          className="ml-1 sm:ml-2.5 p-[0.4rem] text-sm sm:text-base bg-[#111]/80 text-[#0ff] border-2 border-[#0ff] rounded-lg align-middle appearance-none focus:outline-none focus:ring-1 focus:ring-[#0ff]"
          aria-label="Select theme"
        >
          <option value="synthwave">🌃 Synthwave</option>
          <option value="retro">🕹️ Retro Pixel</option>
          <option value="alien">👾 Alien Tech</option>
          <option value="shadow">🖤 Shadow Core</option>
        </select>
      </div>

      {/* Pokemon Wrapper */}
      <div className="w-full flex items-center justify-center gap-4 md:gap-8 flex-wrap px-4 pt-20 sm:pt-0"> {/* Added top padding for smaller screens to avoid overlap */}

        {/* Left Pokemon */}
        <img
          src={pokemon.left}
          alt="left-pokemon"
          className="w-[120px] md:w-[150px] h-auto max-h-[200px] md:max-h-[250px] rounded-[20px] object-contain shadow-[0_0_15px_rgba(255,255,255,0.2)] md:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform duration-300 ease-in-out -rotate-3 hidden md:block" // Adjusted size/shadow slightly
        />

        {/* Account Card */}
        <div
         className="bg-black/70 border-[3px] border-[#00ffff] p-6 md:p-8 rounded-[20px] w-[90%] max-w-[450px] md:max-w-[500px] text-center shadow-[0_0_15px_#00ffff] md:shadow-[0_0_20px_#00ffff] relative flex flex-col items-center" // Adjusted padding/max-width slightly
        >
          <h1 className="text-xl md:text-2xl font-bold mb-2">🧑‍💻 Player Account</h1>

          {/* Main Avatar */}
          <img
             src={avatar}
             alt="avatar"
             className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full my-3 md:my-4 border-[3px] border-[#00ffff] object-cover bg-white" // Adjusted size/margin slightly
           />

          {/* Username Display */}
          <h2 className="text-lg md:text-xl font-semibold mb-2">{username}</h2>

          {/* Username Input */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 text-sm md:text-base my-3 md:my-4 w-[80%] rounded-lg border-2 border-[#00ffff] text-center bg-black text-[#00ffff] focus:outline-none focus:ring-1 focus:ring-[#00ffff]" // Adjusted size/margin slightly
            aria-label="Enter username"
          />

          {/* Avatar Grid */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2 md:gap-2.5 my-3 md:my-4 w-full px-1 md:px-2"> {/* Adjusted grid/gap/padding slightly */}
            {avatarList.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`avatar-${index}`}
                className={`w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full cursor-pointer object-cover border-2 bg-white transition-all duration-200 ease-in-out justify-self-center ${
                  avatar === img
                    ? "border-[#00ffff] shadow-[0_0_8px_#00ffff] md:shadow-[0_0_10px_#00ffff] scale-105" // Selected state
                    : "border-transparent hover:scale-105 hover:border-[#00ffff]/50" // Default and hover state
                }`}
                onClick={() => setAvatar(img)}
                aria-label={`Select avatar ${index + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-4 mt-2"> {/* Stack buttons on small screens */}
             <button
               className="bg-[#00ffff] text-black border-none px-[1rem] py-[0.6rem] md:px-[1.2rem] md:py-[0.7rem] text-sm md:text-base rounded-[10px] md:rounded-[12px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#00cccc] hover:scale-105" // Adjusted padding/border-radius
               onClick={handleSave}
             >
               💾 Save Profile
             </button>
             <button
               className="bg-[#f04d5a]/90 text-white border-none px-[1rem] py-[0.6rem] md:px-[1.2rem] md:py-[0.7rem] text-sm md:text-base rounded-[10px] md:rounded-[12px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#f04d5a] hover:scale-105" // Changed color for distinction, adjusted padding/border-radius
               onClick={handleLogout}
             >
               🚪 Logout
             </button>
          </div>
        </div>

        {/* Right Pokemon */}
        <img
          src={pokemon.right}
          alt="right-pokemon"
           className="w-[120px] md:w-[150px] h-auto max-h-[200px] md:max-h-[250px] rounded-[20px] object-contain shadow-[0_0_15px_rgba(255,255,255,0.2)] md:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform duration-300 ease-in-out rotate-3 hidden md:block" // Adjusted size/shadow slightly
        />
      </div>
    </div>
  );
}