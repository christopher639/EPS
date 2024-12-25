const subjectsMarksModel = require('../models/subjectsMarksModel'); // Import the model

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

exports.getSubjectMarksByClassYearTerm = async (req, res) => {
  try {
    // Destructure the parameters from the URL
    const { class: className, year, term } = req.params;
    // Build the match object for MongoDB query, ignoring the stream unless provided
    const match = {
      class: className,   // Filter by class
      year: year,         // Filter by year
      term: term,         // Filter by term
    };

    // Use MongoDB aggregation to fetch the marks data
    const marks = await subjectsMarksModel.aggregate([
      {
        $match: match,  // Apply the match filter dynamically
      },
      {
        $group: {
          _id: { regno: "$regno", code: "$Code" },  // Group by student (regno) and subject (Code)
          regno: { $first: "$regno" },  // Keep student regno
          code: { $first: "$Code" },    // Keep subject code
          stream: { $first: "$stream" }, // Add stream information
          scores: {
            $push: {  // Push each category's score into an array
              category: "$category",
              score: "$score",
            },
          },
        },
      },
      {
        $addFields: {
          openerScores: {
            $filter: {
              input: "$scores",
              as: "score",
              cond: { $eq: ["$$score.category", "Opener"] },  // Filter scores by "Opener"
            },
          },
          midTermScores: {
            $filter: {
              input: "$scores",
              as: "score",
              cond: { $eq: ["$$score.category", "Mid-Term"] },  // Filter scores by "Mid-Term"
            },
          },
          finalScores: {
            $filter: {
              input: "$scores",
              as: "score",
              cond: { $eq: ["$$score.category", "Final"] },  // Filter scores by "Final"
            },
          },
        },
      },
      {
        $addFields: {
          openerScore: { $avg: "$openerScores.score" },  // Calculate average of "Opener" scores
          midTermScore: { $avg: "$midTermScores.score" },  // Calculate average of "Mid-Term" scores
          finalScore: { $avg: "$finalScores.score" },  // Calculate average of "Final" scores
        },
      },
      {
        $addFields: {
          avgScore: { 
            $avg: ["$openerScore", "$midTermScore", "$finalScore"]  // Calculate the average of the 3 categories
          }
        }
      },
      {
        $lookup: {
          from: "students",  // Assuming the student model is in the "students" collection
          localField: "regno",  // Match based on regno
          foreignField: "regno", // Match regno in the students collection
          as: "studentData"  // Name of the new array field to store the student data
        },
      },
      {
        $unwind: {
          path: "$studentData",  // Unwind the student data array (as it will contain at most one element)
          preserveNullAndEmptyArrays: true  // If no student is found, keep the rest of the data intact
        }
      },
      {
        $addFields: {
          studentName: { $ifNull: ["$studentData.name", null] }  // If no student is found, set name to null
        }
      },
      {
        $group: {
          _id: "$regno",  // Group by regno (student)
          stream: { $first: "$stream" },  // Include the stream information for each student
          studentName: { $first: "$studentName" },  // Include student name
          subjects: {
            $push: {
              code: "$code",        // Subject code
              openerScore: "$openerScore", // Opener score
              midTermScore: "$midTermScore", // Mid-Term score
              finalScore: "$finalScore", // Final score
              avgScore: "$avgScore", // Average score for this subject
            },
          },
          overallAvg: {
            $avg: "$avgScore",  // Calculate the overall average across all subjects for this student
          },
        },
      },
      {
        $project: {
          regno: "$_id",    // Include regno in the final output
          stream: 1,        // Include the stream for each student
          studentName: 1,   // Include the student name
          subjects: 1,      // Include the list of subjects with their scores
          overallAvg: 1,    // Include the overall average for the student
          _id: 0,           // Remove the _id field
        },
      },
    
    ]);

    // If no data is found, return a 404 status
    if (marks.length === 0) {
      return res.status(404).json({
        message: `No marks found for ${term}, ${className}, ${year}`,
      });
    }

    // Respond with the reshaped data
    res.status(200).json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving data",
      error: error.message,
    });
  }
};

exports.getSubjectMarksByClassYearTermCategory = async (req, res) => {
  try {
    // Destructure the parameters from the URL
    const { class: className, year, term, category } = req.params;

    // Build the match object for MongoDB query, including the category filter
    const match = {
      class: className,   // Filter by class
      year: year,         // Filter by year
      term: term,         // Filter by term
      category: category, // Filter by category (Opener, Mid-Term, Final)
    };

    // Use MongoDB aggregation to fetch the marks data
    const marks = await subjectsMarksModel.aggregate([
      {
        $match: match,  // Apply the match filter dynamically
      },
      {
        $group: {
          _id: { regno: "$regno", code: "$Code" },  // Group by student (regno) and subject (Code)
          regno: { $first: "$regno" },  // Keep student regno
          code: { $first: "$Code" },    // Keep subject code
          stream: { $first: "$stream" }, // Add stream information
          scores: {
            $push: {  // Push each category's score into an array
              category: "$category",
              score: "$score",
            },
          },
        },
      },
      {
        $addFields: {
          filteredScores: {
            $filter: {
              input: "$scores",  // Filter by the category provided in the request
              as: "score",
              cond: { $eq: ["$$score.category", category] },
            },
          },
        },
      },
      {
        $addFields: {
          filteredScore: { $avg: "$filteredScores.score" },  // Calculate average of the filtered category's scores
        },
      },
      {
        $lookup: {
          from: "students",  // Assuming the student model is in the "students" collection
          localField: "regno",  // Match based on regno
          foreignField: "regno", // Match regno in the students collection
          as: "studentData"  // Name of the new array field to store the student data
        },
      },
      {
        $unwind: {
          path: "$studentData",  // Unwind the student data array (as it will contain at most one element)
          preserveNullAndEmptyArrays: true  // If no student is found, keep the rest of the data intact
        }
      },
      {
        $addFields: {
          studentName: { $ifNull: ["$studentData.name", null] }  // If no student is found, set name to null
        }
      },
      {
        $group: {
          _id: "$regno",  // Group by regno (student)
          stream: { $first: "$stream" },  // Include the stream information for each student
          studentName: { $first: "$studentName" },  // Include student name
          subjects: {
            $push: {
              code: "$code",        // Subject code
              filteredScore: "$filteredScore", // Filtered score for the selected category
            },
          },
        },
      },
      {
        $addFields: {
          totalScore: { $sum: "$subjects.filteredScore" },  // Sum of filtered scores for all subjects
          averageScore: {
            $cond: {
              if: { $eq: [{ $size: "$subjects" }, 0] }, // If no subjects, set averageScore to 0
              then: 0,
              else: { $divide: [{ $sum: "$subjects.filteredScore" }, { $size: "$subjects" }] },
            },
          },
        },
      },
      {
        $project: {
          regno: "$_id",    // Include regno in the final output
          stream: 1,        // Include the stream for each student
          studentName: 1,   // Include the student name
          subjects: 1,      // Include the list of subjects with their filtered scores
          totalScore: 1,    // Include the total score
          averageScore: 1,  // Include the average score
          _id: 0,           // Remove the _id field
        },
      },
      {
        $sort: { averageScore: -1 }  // Sort by average score in descending order (highest to lowest)
      }
    ]);

    // If no data is found, return a 404 status
    if (marks.length === 0) {
      return res.status(404).json({
        message: `No marks found for ${category}, ${term}, ${className}, ${year}`,
      });
    }

    // Respond with the reshaped data
    res.status(200).json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving data",
      error: error.message,
    });
  }
};
