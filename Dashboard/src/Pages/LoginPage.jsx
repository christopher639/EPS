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

      // Store both token and username in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userName', username);

      // Navigate to the dashboard or any other page after login
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Login failed, please check your credentials");
    } finally {
      setLoading(false); // Hide spinner after login attempt
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="w-full h-full flex flex-col md:flex-row items-center gap-5 justify-center">
        {/* Kibabi Logo */}
        <div className="p-4 rounded-full">
          <img src="KIbabii-Logo.png" alt="Kibabi Logo" className="w-24 h-24 object-contain" />
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center items-center mb-6">
              <ClipLoader color="#4F46E5" loading={loading} size={50} />
            </div>
          ) : (
            <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">KIBABII SCHOOL</h2>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300 ${
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
