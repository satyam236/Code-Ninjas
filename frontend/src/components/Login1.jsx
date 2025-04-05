import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ src, alt }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect form data using name attributes
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // Assuming login is successful, navigate to homepage
      navigate('/homepage');
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.message); // Display error message to user
    }
  };

  const handleSignupClick = () => {
    navigate('/signup'); // Navigate to signup page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <img src={src} alt={alt} className="w-48 h-auto" />
      <h1 className="text-2xl font-bold mt-4 text-gray-800">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-8 max-w-xs w-full">
        {/* Input fields with name attributes */}
        <input
          type="email"
          name="email" // Add name attribute
          placeholder="Email"
          className="p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          name="password" // Add name attribute
          placeholder="Password"
          className="p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button type="submit" className="p-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer">
          Login
        </button>
      </form>

      {/* Display error message if any */}
      {error && <p className="mt-4 text-red-600">{error}</p>}

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
