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
      const role = response.data.role

      // Store both token and username in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userName', username);
      localStorage.setItem('role', role);
      if(role === "admin" || role === "modarator"){
        navigate('/dashboard');
      }
      if(role === "student"){
        navigate('/studentdashboard');
      }
      if(role === "instructor"){
        navigate('/instructordashboard');
      }
      // Navigate to the dashboard or any other page after login
      // navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Login failed, please check your credentials");
    } finally {
      setLoading(false); // Hide spinner after login attempt
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center z-50">
      <div className="w-full h-full flex flex-col md:flex-row items-center gap-5 justify-center">
        {/* Kibabi Logo */}
        <div className="p-4 rounded-full bg-opacity-20 backdrop-blur-md">
          <img src="lion.jpg" alt="Kibabi Logo" className="w-24 rounded-full h-24 object-contain" />
        </div>

        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center items-center mb-6">
              <ClipLoader color="#4F46E5" loading={loading} size={50} />
            </div>
          ) : (
            <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">SAMGE SCHOOL</h2>
          )}

          <form onSubmit={handleLogin} className={`${loading && "opacity-50 pointer-events-none"}`}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              />
            </div>

            {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2  bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;