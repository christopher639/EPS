import React, { useState } from "react";
import axios from "axios";
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
    window.location.href = "http://localhost:3000/api/auth/google"; // Adjust to your backend Google OAuth route
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-lg shadow-xl flex flex-col md:flex-row items-center gap-6">
        
        {/* School Logo */}
        <div className="p-4 rounded-full bg-opacity-40 backdrop-blur-md shadow-md">
          <img src="lion.jpg" alt="School Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-full" />
        </div>

        {/* Login/Register Form */}
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center">
              <ClipLoader color="#4F46E5" loading={loading} size={50} />
            </div>
          ) : (
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
              {isRegister ? "Register" : "Login"}
            </h2>
          )}

          <form onSubmit={handleSubmit} className={`mt-4 grid ${isRegister ? "grid-cols-1  md:grid-cols-2 " : "grid-cols-1"} gap-2`}>
            {isRegister && (
              <>
                <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
              </>
            )}
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
            {isRegister && (
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
            )}

            {errorMessage && <p className="text-red-600 text-sm text-center">{errorMessage}</p>}

            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300">
              {loading ? "Processing..." : isRegister ? "Register" : "Login"}
            </button>
          </form>

          {/* Google Sign-In Button */}
          <div className="mt-4 flex justify-center">
          <button
  onClick={handleGoogleSignIn}
  disabled
  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed"
>
  <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google Logo" className="w-5 h-5" />
  <span className="font-semibold">Continue with Google</span>
</button>

          </div>

          {/* Toggle between Login and Register */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <button className="text-indigo-500 hover:underline" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Login" : "Register"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
