const LearningArea = require('../models/Learningarea');
// Create a new LearningArea
const createLearningArea = async (req, res) => {
  try {
    const learningArea = new LearningArea(req.body);
    const savedLearningArea = await learningArea.save();
    res.status(201).json(savedLearningArea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Get all LearningAreas (with pagination)
const getAllLearningAreas = async (req, res) => {
  try {
    const learningAreas = await LearningArea.find()
    res.status(200).json(learningAreas)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get a LearningArea by ID
const getLearningAreaById = async (req, res) => {
  try {
    const learningArea = await LearningArea.findById(req.params.id);
    if (!learningArea) return res.status(404).json({ message: 'LearningArea not found' });
    res.json(learningArea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update a LearningArea by ID
const updateLearningArea = async (req, res) => {
  try {
    const updatedLearningArea = await LearningArea.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate data before updating
    });
    if (!updatedLearningArea) return res.status(404).json({ message: 'LearningArea not found' });
    res.json(updatedLearningArea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Delete a LearningArea by ID
const deleteLearningArea = async (req, res) => {
  try {
    const deletedLearningArea = await LearningArea.findByIdAndDelete(req.params.id);
    if (!deletedLearningArea) return res.status(404).json({ message: 'LearningArea not found' });
    res.json({ message: 'LearningArea deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createLearningArea,
  getAllLearningAreas,
  getLearningAreaById,
  updateLearningArea,
  deleteLearningArea,
};
