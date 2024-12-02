const express = require('express');
const {
  createLearningArea,
  getAllLearningAreas,
  getLearningAreaById,
  updateLearningArea,
  deleteLearningArea,
} = require('../Controllers/learningAreaController');

const router = express.Router();

// CRUD Routes
router.post('/', createLearningArea);          // Create a new LearningArea
router.get('/', getAllLearningAreas);          // Get all LearningAreas (with pagination)
router.get('/:id', getLearningAreaById);       // Get a LearningArea by ID
router.put('/:id', updateLearningArea);        // Update a LearningArea by ID
router.delete('/:id', deleteLearningArea);     // Delete a LearningArea by ID

module.exports = router;
