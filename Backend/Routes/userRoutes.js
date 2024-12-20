const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
// POST request to create a user
router.post('/users', userController.createUser);
// GET request to fetch all users
router.get('/users', userController.getAllUsers);
// GET request to fetch a single user by ID
router.get('/users/:id', userController.getUserById);
// PUT request to update a user by ID
router.put('/users/:id', userController.updateUser);
// DELETE request to delete a user by ID
router.delete('/users/:id', userController.deleteUser);
module.exports = router;
