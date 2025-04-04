import React from 'react';
import { SpriteAnimator } from 'react-sprite-animator';

const PikachuAnimation = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f8ff' }}>
      <SpriteAnimator
        sprite="/path-to/pikachu-sprite.png" // Replace with the path to your Pikachu sprite sheet
        width={64} // Width of a single frame in the sprite sheet
        height={64} // Height of a single frame in the sprite sheet
        fps={12} // Frames per second for the animation
        direction="horizontal" // Direction of frames in the sprite sheet (horizontal or vertical)
        scale={2} // Scale up the animation size
        shouldAnimate={true} // Enable animation
        stopLastFrame={false} // Keep looping the animation
      />
    </div>
  );
};

export default PikachuAnimation;