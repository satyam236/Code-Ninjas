import React from 'react';
import Background from './Homepagecomp/background'; // Assuming Background.jsx is already created for background GIFs
import Sidebarright from './Homepagecomp/Sidebarright'; // Import the right sidebar
// 
import Sideleft from './Homepagecomp/Sidebarleft'; // Import the left sidebar (corrected file name)
import Centre from './Homepagecomp/Centre'; // Import the center component

const HomePage = () => {
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-900">
      {/* Background component - Renders behind */}
      <Background />

      {/* Left Sidebar - Positioned on the left side */}
      <Sideleft />

      {/* Right Sidebar - Positioned on the right side */}
      <Sidebarright />

      {/* Center Content - Positioned in the center of the screen */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <Centre />
      </div>

      {/* Footer Section (Optional) */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-white z-30">
        <p className="text-sm opacity-75">© 2025 Multi-Anime Universe. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
