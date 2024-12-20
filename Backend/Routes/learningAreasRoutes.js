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
router.post('/', createLearningArea);          // Create a new Learning Area
router.get('/', getAllLearningAreas);          // Get all Learning Areas
router.get('/:id', getLearningAreaById);       // Get a Learning Area by ID
router.put('/:id', updateLearningArea);        // Update a Learning Area by ID
router.delete('/:id', deleteLearningArea);     // Delete a Learning Area by ID
module.exports = router;
