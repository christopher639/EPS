const Student = require("../models/studentModel");
const multer = require("multer");
const path = require("path");

// Multer Configuration for Image Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 📌 Create Student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, regno } = req.body;
    const photo = req.file ? req.file.filename : null;

    const newStudent = new Student({
      ...req.body,
      photo: photo,
    });

    await newStudent.save();
    res.status(201).json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get All Students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get Single Student
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Update Student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (req.file) {
      req.body.photo = req.file.filename;
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete Student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export multer middleware
exports.upload = upload;

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
