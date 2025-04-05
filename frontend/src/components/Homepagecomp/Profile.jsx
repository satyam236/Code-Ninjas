import React, { useState, useEffect } from "react";
// Removed CSS import: import "./App.css"; // Or the renamed CSS file

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

// --- Component Renamed ---
export default function Profile() {
  // --- State & Effects (remain the same) ---
  const [username, setUsername] = useState("CyberPlayer");
  const [theme, setTheme] = useState("synthwave"); // Default theme
  const [avatar, setAvatar] = useState(avatarList[0]);

  useEffect(() => {
    // Load saved data from localStorage on initial render
    const savedName = localStorage.getItem("username");
    const savedAvatar = localStorage.getItem("avatar");
    // Optionally load saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedName) setUsername(savedName);
    if (savedAvatar) setAvatar(savedAvatar);
    if (savedTheme && themePokemon[savedTheme]) setTheme(savedTheme); // Load theme if valid

  }, []);

  // --- Handlers (remain the same, added theme saving) ---
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    localStorage.setItem("theme", e.target.value); // Save theme change immediately
  };

  const handleSave = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("avatar", avatar);
    localStorage.setItem("theme", theme); // Ensure theme is saved on explicit save too
    alert("✅ Profile saved!");
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all saved data
    setUsername("CyberPlayer"); // Reset to default username
    setAvatar(avatarList[0]); // Reset to default avatar
    setTheme("synthwave"); // Reset to default theme
    alert("🚪 Logged out!");
  };

  const pokemon = themePokemon[theme];

  // --- Theme Styling Logic ---
  const getThemeClasses = () => {
    switch (theme) {
      case "retro":
        // Tailwind doesn't have a direct utility for repeating gradients, use arbitrary property
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
    // App Container: Full screen, flex column, centered, themed background/text
    <div
      className={`w-screen h-screen flex flex-col justify-center items-center overflow-hidden transition-colors duration-300 ease-in-out font-[Orbitron] ${getThemeClasses()}`}
    >
      {/* Theme Selector: Absolute position top right */}
      <div className="absolute top-5 right-[30px] z-[100] text-sm">
        <label className="align-middle">🎨 Theme:</label>
        <select
          value={theme}
          onChange={handleThemeChange}
          // Select styling: Mimics original CSS
          className="ml-2.5 p-[0.4rem] text-base bg-[#111] text-[#0ff] border-2 border-[#0ff] rounded-lg align-middle appearance-none focus:outline-none focus:ring-1 focus:ring-[#0ff]"
        >
          <option value="synthwave">🌃 Synthwave</option>
          <option value="retro">🕹️ Retro Pixel</option>
          <option value="alien">👾 Alien Tech</option>
          <option value="shadow">🖤 Shadow Core</option>
        </select>
      </div>

      {/* Pokemon Wrapper: Flex row, centered, responsive wrap */}
      <div className="w-full flex items-center justify-center gap-8 flex-wrap px-4"> {/* Added padding for smaller screens */}

        {/* Left Pokemon */}
        <img
          src={pokemon.left}
          alt="left-pokemon"
          // Side Pokemon styling: size, rounded, shadow, rotation, transition
          className="w-[150px] h-auto max-h-[250px] rounded-[20px] object-contain shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform duration-300 ease-in-out -rotate-3 hidden md:block" // Hide on small screens
        />

        {/* Account Card: Centered content, themed border/shadow */}
        <div
         className="bg-black/70 border-[3px] border-[#00ffff] p-8 rounded-[20px] w-[90%] max-w-[500px] text-center shadow-[0_0_20px_#00ffff] relative flex flex-col items-center" // Added flex/items-center
        >
          <h1 className="text-2xl font-bold mb-2">🧑‍💻 Player Account</h1> {/* Adjusted margin */}

          {/* Main Avatar: Centered, rounded, border */}
          <img
             src={avatar}
             alt="avatar"
             className="w-[120px] h-[120px] rounded-full my-4 border-[3px] border-[#00ffff] object-cover bg-white" // Removed mx-auto (already centered by parent flex)
           />

          {/* Username Display */}
          <h2 className="text-xl font-semibold mb-2">{username}</h2> {/* Added margin */}

          {/* Username Input: Centered, styled */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 text-base my-4 w-[80%] rounded-lg border-2 border-[#00ffff] text-center bg-black text-[#00ffff] focus:outline-none focus:ring-1 focus:ring-[#00ffff]" // Removed mx-auto
          />

          {/* Avatar Grid: Responsive grid layout */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2.5 my-4 w-full px-2"> {/* Added w-full/padding */}
            {avatarList.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`avatar-${index}`}
                // Avatar Option styling: size, rounded, hover/selected states
                className={`w-[60px] h-[60px] rounded-full cursor-pointer object-cover border-2 bg-white transition-all duration-200 ease-in-out justify-self-center ${ // Added justify-self-center
                  avatar === img
                    ? "border-[#00ffff] shadow-[0_0_10px_#00ffff] scale-105" // Selected state
                    : "border-transparent hover:scale-105 hover:border-[#00ffff]/50" // Default and hover state
                }`}
                onClick={() => setAvatar(img)}
              />
            ))}
          </div>

          {/* Action Buttons: Centered row */}
          <div className="flex justify-center gap-4 mt-2"> {/* Added mt-2 */}
             <button
               className="bg-[#00ffff] text-black border-none px-[1.2rem] py-[0.7rem] text-base rounded-[12px] m-2 cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#00cccc] hover:scale-105"
               onClick={handleSave}
             >
               💾 Save
             </button>
             <button
               className="bg-[#00ffff] text-black border-none px-[1.2rem] py-[0.7rem] text-base rounded-[12px] m-2 cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#00cccc] hover:scale-105"
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
          // Side Pokemon styling: size, rounded, shadow, rotation, transition
           className="w-[150px] h-auto max-h-[250px] rounded-[20px] object-contain shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform duration-300 ease-in-out rotate-3 hidden md:block" // Hide on small screens
        />
      </div>
    </div>
  );
}