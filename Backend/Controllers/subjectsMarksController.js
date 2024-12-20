const subjectsMarksModel = require("../models/subjectsMarksModel");

// CREATE - Add new subject marks
exports.createSubjectMark = async (req, res) => {
  try {
    const subjectMark = new subjectsMarksModel(req.body);
    await subjectMark.save();
    res.status(201).json({
      message: "Subject marks added successfully",
      subjectMark,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating subject marks",
      error: error.message,
    });
  }
};

// READ - Get all subject marks
exports.getAllSubjectMarks = async (req, res) => {
  try {
    const subjectMarks = await subjectsMarksModel.find();
    res.status(200).json(subjectMarks);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching subject marks",
      error: error.message,
    });
  }
};

// READ - Get a single subject mark by ID
exports.getSubjectMarkById = async (req, res) => {
  try {
    const subjectMark = await subjectsMarksModel.findById(req.params.id);
    if (!subjectMark) {
      return res.status(404).json({
        message: "Subject mark not found",
      });
    }
    res.status(200).json(subjectMark);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching subject mark",
      error: error.message,
    });
  }
};

// UPDATE - Update subject mark information
exports.updateSubjectMark = async (req, res) => {
  try {
    const subjectMark = await subjectsMarksModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!subjectMark) {
      return res.status(404).json({
        message: "Subject mark not found",
      });
    }
    res.status(200).json({
      message: "Subject mark updated successfully",
      subjectMark,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating subject mark",
      error: error.message,
    });
  }
};

// DELETE - Delete a subject mark
exports.deleteSubjectMark = async (req, res) => {
  try {
    const subjectMark = await subjectsMarksModel.findByIdAndDelete(req.params.id);
    if (!subjectMark) {
      return res.status(404).json({
        message: "Subject mark not found",
      });
    }
    res.status(200).json({
      message: "Subject mark deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting subject mark",
      error: error.message,
    });
  }
};

exports.getSubjectMarks = async (req, res) => {
  try {
    const { year, stream, term, examcategory } = req.params; // Include examCategory in parameters

    // Use MongoDB aggregation to group data by regno and filter by examCategory
    const marks = await subjectsMarksModel.aggregate([
      {
        $match: { year, stream, term, examCategory: examcategory }, // Filter by year, stream, term, and examCategory
      },
      {
        $group: {
          _id: "$regno", // Group by registration number (regno)
          regno: { $first: "$regno" }, // Keep regno in the output
          year: { $first: "$year" }, // Keep year in the output
          stream: { $first: "$stream" }, // Keep stream in the output
          term: { $first: "$term" }, // Keep term in the output
          examCategory: { $first: "$examCategory" }, // Include the exam category
          marks: {
            $push: {
              subjectCode: "$subjectCode", // Include subject code
              score: "$score", // Include score
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Remove the internal MongoDB `_id` field
        },
      },
    ]);

    // If no data is found, return a 404 status
    if (marks.length === 0) {
      return res.status(404).json({
        message: `No marks found for ${examcategory} in ${term}, ${stream}, ${year}`,
      });
    }

    // Respond with the filtered data
    res.status(200).json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving data",
      error: error.message,
    });
  }
};

// READ - Get student marks for all subjects with average score
exports.getStudentMarksWithAverage = async (req, res) => {
  try {
    const { stream, year, term } = req.params;

    // Use MongoDB aggregation to fetch and calculate averages
    const result = await subjectsMarksModel.aggregate([
      // Match based on stream, year, and term
      { $match: { stream, year, term } },

      // Group by regno and subjectCode
      {
        $group: {
          _id: { regno: "$regno", subjectCode: "$subjectCode" }, // Group by student and subject
          scores: { $push: { examCategory: "$examCategory", score: "$score" } }, // Collect scores
        },
      },

      // Calculate the average score for each subject
      {
        $project: {
          regno: "$_id.regno",
          subjectCode: "$_id.subjectCode",
          scores: 1,
          averageScore: {
            $avg: "$scores.score", // Calculate the average score
          },
        },
      },

      // Optionally, sort by student number and subject
      { $sort: { regno: 1, subjectCode: 1 } },
    ]);

    // If no data is found, return a 404 status
    if (result.length === 0) {
      return res.status(404).json({
        message: `No marks found for ${term}, ${stream}, ${year}`,
      });
    }

    // Respond with the calculated data
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving data",
      error: error.message,
    });
  }
};

