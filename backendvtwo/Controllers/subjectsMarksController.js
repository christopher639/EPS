const SubjectMark = require("../models/subjectsmarks");
// Create a new subject mark
exports.createSubjectMark = async (req, res) => {
    try {
        const newSubjectMark = new SubjectMark(req.body);
        const savedSubjectMark = await newSubjectMark.save();
        res.status(201).json(savedSubjectMark);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Get all subject marks
exports.getAllSubjectMarks = async (req, res) => {
    try {
        const subjectMarks = await SubjectMark.find();
        res.status(200).json(subjectMarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get a subject mark by ID
exports.getSubjectMarkById = async (req, res) => {
    try {
        const subjectMark = await SubjectMark.findById(req.params.id);
        if (!subjectMark) {
            return res.status(404).json({ message: "Subject mark not found" });
        }
        res.status(200).json(subjectMark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update a subject mark by ID
exports.updateSubjectMark = async (req, res) => {
    try {
        const updatedSubjectMark = await SubjectMark.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedSubjectMark) {
            return res.status(404).json({ message: "Subject mark not found" });
        }
        res.status(200).json(updatedSubjectMark);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Delete a subject mark by ID
exports.deleteSubjectMark = async (req, res) => {
    try {
        const deletedSubjectMark = await SubjectMark.findByIdAndDelete(req.params.id);
        if (!deletedSubjectMark) {
            return res.status(404).json({ message: "Subject mark not found" });
        }
        res.status(200).json({ message: "Subject mark deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
