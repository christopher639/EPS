const Dormitory = require('../models/dormitoryModel');

// Get all dormitories
exports.getAllDormitories = async (req, res) => {
  try {
    const dormitories = await Dormitory.find();
    res.status(200).json(dormitories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dormitories' });
  }
};

// Get a single dormitory by ID
exports.getDormitoryById = async (req, res) => {
  try {
    const dormitory = await Dormitory.findById(req.params.id);
    if (!dormitory) {
      return res.status(404).json({ error: 'Dormitory not found' });
    }
    res.status(200).json(dormitory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dormitory' });
  }
};

// Create a new dormitory
exports.createDormitory = async (req, res) => {
  try {
    const dormitory = new Dormitory(req.body);
    const savedDormitory = await dormitory.save();
    res.status(201).json(savedDormitory);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create dormitory', details: error.message });
  }
};

// Update a dormitory
exports.updateDormitory = async (req, res) => {
  try {
    const updatedDormitory = await Dormitory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDormitory) {
      return res.status(404).json({ error: 'Dormitory not found' });
    }
    res.status(200).json(updatedDormitory);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update dormitory', details: error.message });
  }
};

// Delete a dormitory
exports.deleteDormitory = async (req, res) => {
  try {
    const deletedDormitory = await Dormitory.findByIdAndDelete(req.params.id);
    if (!deletedDormitory) {
      return res.status(404).json({ error: 'Dormitory not found' });
    }
    res.status(200).json({ message: 'Dormitory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete dormitory' });
  }
};
