const express = require("express");
const router = express.Router();
const studentControllers = require("../Controllers/studentControllers");
const isAdmin = require("../middleware/isAdmin");
// CREATE - Add a new student
router.post("/", studentControllers.createStudent);
// READ - Get all students
router.get("/", studentControllers.getAllStudents);
// READ - Get a single student by ID
router.get("/:id", studentControllers.getStudentById);
// UPDATE - Update student information
router.put("/:id", studentControllers.updateStudent);
// DELETE - Delete a student
router.delete("/:id",isAdmin, studentControllers.deleteStudent);
// Add a route for filtering students by stream and year
router.get("/:stream/:year", studentControllers.getStudentsByStreamAndYear);
module.exports = router;
