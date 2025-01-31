const express = require("express");
const router = express.Router();
const subjectsMarksController = require("../Controllers/subjectsMarksController");

// CRUD Routes
router.post("/", subjectsMarksController.createSubjectMarks);
router.get("/", subjectsMarksController.getAllSubjectMarks);
router.get("/:id", subjectsMarksController.getSubjectMarkById);
router.put("/:id", subjectsMarksController.updateSubjectMark);
router.delete("/:id", subjectsMarksController.deleteSubjectMark);

// Get student marks with average score calculation (if needed)
router.get("/:class/:year/:term", subjectsMarksController.getSubjectMarksByClassYearTerm);
router.get('/:class/:year/:term/:category', subjectsMarksController.getSubjectMarksByClassYearTermCategory);
// Get Subject Marks (class, year, stream (optional), term)
module.exports = router;
