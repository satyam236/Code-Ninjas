// src/components/Login1.jsx (Updated for internal navigation)
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = ({ src, alt }) => { // Removed onSubmit, onSignupClick props
  const navigate = useNavigate(); // Get the navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add actual login logic here (e.g., API call)
    console.log("Performing login...");
    // Assuming login is successful, navigate to homepage
    navigate('/homepage');
  };

  const handleSignupClick = () => {
    navigate('/signup'); // Navigate to signup page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <img src={src} alt={alt} className="w-48 h-auto" />
      <h1 className="text-2xl font-bold mt-4 text-gray-800">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-8 max-w-xs w-full">
         {/* Input fields remain the same */}
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
          Login
        </button>
      </form>

      {/* Signup link - Uses internal handler */}
      <p className="mt-6 text-gray-700">
        Don't have an account?{' '}
        <span onClick={handleSignupClick} className="text-blue-600 font-semibold hover:underline cursor-pointer">
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;