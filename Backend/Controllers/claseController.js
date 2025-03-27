const Clase = require("../models/claseModel");
const Student = require("../models/studentModel"); // Assuming you have a Student model

// CREATE - Add new clase
exports.createClase = async (req, res) => {
  try {
    const { clasename, claseteacher } = req.body;
    
    // Check if clase already exists
    const existingClase = await Clase.findOne({ clasename });
    if (existingClase) {
      return res.status(400).json({ message: "Class already exists" });
    }

    const clase = new Clase({ clasename, claseteacher });
    await clase.save();
    
    res.status(201).json({
      message: "Class created successfully",
      clase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating class",
      error: error.message,
    });
  }
};

// READ - Get all clases
exports.getAllClases = async (req, res) => {
  try {
    const clases = await Clase.find().sort({ createdAt: -1 });
    res.status(200).json(clases);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching classes",
      error: error.message,
    });
  }
};

// READ - Get single clase
exports.getClaseById = async (req, res) => {
  try {
    const clase = await Clase.findById(req.params.id);
    if (!clase) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(clase);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching class",
      error: error.message,
    });
  }
};

// UPDATE - Update clase
exports.updateClase = async (req, res) => {
  try {
    const { clasename, claseteacher } = req.body;
    const clase = await Clase.findById(req.params.id);

    if (!clase) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if new clasename conflicts with existing clases
    if (clasename && clasename !== clase.clasename) {
      const existingClase = await Clase.findOne({ clasename });
      if (existingClase) {
        return res.status(400).json({ message: "Class clasename already exists" });
      }
    }

    clase.clasename = clasename || clase.clasename;
    clase.claseteacher = claseteacher || clase.claseteacher;
    await clase.save();

    res.status(200).json({
      message: "Class updated successfully",
      clase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating class",
      error: error.message,
    });
  }
};

// DELETE - Delete clase
exports.deleteClase = async (req, res) => {
  try {
    const clase = await Clase.findByIdAndDelete(req.params.id);
    if (!clase) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting class",
      error: error.message,
    });
  }
};

// Get students by clase
exports.getStudentsByClase = async (req, res) => {
  try {
    const clase = await Clase.findById(req.params.claseId);
    if (!clase) {
      return res.status(404).json({ message: "Class not found" });
    }

    const students = await Student.find({ clase: req.params.claseId })
      .populate('clase', 'clasename claseteacher')
      .select('-password'); // Exclude sensitive data

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching students",
      error: error.message,
    });
  }
};