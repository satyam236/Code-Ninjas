import React, { useState, useEffect } from "react";

// Correct the relative paths to go up two directories
import bg1 from '../../assets/background1.gif'; // Go up from Homepagecomp, up from components, then into assets
import bg2 from '../../assets/background2.gif'; // Adjust path similarly
import bg3 from '../../assets/background3.gif'; // Adjust path similarly

const Background = () => {
  const backgrounds = [
    bg1,
    bg2,
    bg3,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (backgrounds.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 950);
    }, 10000);

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
            currentIndex === index ? "opacity-100" : "opacity-0"
          } ${
            isTransitioning && currentIndex === index
              ? "scale-110 blur-sm"
              : "scale-100 blur-none"
          }`}
          style={{
            backgroundImage: `url(${bg})`,
            zIndex: currentIndex === index ? 1 : 0,
          }}
        />
      ))}

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {backgrounds.map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full transition-all duration-500 ${
              currentIndex === index
                ? "scale-150 bg-red-500"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Background;