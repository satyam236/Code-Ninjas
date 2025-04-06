// src/components/Leaderboard.jsx (Add Back button)
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate

// ... (initialData, medalEmojis remain the same) ...
const initialData = [
  { id: 1, name: "Dubey", score: 18, avatar:
  "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24458108/captain_pikachu.jpg?quality=90&strip=all&crop=7.8125,0,84.375,100" },
  { id: 2, name: "Sharma", score: 13, avatar: "https://i.pinimg.com/564x/68/09/ab/6809ab885ff3878a939bd307cfbfec2d.jpg" },
  { id: 3, name: 'Happy', score: 12, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPj5Rg21GqUBxemt0kFPE-1_9bdqJJ0e1ieg&s' },
  { id: 4, name: 'adarsh', score: 11, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-77UzkSh1n7ueLBHQBZNejYVF3aQTSY38vw&s' },
  { id: 5, name: 'Himanshu', score: 8, avatar: 'https://in.portal-pokemon.com/play/resources/pokedex/img/pm/0aa78a0061bda9d88cbb0bbf739cd9cc56522fe9.png' },
  // ... more players
];
const medalEmojis = ["🥇", "🥈", "🥉"];


function Leaderboard() {
  const navigate = useNavigate(); // <--- Get navigate function
  const [players, setPlayers] = useState(initialData);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleSortToggle = () => setSortAsc(!sortAsc);

  const goBack = () => {
    navigate(-1); // Go back to the previous page in history (likely HomePage)
  };

  const filteredPlayers = players
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortAsc ? a.score - b.score : b.score - a.score))
    .slice(0, 50);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-4"> {/* Added base padding */}
      <div className="max-w-4xl w-full p-6 md:p-8 bg-white/10 rounded-xl shadow-xl backdrop-blur-lg text-center"> {/* Responsive padding */}
        {/* Back Button (Positioned Top Left) */}
        <button
          onClick={goBack}
          className="absolute top-4 left-4 px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition z-10" // Ensure z-index if needed
          title="Go Back"
        >
          ← Back {/* Left arrow */}
        </button>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6">🏆 Leaderboard</h1>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          {/* ... search input and sort button ... */}
           <input
            type="text"
            placeholder="🔍 Search players..."
            value={search}
            onChange={handleSearch}
            className="flex-grow px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-yellow-400"
          />
          <button
            onClick={handleSortToggle}
            className="px-4 py-2 rounded-md bg-red-500 text-white font-bold hover:bg-red-600 transition"
          >
            Sort: {sortAsc ? "⬆️ Asc" : "⬇️ Desc"}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto"> {/* Make table scrollable horizontally if needed */}
          <table className="w-full border-collapse overflow-hidden rounded-lg shadow-lg min-w-[400px]"> {/* min-width prevents excessive squishing */}
            {/* ... table thead and tbody ... */}
             <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4 text-sm">#</th>
                <th className="py-2 px-4 text-sm">Player</th>
                <th className="py-2 px-4 text-sm">Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player, index) => (
                <tr
                  key={player.id}
                  className="hover:bg-gray-700 transition duration-300 text-sm"
                >
                  <td className="py-2 px-4">
                    {index < 3 ? medalEmojis[index] : index + 1}
                  </td>
                  <td className="py-2 px-4 flex items-center gap-2 md:gap-3 justify-center"> {/* Adjusted gap */}
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" // Responsive avatar
                    />
                    <span className="truncate">{player.name}</span> {/* Prevent long names breaking layout */}
                  </td>
                  <td className="py-2 px-4 font-medium">{player.score}</td> {/* Made score bold */}
                </tr>
              ))}
               {filteredPlayers.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 px-4 text-center text-gray-400">No players found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Leaderboard;