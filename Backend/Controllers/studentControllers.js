const studentModel = require("../models/studentModel");
const upload = require("../config/upload");  // Import the multer setup

// CREATE - Add new student
exports.createStudent = (req, res) => {
  // First, handle the image upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: "Error uploading image",
        error: err.message,
      });
    }

    // Ensure that the regno is provided
    if (!req.body.regno) {
      return res.status(400).json({
        message: "regNo Number is required",
      });
    }

    // Check for duplicates based on email or regno
    const existingStudent = await studentModel.findOne({
      $or: [{ email: req.body.email }, { regno: req.body.regno }],
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Email or Regno already exists",
      });
    }

    // Add the image path to the student's photo field if it exists
    if (req.file) {
      req.body.photo = `/uploads/${req.file.filename}`; // Assuming you serve static files from 'uploads/' folder
    }

    // If no duplicates, create a new student
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
  });
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

// READ - Get students by stream and year
exports.getStudentsByStreamAndYear = async (req, res) => {
  const { stream, year } = req.params; // Extract stream and year from the URL

  try {
    // Query the students that match the stream and year
    const students = await studentModel.find({ stream, year });

    if (students.length === 0) {
      return res.status(404).json({
        message: `No students found for stream: ${stream} and year: ${year}`,
      });
    }

    res.status(200).json(students); // Return the list of students that match the criteria
  } catch (error) {
    res.status(500).json({
      message: "Error fetching students",
      error: error.message,
    });
  }
};
