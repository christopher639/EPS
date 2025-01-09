const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const emailService = require('../services/emailService');  // Import the email service

// User login function
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Register a new user (Create)
const registerUser = async (req, res) => {
    const { email, password, fullName, username, phoneNumber, profilePicture, role = 'user', status = 'active', address, dateOfBirth, preferences, rolesPermissions = [] } = req.body;

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

        const newUser = new User({ email, password: hashedPassword, fullName, username, phoneNumber, profilePicture, role, status, address, dateOfBirth, preferences, rolesPermissions });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user details by ID (Read)
const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user details (Update)
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { fullName,email,username, phoneNumber, address } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { fullName,email,username, phoneNumber, address }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete user (Delete)
const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Send email to all users
const sendEmailToAllUsers = async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users
        const { subject, text, html } = req.body;

        // Call the email service to send emails to all users
        await emailService.sendEmailToAllUsers(users, subject, text, html);

        res.status(200).json({ message: "Emails sent to all users successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while sending emails" });
    }
};

// Send email to a single user
const sendEmailToSingleUser = async (req, res) => {
    const { userId } = req.params;
    const { subject, text, html } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Call the email service to send an email to the user
        await emailService.sendEmailToSingleUser(user, subject, text, html);

        res.status(200).json({ message: `Email sent to ${user.email} successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while sending email" });
    }
};

module.exports = {
    loginUser,
    registerUser,
    getUserById,
    updateUser,
    deleteUser,
    sendEmailToAllUsers,
    sendEmailToSingleUser
};
