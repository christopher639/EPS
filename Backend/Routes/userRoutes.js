const express = require("express");
const router = express.Router();
const passport = require("passport");

// Import controller functions
const {
  loginUser,
  googleLogin,
  googleCallback,
  registerUser,
  getUserById,
  updateUser,
  deleteUser,
  sendEmailToAllUsers,
  sendEmailToSingleUser,
  getPendingUsers,
  approveUser,
} = require("../Controllers/userController");

// Import middlewares
const authenticateUser = require("../middleware/authenticateUser");
const isAdmin = require("../middleware/isAdmin");

// Public routes
router.post("/login", loginUser); // Login route (POST)
router.post("/register", registerUser); // Register route (POST)

// Google OAuth routes
router.get("/auth/google", googleLogin); // Start Google OAuth
router.get("/auth/google/callback", googleCallback); // Google OAuth callback
// Import the User model
const User = require('../models/userModel');
// Protected routes
router.get("/:id", authenticateUser, getUserById); // Get user details by ID (GET)
router.put("/:id", authenticateUser, isAdmin, updateUser); // Update user details (PUT)
router.delete("/:id", authenticateUser, isAdmin, deleteUser); // Delete user (DELETE)

// Admin-protected routes
router.get("/admin/users", authenticateUser, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get all pending users (awaiting approval)
router.get("/admin/pending-users", getPendingUsers);

// Route for admin to approve/reject users
router.put("/admin/approve/:userId",  approveUser);

// Route to send email to all users
router.post("/admin/send-email-to-all", authenticateUser, isAdmin, sendEmailToAllUsers);

// Route to send email to a single user
router.post("/admin/send-email-to-single/:userId", authenticateUser, isAdmin, sendEmailToSingleUser);

module.exports = router;