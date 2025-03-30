import React, { useState } from "react";
import axios from "axios";
import lion from '../assets/lion.jpg';
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    username: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage("Passwords do not match");
          setLoading(false);
          return;
        }
        await axios.post("https://eps-dashboard.onrender.com/api/users/register", formData);
        setIsRegister(false);
        setErrorMessage("Registration successful! Awaiting admin approval.");
      } else {
        const response = await axios.post("https://eps-dashboard.onrender.com/api/users/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.username);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("userId", response.data.userId);
        navigate(response.data.role === "admin" ? "/dashboard" : "/addmarks");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "https://eps-dashboard.onrender.com/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-1">
      <div className={`w-full max-w-6xl bg-white rounded-xl shadow-sm overflow-hidden ${isRegister ? "md:h-auto" : "md:max-w-md"}`}>
        <div className={`flex flex-col ${isRegister ? "md:flex-row" : ""}`}>
          {/* Left Side - Image (Only visible on register for large screens) */}
          {isRegister && (
            <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-blue-900 to-blue-700 items-center justify-center p-6">
              <div className="text-center text-white">
                <img src={lion} alt="School Logo" className="w-32 h-32 mx-auto mb-4 object-contain" />
                <p className="text-blue-100 text-sm">Create your account as School Instructor</p>
              </div>
            </div>
          )}

          {/* Right Side - Form */}
          <div className={`p-4 ${isRegister ? "md:w-2/3" : "w-full"}`}>
            {/* Logo for mobile and login */}
            {!isRegister && (
              <div className="flex justify-center mb-4">
                <img src={lion} alt="School Logo" className="w-20 h-20 object-contain" />
              </div>
            )}

            <h1 className="text-xl font-bold text-center text-gray-800">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-600 text-center text-sm ">
              {isRegister ? "Fill in your details to register" : "Sign in to continue to your account"}
            </p>

            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded text-sm">
                <p className="text-red-700">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegister ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className={isRegister ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-2"}>
                <div className={isRegister ? "md:col-span-2 md:grid gap-2 grid-cols-3 space-y-2" : "space-y-2"}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  {isRegister && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <ClipLoader color="#ffffff" size={16} className="mr-2" />
                ) : null}
                {loading ? "Processing..." : isRegister ? "Register" : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-500 text-xs">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled
              className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition cursor-not-allowed opacity-70"
            >
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" className="w-4 h-4" />
              Continue with Google
            </button>

            {/* Toggle between login/register */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setErrorMessage("");
                  }}
                  className="ml-1 text-blue-600 font-medium hover:underline focus:outline-none text-sm"
                >
                  {isRegister ? "Sign in" : "Register"}
                </button>
              </p>
            </div>
                {/* Footer */}
        <div className="bg-gray-50 px-4 py-1 text-center border-t">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Topaz Digital Labs. All rights reserved.
          </p>
        </div>
          </div>
        </div>

    
      </div>
    </div>
  );
};

export default LoginPage;