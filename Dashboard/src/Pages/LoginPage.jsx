import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import lion from "../assets/lion.jpg";

// Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center space-x-2 mb-2">
    <svg
      className="animate-spin h-5 w-5 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
    <span className="text-sm text-blue-700 font-medium">Validating credentials...</span>
  </div>
);

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        await axios.post("https://eps-dashboard.onrender.com/api/users/register", formData);
        setIsSignup(false);
        setError("Registered successfully. Please login.");
      } else {
        const res = await axios.post("https://eps-dashboard.onrender.com/api/users/login", {
          email: formData.email,
          password: formData.password,
        });
        const { token, role, username, email, userId } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userName", username);
        localStorage.setItem("email", email);
        localStorage.setItem("userId", userId);
        navigate(role === "admin" ? "/dashboard" : "/addmarks");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-y-auto bg-gradient-to-tr from-red-900 to-blue-600 flex items-center justify-center px-4 py-10">
      {/* this is my prompt: when user is on login, mt-0; when user is on signup, mt-16 */}
      <div
        className={`w-full max-w-md bg-white p-8 rounded-3xl ${
          isSignup ? "mt-16" : "mt-0"
        } shadow-2xl border border-red-900 animate-fadeIn`}
      >
        <div className="flex flex-col items-center space-y-4 mb-6">
          <img src={lion} alt="Lion Logo" className="h-20 rounded-full border-4 border-blue-600" />
          <h2 className="text-3xl font-extrabold text-blue-600">
            {isSignup ? "Create Your Account" : "Welcome Back"}
          </h2>
        </div>

        {loading && <Spinner />}
        {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="text-sm font-medium block text-blue-900">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full border border-blue-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium block text-blue-900">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-blue-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="text-sm font-medium block text-blue-900">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-blue-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          {isSignup && (
            <div>
              <label className="text-sm font-medium block text-blue-900">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border border-blue-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-red-900 text-white rounded-lg font-semibold hover:bg-red-800 transition"
          >
            {loading ? "Validating..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isSignup ? "Login" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
