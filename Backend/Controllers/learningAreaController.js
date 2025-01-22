const LearningArea = require('../models/learningAreaModel');

// Create a new Learning Area
const createLearningArea = async (req, res) => {
  try {
    const learningArea = new LearningArea(req.body);
    const savedLearningArea = await learningArea.save();
    res.status(201).json(savedLearningArea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Learning Areas
const getAllLearningAreas = async (req, res) => {
  try {
    const learningAreas = await LearningArea.find()
      .populate('instructor', 'fullName email') // Fetch instructor details
      .populate('studentsEnrolled', 'fullName email'); // Fetch students details
    res.status(200).json(learningAreas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Learning Area by ID
const getLearningAreaById = async (req, res) => {
  try {
    const learningArea = await LearningArea.findById(req.params.id)
      .populate('instructor', 'fullname email') // Fetch instructor details (fullName and email)
      .populate('studentsEnrolled', 'name email regno') // Fetch students' details (fullName, email, regno)
      .populate('department', 'departmentName') // Fetch department details if needed (department name or other details)
      .exec(); // Use exec() for better error handling and to ensure the query is fully executed

    if (!learningArea) {
      return res.status(404).json({ message: 'Learning Area not found' });
    }

    // If found, return the learning area with populated fields
    res.status(200).json(learningArea);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update a Learning Area by ID
const updateLearningArea = async (req, res) => {
  try {
    const updatedLearningArea = await LearningArea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('instructor', 'fullName email') // Fetch instructor details
      .populate('studentsEnrolled', 'fullName email'); // Fetch students details
    if (!updatedLearningArea) {
      return res.status(404).json({ message: 'Learning Area not found' });
    }
    res.status(200).json(updatedLearningArea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Learning Area by ID
const deleteLearningArea = async (req, res) => {
  try {
    const deletedLearningArea = await LearningArea.findByIdAndDelete(req.params.id);
    if (!deletedLearningArea) {
      return res.status(404).json({ message: 'Learning Area not found' });
    }
    res.status(200).json({ message: 'Learning Area deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLearningArea,
  getAllLearningAreas,
  getLearningAreaById,
  updateLearningArea,
  deleteLearningArea,
};
