import React, { useState, useEffect } from 'react';
// Import useNavigate if using React Router
import { useNavigate } from 'react-router-dom'; // <--- Add this import

// Constants for LocalStorage keys
const LOCALSTORAGE_USERNAME_KEY = 'username';
const LOCALSTORAGE_AVATAR_KEY = 'avatar';
const LOCALSTORAGE_THEME_KEY = 'theme'; // Added key for theme persistence

const avatarList = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Spiderman",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Ironman",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Thor",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=WonderWoman",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Hulk",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Deadpool"
];

// Theme styles mapping using Tailwind classes (assuming this is defined as before)
const themeStyles = {
  neon: { /* ...styles */ container: "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-cyan-300", card: "bg-black/40 border-cyan-400/30 shadow-cyan-500/40", cardText: "text-cyan-300", avatarBorder: "border-cyan-300", input: "bg-white/10 border-cyan-400/30 placeholder:text-cyan-300/60 focus:border-cyan-300", saveButton: "bg-cyan-500/20 border-cyan-400 hover:bg-cyan-500/30 hover:shadow-cyan-400/50", logoutButton: "bg-red-500/20 border-red-500 hover:bg-red-500/30 hover:shadow-red-500/50", selectedAvatar: "border-cyan-300 shadow-cyan-400/60", selectorText: "text-cyan-300", backButton: "text-cyan-300 border-cyan-400/50 hover:bg-white/10" },
  frost: { /* ...styles */ container: "bg-gradient-to-br from-[#e0eafc] via-[#cfdef3] to-[#e0eafc] text-gray-800", card: "bg-white/50 border-gray-400/30 shadow-gray-500/20", cardText: "text-gray-800", avatarBorder: "border-gray-600", input: "bg-black/5 border-gray-400/30 placeholder:text-gray-800/60 focus:border-blue-500", saveButton: "bg-blue-500/70 border-blue-600 text-white hover:bg-blue-600 hover:shadow-blue-400/50", logoutButton: "bg-red-600/70 border-red-700 text-white hover:bg-red-700 hover:shadow-red-500/50", selectedAvatar: "border-blue-500 shadow-blue-500/50", selectorText: "text-gray-800", backButton: "text-gray-700 border-gray-400/50 hover:bg-black/5" },
  inferno: { /* ...styles */ container: "bg-gradient-to-br from-[#ff4e50] via-[#f9d423] to-[#ff4e50] text-yellow-900", card: "bg-white/30 border-orange-300/50 shadow-orange-400/40", cardText: "text-yellow-900", avatarBorder: "border-red-500", input: "bg-white/30 border-orange-400/50 placeholder:text-yellow-900/60 focus:border-red-500", saveButton: "bg-red-500/80 border-red-600 text-white hover:bg-red-600 hover:shadow-red-400/50", logoutButton: "bg-gray-800/70 border-gray-900 text-white hover:bg-gray-900 hover:shadow-black/50", selectedAvatar: "border-red-500 shadow-red-500/50", selectorText: "text-yellow-950", backButton: "text-yellow-950 border-orange-600/50 hover:bg-white/20" },
  jungle: { /* ...styles */ container: "bg-gradient-to-br from-[#134e4a] via-[#2dd4bf] to-[#134e4a] text-teal-100", card: "bg-teal-900/50 border-teal-400/40 shadow-teal-500/30", cardText: "text-teal-100", avatarBorder: "border-teal-300", input: "bg-white/10 border-teal-400/40 placeholder:text-teal-100/60 focus:border-teal-300", saveButton: "bg-teal-500/30 border-teal-400 hover:bg-teal-500/40 hover:shadow-teal-400/50", logoutButton: "bg-orange-600/30 border-orange-500 hover:bg-orange-600/40 hover:shadow-orange-500/50", selectedAvatar: "border-teal-300 shadow-teal-400/50", selectorText: "text-teal-100", backButton: "text-teal-100 border-teal-400/50 hover:bg-white/10" }
};


