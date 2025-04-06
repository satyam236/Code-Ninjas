import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Signup = ({ src, alt }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("inover");
    // Collect form data
    const formData = {
      fullName: e.target.fullName.value,
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    console.log(formData);
    try {
      const response = await axios.post("http://localhost:3000/user/signup", {
        email: formData.email,
        fullname: formData.fullName,
        username: formData.username,
        password: formData.password,
      });
      console.log(response)
      alert(response?.data?.message)
      navigate("/homepage");
    } catch (err) {
      console.error("Error signing up:", err);
      setError(err.message); // Display error message to user
    }
  };

  const handleLoginClick = () => {
    navigate("/login"); // Navigate to login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <img src={src} alt={alt} className="w-48 h-auto" />
      <h1 className="text-2xl font-bold mt-4 text-gray-800">Sign Up</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 mt-8 max-w-xs w-full"
      >
        {/* Input fields */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {/* <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-8 max-w-xs w-full"> */}
        {/* Input fields */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-2.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="p-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Sign Up
        </button>
      </form>

      {/* Display error message if any */}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {/* Login link */}
      <p className="mt-6 text-gray-700">
        Already have an account?{" "}
        <span
          onClick={() => {
            handleLoginClick;
          }}
          className="text-blue-600 font-semibold hover:underline cursor-pointer"
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
