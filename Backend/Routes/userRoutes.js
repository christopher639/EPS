const express = require('express');
const router = express.Router();

// Import controller functions
const {
    loginUser,
    registerUser,
    getUserById,
    updateUser,
    deleteUser,
    sendEmailToAllUsers,
    sendEmailToSingleUser
} = require('../Controllers/userController');

// Import middlewares
const authenticateUser = require('../middleware/authenticateUser');
const isAdmin = require('../middleware/isAdmin');
// Import the User model
const User = require('../models/userModel'); // Import User model to query the database

// Public routes
router.post('/login', loginUser); // Login route (POST)
router.post('/register', registerUser); // Register route (POST)

// Protected routes
router.get('/:id', authenticateUser, getUserById); // Get user details by ID (GET)
router.put('/:id', authenticateUser,isAdmin, updateUser); // Update user details (PUT)
router.delete('/:id', authenticateUser, isAdmin, deleteUser); // Delete user (DELETE)

// Admin-protected route to fetch all users (or other admin actions)
// Routes/UserRoutes.js
router.get('/admin/users', authenticateUser, async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Fix the variable name to 'User'
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
// Route to send email to all users
router.post('/admin/send-email-to-all', sendEmailToAllUsers);

// Route to send email to a single user
router.post('/admin/send-email-to-single/:userId', sendEmailToSingleUser);

module.exports = router;
