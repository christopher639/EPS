const express = require('express');
const router = express.Router();
const departmentController = require('../Controllers/departmentController');
// CRUD Routes
router.get('/', departmentController.getAllDepartments); // Get all departments
router.get('/:id', departmentController.getDepartmentById); // Get a department by ID
router.post('/', departmentController.createDepartment); // Create a new department
router.put('/:id', departmentController.updateDepartment); // Update an existing department
router.delete('/:id', departmentController.deleteDepartment); // Delete a department
module.exports = router;
