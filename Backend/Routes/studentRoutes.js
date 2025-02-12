const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentControllers");

// Routes
router.post("/", studentController.upload.single("photo"), studentController.createStudent);
router.get("/", studentController.getStudents);
router.get("/:id", studentController.getStudentById);
router.put("/:id", studentController.upload.single("photo"), studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);


router.get("/:stream/:year", studentController.getStudentsByStreamAndYear);
module.exports = router;