export default function Profile() {
  const [username, setUsername] = useState('HeroPlayer');
  const [theme, setTheme] = useState('neon'); // Default theme
  const [avatar, setAvatar] = useState(avatarList[0]);

  // Initialize navigate hook (requires react-router-dom)
  const navigate = useNavigate(); // <--- Initialize hook

  useEffect(() => {
    const savedName = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
    const savedAvatar = localStorage.getItem(LOCALSTORAGE_AVATAR_KEY);
    const savedTheme = localStorage.getItem(LOCALSTORAGE_THEME_KEY); // Load theme
    if (savedName) setUsername(savedName);
    if (savedAvatar) setAvatar(savedAvatar);
    if (savedTheme && themeStyles[savedTheme]) setTheme(savedTheme); // Set loaded theme
  }, []);

  const handleThemeChange = (e) => {
      const newTheme = e.target.value;
      setTheme(newTheme);
      localStorage.setItem(LOCALSTORAGE_THEME_KEY, newTheme); // Save theme preference
  }

  const handleSave = () => {
    localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, username);
    localStorage.setItem(LOCALSTORAGE_AVATAR_KEY, avatar);
    alert('Profile saved!');
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
    localStorage.removeItem(LOCALSTORAGE_AVATAR_KEY);
    localStorage.removeItem(LOCALSTORAGE_THEME_KEY); // Remove theme
    setUsername('HeroPlayer');
    setAvatar(avatarList[0]);
    setTheme('neon'); // Reset theme to default
    alert('Logged out!');
    // Optional: Navigate to login or home page after logout
    // navigate('/login');
  };

  // Back button handler
  const handleBack = () => {
    navigate(-1); // Go back to the previous page in history
    // If not using react-router, replace with your navigation logic:
    // e.g., onBackProp();
  };

  const currentThemeStyles = themeStyles[theme] || themeStyles.neon;

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen w-screen transition-colors duration-400 ${currentThemeStyles.container}`}>
      {/* Top Right Controls Container */}
      <div className="absolute top-5 right-5 sm:right-8 flex items-center gap-4 z-20">
         {/* Back Button */}
         <button
            onClick={handleBack}
            // Apply theme-specific or neutral styling
            className={`px-3 py-1 rounded-md border text-sm font-medium transition-colors duration-200 ${currentThemeStyles.backButton}`}
            title="Go Back" // Tooltip
         >
            {/* Using ← arrow character, replace with SVG icon if preferred */}
            ← Back
         </button>

         {/* Theme Selector */}
         <div className="text-sm flex items-center">
             <label className={`${currentThemeStyles.selectorText} mr-2 hidden sm:inline`}>🎨 Theme:</label> {/* Hide label on very small screens */}
             <select
                value={theme}
                onChange={handleThemeChange}
                className={`px-2 py-1 rounded bg-black/20 text-inherit border border-white/20 backdrop-blur-sm appearance-none ${currentThemeStyles.selectorText}`} // Use theme text color
             >
                <option value="neon">🌌 Neon</option>
                <option value="frost">🧊 Frost</option>
                <option value="inferno">🔥 Inferno</option>
                <option value="jungle">🍃 Jungle</option>
             </select>
         </div>
      </div>

      {/* Account Card */}
      <div
        className={`relative z-10 bg-opacity-40 backdrop-filter backdrop-blur-lg p-8 rounded-2xl border shadow-lg max-w-md w-[90%] text-center transition-all duration-300 ${currentThemeStyles.card}`}
      >
        <h1 className={`text-2xl font-bold mb-6 ${currentThemeStyles.cardText}`}>
          Player Account
        </h1>
        <img
          src={avatar}
          alt="avatar"
          className={`w-32 h-32 rounded-full border-4 ${currentThemeStyles.avatarBorder} mb-4 bg-white object-cover mx-auto shadow-md`}
        />
        <h2 className={`text-xl font-semibold mb-4 ${currentThemeStyles.cardText}`}>
          {username}
        </h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className={`px-4 py-2 rounded-lg border text-center w-4/5 mx-auto text-lg ${currentThemeStyles.cardText} ${currentThemeStyles.input} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent`}
        />
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-6 mb-2">
          {avatarList.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`avatar-${index}`}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full cursor-pointer transition-all duration-200 ease-in-out border-2 bg-white hover:scale-110 hover:shadow-md ${
                avatar === img
                  ? `${currentThemeStyles.selectedAvatar} shadow-lg scale-105`
                  : 'border-transparent'
              }`}
              onClick={() => setAvatar(img)}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button
            className={`px-5 py-2 rounded-lg font-bold shadow-md border transition-all duration-200 ease-in-out hover:shadow-lg ${currentThemeStyles.saveButton}`}
            onClick={handleSave}
          >
            💾 Save
          </button>
          <button
            className={`px-5 py-2 rounded-lg font-bold shadow-md border transition-all duration-200 ease-in-out hover:shadow-lg ${currentThemeStyles.logoutButton}`}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}