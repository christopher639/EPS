const Learner = require("../models/LearnerModel");
const path = require("path");
const fs = require("fs");

// Add Learner
exports.addLearner = async (req, res) => {
  try {
    const { name, regno, grade, stream, gender, dateOfBirth, nationality, guardianName, guardianPhone, address } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Learner image is required" });
    }

    const learner = new Learner({
      name,
      regno,
      grade,
      stream,
      gender,
      dateOfBirth,
      nationality,
      guardianName,
      guardianPhone,
      address,
      learnerImage: `/uploads/${req.file.filename}`,
    });

    await learner.save();
    res.status(201).json({ message: "Learner added successfully", learner });
  } catch (error) {
    res.status(500).json({ message: "Error adding learner", error });
  }
};

// Get All Learners with Pagination
exports.getAllLearners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 50 learners per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch learners with pagination
    const learners = await Learner.find()
      .skip(skip) // Skip documents for previous pages
      .limit(limit); // Limit the number of documents per page

    // Get the total number of learners
    const totalLearners = await Learner.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalLearners / limit);

    res.status(200).json({
      message: "Learners retrieved successfully",
      learners,
      currentPage: page,
      totalPages,
      totalLearners,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving learners", error });
  }
};

// Update Learner
exports.updateLearner = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = req.body;

    if (req.file) {
      updatedData.learnerImage = `/uploads/${req.file.filename}`;
    }

    const learner = await Learner.findByIdAndUpdate(id, updatedData, { new: true });
    if (!learner) return res.status(404).json({ message: "Learner not found" });

    res.status(200).json({ message: "Learner updated successfully", learner });
  } catch (error) {
    res.status(500).json({ message: "Error updating learner", error });
  }
};

// Delete Learner
exports.deleteLearner = async (req, res) => {
  try {
    const { id } = req.params;
    const learner = await Learner.findByIdAndDelete(id);

    if (!learner) return res.status(404).json({ message: "Learner not found" });

    // Remove image file
    if (learner.learnerImage) {
      const imagePath = path.join(__dirname, "..", learner.learnerImage);
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "Learner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting learner", error });
  }
};
// Get Single Learner by ID
exports.getLearnerById = async (req, res) => {
    try {
      const { id } = req.params;
      const learner = await Learner.findById(id);
  
      if (!learner) {
        return res.status(404).json({ message: "Learner not found" });
      }
  
      res.status(200).json({ message: "Learner retrieved successfully", learner });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving learner", error });
    }
  };
  exports.getLearnerByRegNo = async (req, res) => {
    const { regno, page = 1, limit = 10 } = req.query;
    try {
      const skip = (page - 1) * limit;
      const learners = await Learner.find({ regno: { $regex: regno, $options: "i" } })
        .skip(skip)
        .limit(Number(limit));
  
      const totalLearners = await Learner.countDocuments({ regno: { $regex: regno, $options: "i" } });
      const totalPages = Math.ceil(totalLearners / limit);
  
      res.status(200).json({ learners, currentPage: Number(page), totalPages, totalLearners });
    } catch (error) {
      res.status(500).json({ message: "Error searching learners", error: error.message });
    }
  };