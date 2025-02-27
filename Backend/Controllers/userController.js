const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const emailService = require("../services/emailService");
const passport = require("passport");

// User login function
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === "pending") {
      return res.status(403).json({ message: "Your account is pending. Wait for approval." });
    }

    if (user.status === "rejected") {
      return res.status(403).json({ message: "Your registration was rejected." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" });
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Google OAuth login
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google OAuth callback
const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Google authentication failed" });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate JWT token for the user
    const token = jwt.sign({ userId: user._id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" });
    res.json({ token, username: user.username, role: user.role });
  })(req, res, next);
};

// Register a new user
const registerUser = async (req, res) => {
  const { email, password, fullName, username, phoneNumber, profilePicture, address, dateOfBirth, preferences } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      username,
      phoneNumber,
      profilePicture,
      role: "instructor", // Default role
      status: "pending", // Needs admin approval
      address,
      dateOfBirth,
      preferences,
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful. Waiting for approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Other controller functions remain the same...
// Approve or reject user
const approveUser = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status update" });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, { status }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: `User has been ${status}.`, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user details by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all pending users
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ status: "pending" });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user details
const updateUser = async (req, res) => {
    const { fullName, email, password, username, phoneNumber, status, address, role } = req.body;
    try {
        let updateFields = { fullName, email, username, phoneNumber, status, address, role };
        
        if (password) {
            updateFields.password = await bcrypt.hash(password, 12);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Send email to all users
const sendEmailToAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        const { subject, text, html } = req.body;
        await emailService.sendEmailToAllUsers(users, subject, text, html);
        res.status(200).json({ message: "Emails sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while sending emails" });
    }
};

// Send email to a single user
const sendEmailToSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const { subject, text, html } = req.body;
        await emailService.sendEmailToSingleUser(user, subject, text, html);
        res.status(200).json({ message: `Email sent to ${user.email} successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while sending email" });
    }
};
module.exports = {
  loginUser,
  googleLogin,
  googleCallback,
  registerUser,
  // Other exports...
  approveUser,
  getUserById,
  getPendingUsers,
  updateUser,
  deleteUser,
  sendEmailToAllUsers,
  sendEmailToSingleUser
};