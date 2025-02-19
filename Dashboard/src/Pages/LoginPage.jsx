import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Importing the spinner component

const LoginPage = () => {
  const [email, setEmail] = useState(""); // state to hold email input
  const [password, setPassword] = useState(""); // state to hold password input
  const [errorMessage, setErrorMessage] = useState(""); // state for error messages
  const [loading, setLoading] = useState(false); // state to manage the loading spinner

  const navigate = useNavigate(); // useNavigate for routing

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent default form submission behavior
    setLoading(true); // Show spinner when login starts

    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:3000/api/users/login', { email, password });

      const token = response.data.token; // Get token from response
      const username = response.data.username; // Get username from response
      const role = response.data.role; // Get role from response

      // Store token, username, and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userName', username);
      localStorage.setItem('role', role);

      // Redirect based on role
      if (role === "admin" || role === "moderator") {
        navigate('/dashboard');
      } else if (role === "student") {
        navigate('/studentdashboard');
      } else if (role === "instructor") {
        navigate('/instructordashboard');
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Login failed, please check your credentials");
    } finally {
      setLoading(false); // Hide spinner after login attempt
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center z-50">
      <div className="w-full h-full flex flex-col md:flex-row items-center gap-8 justify-center p-4">
        {/* School Logo */}
        <div className="p-6 rounded-full bg-opacity-40 backdrop-blur-md shadow-lg">
          <img
            src="lion.jpg" // Replace with your school logo
            alt="School Logo"
            className="w-32 h-32 rounded-full object-contain"
          />
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center items-center mb-6">
              <ClipLoader color="#4F46E5" loading={loading} size={50} />
            </div>
          ) : (
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">SAMGE SCHOOL</h2>
          )}

          <form onSubmit={handleLogin} className={`${loading && "opacity-50 pointer-events-none"}`}>
            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                placeholder="Enter your password"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-600 text-sm text-center mb-4">{errorMessage}</p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-gray-600">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="text-indigo-500 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;