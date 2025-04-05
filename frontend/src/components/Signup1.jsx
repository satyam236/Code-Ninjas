// src/components/Signup1.jsx (Updated for internal navigation)
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Signup = ({ src, alt }) => { // Removed onSubmit, onLoginClick props
  const navigate = useNavigate(); // Get the navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add actual signup logic here (e.g., API call)
    console.log("Performing signup...");
    // Assuming signup is successful, navigate to homepage
    navigate('/homepage');
  };

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <img src={src} alt={alt} className="w-48 h-auto" />
      <h1 className="text-2xl font-bold mt-4 text-gray-800">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-8 max-w-xs w-full">
        {/* Input fields remain the same */}
        <input
          type="text"
          placeholder="Full Name"
          className="p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required // Good practice to add required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button type="submit" className="p-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer">
          Sign Up
        </button>
      </form>

      {/* Login link - Uses internal handler */}
      <p className="mt-6 text-gray-700">
        Already have an account?{' '}
        <span onClick={handleLoginClick} className="text-blue-600 font-semibold hover:underline cursor-pointer">
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;