const User = require('../models/userModel');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWT tokens

// CREATE a new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, fullName, phoneNumber, profilePicture, role, status, address, dateOfBirth } = req.body;

        // Hash password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
            phoneNumber,
            profilePicture,
            role,
            status,
            address,
            dateOfBirth
        });

        const user = await newUser.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// READ all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// READ a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// UPDATE a user by ID
exports.updateUser = async (req, res) => {
    try {
        const { username, email, fullName, phoneNumber, profilePicture, role, status, address, dateOfBirth } = req.body;

        // Update user fields
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            username,
            email,
            fullName,
            phoneNumber,
            profilePicture,
            role,
            status,
            address,
            dateOfBirth
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// DELETE a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
