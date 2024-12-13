const express = require("express");
const router = express.Router();
const subjectsMarksController = require("../Controllers/subjectsMarksController");
// CRUD Routes
router.post("/", subjectsMarksController.createSubjectMark);
router.get("/", subjectsMarksController.getAllSubjectMarks);
router.get("/:id", subjectsMarksController.getSubjectMarkById);
router.put("/:id", subjectsMarksController.updateSubjectMark);
router.delete("/:id", subjectsMarksController.deleteSubjectMark);
module.exports = router;
