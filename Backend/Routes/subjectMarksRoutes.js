const express = require("express");
const router = express.Router();
const subjectsMarksController = require("../Controllers/subjectsMarksController");

// CRUD Routes
router.post("/", subjectsMarksController.createSubjectMark);
router.get("/", subjectsMarksController.getAllSubjectMarks);
router.get("/:id", subjectsMarksController.getSubjectMarkById);
router.put("/:id", subjectsMarksController.updateSubjectMark);
router.delete("/:id", subjectsMarksController.deleteSubjectMark);

// Get Subject Marks (including examCategory filter)
router.get("/:stream/:year/:term/:examcategory", subjectsMarksController.getSubjectMarks);

// Get student marks with average score calculation
router.get("/:stream/:year/:term", subjectsMarksController.getStudentMarksWithAverage);

module.exports = router;
