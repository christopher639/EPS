const express = require("express");
const router = express.Router();
const subjectsMarksController = require("../Controllers/subjectsMarksController");
const authMiddleware = require("../middleware/authMiddleware");

// Apply authMiddleware to all routes
router.post("/",  subjectsMarksController.createSubjectMarks);
router.get("/",  subjectsMarksController.getAllSubjectMarks);
router.get("/:id",  subjectsMarksController.getSubjectMarkById);
router.put("/:id",  subjectsMarksController.updateSubjectMark);
router.delete("/:id",  subjectsMarksController.deleteSubjectMark);

// Protected custom routes
router.get("/:class/:year/:term", subjectsMarksController.getSubjectMarksByClassYearTerm);
router.get('/:class/:year/:term/:category',  subjectsMarksController.getSubjectMarksByClassYearTermCategory);
router.get('/marks/:year/:term/:category/:regno',  subjectsMarksController.getStudentPerformanceByRegno);

module.exports = router;