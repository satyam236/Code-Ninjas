import React, { useState, useEffect } from "react";

const Background = () => {
  // Array of background image URLs
  const backgrounds = [
    "https://img.uhdpaper.com/wallpaper/pokemon-ball-house-anime-digital-art-68@1@o",
    "https://images.alphacoders.com/998/998181.jpg",
    "https://wallpapers.com/images/high/pokemon-battle-background-j620nq8sjlscuhox.webp",
    "https://wallpapercat.com/w/full/6/0/a/905748-1920x1080-desktop-full-hd-legendary-pokemon-wallpaper-image.jpg",
    "https://wallpapers.com/images/hd/legendary-pokemon-pictures-501q8sksm497c4fc.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (backgrounds.length <= 1) return; // No transition needed for a single image

    const interval = setInterval(() => {
      setIsTransitioning(true); // Start transition effect
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % backgrounds.length); // Update index cyclically
        setTimeout(() => setIsTransitioning(false), 50); // End transition effect
      }, 950);
    }, 10000); // Change background every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [backgrounds.length]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Render each background */}
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

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {backgrounds.map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full transition-all duration-500 ${
              currentIndex === index ? "scale-150 bg-red-500" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Background;
