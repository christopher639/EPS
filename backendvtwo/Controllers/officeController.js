const Office = require('../models/offices');
// Create a new Office
exports.createOffice = async (req, res) => {
  try {
    const newOffice = new Office(req.body);
    const savedOffice = await newOffice.save();
    res.status(201).json({success:"true",message:"Office added"});
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Get all Offices
exports.getAllOffices = async (req, res) => {
  try {
    const offices = await Office.find();
    res.status(200).json( offices);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get a single Office by ID
exports.getOfficeById = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id).populate('parentDepartmentID');
    if (!office) {
      return res.status(404).json({ success: false, message: 'Office not found' });
    }
    res.status(200).json({ success: true, data: office });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Update an Office
exports.updateOffice = async (req, res) => {
  try {
    const updatedOffice = await Office.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedOffice) {
      return res.status(404).json({ success: false, message: 'Office not found' });
    }
    res.status(200).json({ success: true, data: updatedOffice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// Delete an Office
exports.deleteOffice = async (req, res) => {
  try {
    const deletedOffice = await Office.findByIdAndDelete(req.params.id);
    if (!deletedOffice) {
      return res.status(404).json({ success: false, message: 'Office not found' });
    }
    res.status(200).json({ success: true, message: 'Office deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
