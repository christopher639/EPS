const Teacher = require('../models/teacherModel');

// Get all teachers with pagination
exports.getAllTeachers = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const teachers = await Teacher.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments();

    res.status(200).json({
      success: true,
      count: teachers.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: teachers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found with the given ID' 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: teacher 
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid teacher ID format' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create new teacher
exports.createTeacher = async (req, res) => {
  try {
    // Check if email or employeeNumber already exists
    const existingTeacher = await Teacher.findOne({
      $or: [
        { email: req.body.email },
        { employeeNumber: req.body.employeeNumber }
      ]
    });

    if (existingTeacher) {
      const conflictField = existingTeacher.email === req.body.email 
        ? 'Email' 
        : 'Employee number';
      return res.status(409).json({
        success: false,
        message: `${conflictField} already exists`
      });
    }

    const newTeacher = await Teacher.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: 'Teacher created successfully',
      data: newTeacher 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: messages 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update teacher by ID
exports.updateTeacher = async (req, res) => {
  try {
    // Prevent updating email or employeeNumber if provided
    if (req.body.email || req.body.employeeNumber) {
      return res.status(400).json({
        success: false,
        message: 'Email and employee number cannot be updated'
      });
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found with the given ID' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Teacher updated successfully',
      data: updatedTeacher 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: messages 
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid teacher ID format' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete teacher by ID
exports.deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    
    if (!deletedTeacher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Teacher not found with the given ID' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Teacher deleted successfully',
      data: deletedTeacher 
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid teacher ID format' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};