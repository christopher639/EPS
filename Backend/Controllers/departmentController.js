const Department = require('../models/departmentModel'); // Adjust path as necessary
// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get a single department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const newDepartment = new Department(req.body);
    const savedDepartment = await newDepartment.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Update an existing department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDepartment = await Department.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedDepartment) return res.status(404).json({ message: "Department not found" });
    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Delete a department
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) return res.status(404).json({ message: "Department not found" });
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
