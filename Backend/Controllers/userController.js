const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User login function
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        // Send token and username in the response
        res.json({ token, username: user.username });  // Include username in the response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// Register a new user (Create)
const registerUser = async (req, res) => {
    const {
        email,
        password,
        fullName,
        username,
        phoneNumber,
        profilePicture,
        role = 'user',  // default to 'user' if not provided
        status = 'active',  // default to 'active' if not provided
        address,
        dateOfBirth,
        preferences,
        rolesPermissions = []  // default to empty array if not provided
    } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Check if the username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already in use" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            fullName,
            username,
            phoneNumber,
            profilePicture,
            role,
            status,
            address,
            dateOfBirth,
            preferences,
            rolesPermissions
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success
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
        const user = await User.findById(userId).select("-password"); // Exclude password field
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
    const { fullName, phoneNumber, address } = req.body;

    try {
        // Find the user and update the details
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, phoneNumber, address },
            { new: true }
        );

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

module.exports = {
    loginUser,
    registerUser,
    getUserById,
    updateUser,
    deleteUser,
};
