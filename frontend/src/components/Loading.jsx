import React from "react";
// 1. Import the image file directly
import defaultPikachuGif from "../assets/pikachu-pokemon.gif";
const Loading = ({src, alt}) => {
  // Global style effect remains the same
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';

    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);

  // 2. Use the imported variable as the default source
  const imageSrc = src || defaultPikachuGif;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgb(121, 174, 225)',
      padding: '0',
      margin: '0',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      <img
        src={defaultPikachuGif} // Use the variable here
        alt={alt || "Loading"}
        style={{width: '200px', height: 'auto'}}
      />
      <h1 style={{
        fontSize: '2rem',
        marginTop: '1rem',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>Loading</h1>
    </div>
  );
};
export default Loading;