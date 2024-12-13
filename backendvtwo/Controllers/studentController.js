const Student = require('../models/students');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, dot, dob, regno, gender, previous, stream, parentname, email, phone } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ regno });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this registration number already exists.' });
    }

    // Create and save the new student
    const student = new Student({
      name,
      dot,
      dob,
      regno,
      gender,
      previous,
      stream,
      parentname,
      email,
      phone
    });

    await student.save();
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students or filtered students based on query parameters
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find(req.query); // You can filter with query parameters
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific student by registration number
exports.getStudentByRegno = async (req, res) => {
  try {
    const student = await Student.findOne({ regno: req.params.regno });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a student by registration number
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { regno: req.params.regno },
      req.body,
      { new: true, runValidators: true } // Return the updated student
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a student by registration number
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ regno: req.params.regno });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
