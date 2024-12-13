const express = require('express');
const router = express.Router();
const StudentController = require('../Controllers/studentController.js');
// Create a new student
router.post('/students', StudentController.createStudent);
// Get all students or filtered students
router.get('/students', StudentController.getAllStudents);
// Get a student by registration number
router.get('/students/:regno', StudentController.getStudentByRegno);
// Update a student by registration number
router.put('/students/:regno', StudentController.updateStudent);
// Delete a student by registration number
router.delete('/students/:regno', StudentController.deleteStudent);
module.exports = router;
