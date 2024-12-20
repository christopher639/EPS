const studentModel = require("../models/studentModel");
// CREATE - Add new student
exports.createStudent = async (req, res) => {
  try {
    const student = new studentModel(req.body);
    await student.save();
    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating student",
      error: error.message,
    });
  }
};

// READ - Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await studentModel.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching students",
      error: error.message,
    });
  }
};

// READ - Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await studentModel.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching student",
      error: error.message,
    });
  }
};

// UPDATE - Update student information
exports.updateStudent = async (req, res) => {
  try {
    const student = await studentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    res.status(200).json({
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating student",
      error: error.message,
    });
  }
};
// DELETE - Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await studentModel.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting student",
      error: error.message,
    });
  }
};
