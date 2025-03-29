const Learner = require("../models/LearnerModel");
const path = require("path");
const fs = require("fs");
const Counter = require("../models/Counter");

// Add Learner with Auto-Incremented RegNo in "0001" format
exports.addLearner = async (req, res) => {
  try {
    const { name, grade, stream, gender, dateOfBirth, nationality, guardianName, guardianPhone, address } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Learner image is required" });
    }

    // Get the latest regno from the Counter collection
    let counter = await Counter.findById("learnerRegNo");

    if (!counter) {
      counter = new Counter({ _id: "learnerRegNo", sequence_value: 1 });
    } else {
      counter.sequence_value += 1;
    }

    // Save updated counter value
    await counter.save();

    // Format regno to be 4 digits (e.g., "0001", "0002", etc.)
    const formattedRegNo = counter.sequence_value.toString().padStart(4, "0");

    // Create a new learner with the formatted regno
    const learner = new Learner({
      name,
      regno: formattedRegNo, // Auto-incremented and formatted RegNo
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
// Get All Learners with Pagination (Newest First)
exports.getAllLearners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 learners per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch learners sorted by creation date (newest first) with pagination
    const learners = await Learner.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip) // Skip documents for previous pages
      .limit(limit); // Limit the number of documents per page

    // Add index to each learner starting from 1 + skip (to maintain continuous numbering across pages)
    const learnersWithIndex = learners.map((learner, i) => ({
      ...learner.toObject(),
      index: skip + i + 1, // +1 to make it start from 1 instead of 0
    }));

    // Get the total number of learners
    const totalLearners = await Learner.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalLearners / limit);

    res.status(200).json({
      message: "Learners retrieved successfully",
      learners: learnersWithIndex, // Now with index property
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
  // Get Learners by Class (Grade) and Stream
exports.getLearnersByClassAndStream = async (req, res) => {
  try {
    const { grade, stream } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Validate grade and stream
    if (!grade || !stream) {
      return res.status(400).json({ 
        message: "Both grade and stream parameters are required" 
      });
    }

    // Fetch learners with pagination
    const learners = await Learner.find({ 
      grade: { $regex: new RegExp(grade, 'i') }, 
      stream: { $regex: new RegExp(stream, 'i') }
    })
    .sort({ name: 1 }) // Sort alphabetically by name
    .skip(skip)
    .limit(limit);

    // Count total learners matching the criteria
    const totalLearners = await Learner.countDocuments({ 
      grade: { $regex: new RegExp(grade, 'i') }, 
      stream: { $regex: new RegExp(stream, 'i') }
    });

    const totalPages = Math.ceil(totalLearners / limit);

    res.status(200).json({
      message: `Learners in ${grade} ${stream} retrieved successfully`,
      learners,
      currentPage: page,
      totalPages,
      totalLearners,
      grade,
      stream
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving learners by class and stream", 
      error: error.message 
    });
  }
};