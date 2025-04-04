import React from "react";

const Level = () => {
  const levels = Array.from({ length: 100 }, (_, i) => i + 1); // Generate levels

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white overflow-y-auto">
      {/* Background GIF */}
      <div className="fixed inset-0 z-0 opacity-50">
        <img
          src="https://media1.tenor.com/m/5VMeflVFyK4AAAAC/doji-beyblade-beyblade.gif"
          alt="Beyblade Battle"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 bg-black/80 backdrop-blur-sm p-8">
        <h1 className="text-center text-yellow-400 text-4xl font-bold mb-8">
          ⚡ Beyblade Metal Fusion Levels ⚡
        </h1>

        {/* Levels Display */}
        <div className="flex flex-col items-center space-y-6">
          {levels.map((level) => (
            <div key={level} className="flex items-center space-x-4">
              {/* Level Node */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-red-600 flex items-center justify-center text-white font-bold shadow-md">
                {level}
              </div>
              {/* Level Name */}
              <span className="text-lg font-semibold text-yellow-400">
                Level {level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Level;
