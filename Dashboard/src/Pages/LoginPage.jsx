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
        await axios.post("http://localhost:3000/api/users/register", formData);
        setIsRegister(false);
        setErrorMessage("Registration successful! Awaiting admin approval.");
      } else {
        const response = await axios.post("http://localhost:3000/api/users/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.username);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("userId", response.data.userId); // Make sure this is included
        navigate(response.data.role === "admin" ? "/dashboard" : "/addmarks");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
 
    <div className="  h-screen ">
       <div className="overflow-y-auto md:py-2  max-h-screen flex   justify-center ">
    
    {/* Form Section */}
    <div className=" w-full md:shadow-sm h-full  px-6 border bg-white pb-16 md:pb-0 min-h-full  rounded-lg  md:w-1/3 ">
      {/* Mobile Header - Only visible on small screens */}
     <div className="flex   justify-center">
     <div className=" items-center  ">
        <div className=" flex items-center justify-center rounded-full ">
          <img src={lion} alt="School Logo" className="w-32   h-32 object-contain" />
        </div>
       <div>
       <h1 className=" font-bold text-blue-800  md:text-2xl">Hello, Welcome back</h1>
     <div className="flex justify-center">
 
     </div>
       </div>
      </div>
     </div>

      {/* Loading Spinner or Form Title */}
      {loading ? (
        <div className="flex justify-center ">
          <ClipLoader color="#1e40af" loading={loading} size={40} />
        </div>
      ) : (
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6 md:mb-0">
          {isRegister ? "" : ""}
        </h2>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-1">
        {isRegister && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-medium ">Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800" 
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium ">Username</label>
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                <input 
                  type="text" 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  name="dateOfBirth" 
                  value={formData.dateOfBirth} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800" 
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Address</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800" 
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-gray-700 text-sm font-medium ">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800" 
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800" 
          />
        </div>

        {isRegister && (
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800" 
            />
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 bg-gradient-to-r from-red-950 to-blue-800 text-white font-medium rounded-lg hover:opacity-90 transition duration-300"
        >
          {loading ? "Validating..." : isRegister ? "Create Account" : "Sign In"}
        </button>
      </form>

      {/* Google Sign-In Button */}
      <div className="mt-4">
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-white px-3 text-sm text-gray-500">or</span>
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google Logo" className="w-5 h-5" />
          <span className="font-medium">Continue with Google</span>
        </button>
      </div>
      {/* Toggle between Login and Register */}
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <button 
            className="text-blue-800 font-medium hover:underline" 
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
      {/* Footer */}
      <div className="mt-4 pt-4 border-t text-center pb-8">
        <p className=" font-bold text-blue-800">Copyright © 2025 Topaz Digital Labs</p>
      </div>
    </div>
     </div>
    </div>
  );
};

export default LoginPage;