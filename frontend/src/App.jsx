// src/App.jsx (Updated to include Instruction route)
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Make sure useNavigate is imported if used within App

// Import your components (Make sure paths are correct)
import Loading from './components/Loading';
import Signup from './components/Signup1';
import Login from './components/Login1';
import HomePage from './components/Homepage';
import Instruction from './components/Homepagecomp/Instrcution';
import Level from './components/Homepagecomp/Level';
import Leaderboard from './components/Homepagecomp/Leaderboard';
import Profile from './components/Homepagecomp/Profile';
import Gamepage from './components/Homepagecomp/Gamepage';
import Playwithfriend from './components/Homepagecomp/Playwithfriend';
// Assuming Loading component image path is correct now
// e.g., import defaultPikachuGif from './components/pikachu-pokemon.gif'; in Loading.jsx
// or using public folder: src="/pikachu-pokemon.gif"

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // You might not need these handle functions here if navigation
  // is handled *inside* Signup and Login components using useNavigate
  // const handleSignupSubmit = (navigate) => { ... };
  // const handleLoginSubmit = (navigate) => { ... };

  if (isLoading) {
    // Use the appropriate src for Loading based on how you fixed the image loading
    // Example if image is in public folder:
    return <Loading src="/pikachu-pokemon.gif" alt="Loading..." />;
    // Example if image is imported within Loading.jsx:
    // return <Loading alt="Loading..." />;
  }

  // After loading, render the main application routes
  return (
    <Routes>
      {/* Redirect root path to signup AFTER loading is done */}
      <Route path="/" element={<Navigate to="/signup" replace />} />

      {/* Signup Page */}
      <Route
        path="/signup"
        element={
          <Signup
            src="https://media.tenor.com/0WkmuOC_W00AAAAj/waving-pikachu.gif"
            alt="Signup Animation"
            // Remove props if navigation is handled internally in Signup
            // onSubmitSuccess={() => handleSignupSubmit(useNavigate())}
            // onNavigateToLogin={() => useNavigate()('/login')}
          />
        }
      />

      {/* Login Page */}
      <Route
        path="/login"
        element={
          <Login
            src="https://media.tenor.com/0WkmuOC_W00AAAAj/waving-pikachu.gif"
            alt="Login Animation"
            // Remove props if navigation is handled internally in Login
            // onSubmitSuccess={() => handleLoginSubmit(useNavigate())}
            // onNavigateToSignup={() => useNavigate()('/signup')}
          />
        }
      />

      {/* Homepage */}
      {/* Make sure Homepage correctly imports Centre from './Homepagecomp/Centre' */}
      <Route path="/homepage" element={<HomePage />} />

      {/* Instruction Page Route */}
      <Route path="/instructions" element={<Instruction />} /> {/* <--- ADD THIS LINE */}
{/*level*/}
<Route path="/level" element={<Level/>}/> {/* <--- ADD THIS LINE */}
<Route path="/leaderboard" element={<Leaderboard />} /> {/* <--- Add Leaderboard Route */}
<Route path="/profile" element={<Profile />} /> {/* <--- Add Profile Route */}  
<Route path="/game" element={<Gamepage />} /> {/* <--- Add Profile Route */}  
<Route path="/play-with-friend" element={<Playwithfriend />} /> {/* <--- Add Profile Route */}
      {/* Optional but Recommended: Add a 404 Not Found Route */}
      {/* <Route path="*" element={<div><h1>404 - Page Not Found</h1><Link to="/">Go Home</Link></div>} /> */}
    </Routes>
  );
};

export default App;