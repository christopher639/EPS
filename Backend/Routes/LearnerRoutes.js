const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  addLearner,
  getAllLearners,
  getLearnerById, // Import the new function
  updateLearner,
  deleteLearner,
  getLearnerByRegNo,
  getLearnersByClassAndStream 

} = require("../Controllers/LearnerController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Routes
router.get("/search",getLearnerByRegNo);
router.post("/add", upload.single("learnerImage"), addLearner);
router.get("/", getAllLearners);
router.get("/:id", getLearnerById); // Add this route
router.put("/:id", upload.single("learnerImage"), updateLearner);
router.delete("/:id", deleteLearner);
router.get("/:grade/:stream", getLearnersByClassAndStream); 
module.exports = router;