const Teacher = require('../models/teacherModel');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Get a single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const newTeacher = await Teacher.create(req.body);
    res.status(201).json({ success: true, data: newTeacher });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error });
  }
};

// Update a teacher by ID
exports.updateTeacher = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTeacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(200).json({ success: true, data: updatedTeacher });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error });
  }
};

// Delete a teacher by ID
exports.deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(200).json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
