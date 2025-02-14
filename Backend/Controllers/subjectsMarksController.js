const subjectsMarksModel = require('../models/subjectsMarksModel'); // Import the model

// CREATE - Add multiple subject marks
exports.createSubjectMarks = async (req, res) => {
  const marks = req.body.marks; // Assuming `marks` is an array of objects
  
  if (!marks || marks.length === 0) {
    return res.status(400).json({
      message: "No marks provided. Please provide at least one mark.",
    });
  }

  try {
    // Create an array of subjectMark instances
    const subjectMarks = marks.map(mark => new subjectsMarksModel({
      year: mark.year,
      term: mark.term,
      stream: mark.stream,
      class: mark.class,
      category: mark.category,
      code: mark.code,
      regno: mark.regno,
      score: mark.score,
    }));

    // Save all subject marks at once using Promise.all
    await Promise.all(subjectMarks.map(subjectMark => subjectMark.save()));

    res.status(201).json({
      message: `${marks.length} subject marks added successfully.`,
      marks: marks,
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


// exports.getSubjectMarksByClassYearTerm = async (req, res) => {
//   try {
//     // Destructure the parameters from the URL
//     const { class: className, year, term } = req.params;

//     // Build the match object for MongoDB query
//     const match = {
//       class: className,   // Filter by class
//       year: year,         // Filter by year
//       term: term,         // Filter by term
//     };

//     // Use MongoDB aggregation to fetch the marks data
//     const marks = await subjectsMarksModel.aggregate([
//       {
//         $match: match,  // Apply the match filter dynamically
//       },
//       {
//         $group: {
//           _id: { regno: "$regno", code: "$Code" },  // Group by student (regno) and subject (Code)
//           regno: { $first: "$regno" },  // Keep student regno
//           code: { $first: "$Code" },    // Keep subject code
//           stream: { $first: "$stream" }, // Add stream information
//           scores: {
//             $push: {  // Push each category's score into an array
//               category: "$category",
//               score: "$score",
//             },
//           },
//         },
//       },
//       {
//         $addFields: {
//           openerScores: {
//             $filter: {
//               input: "$scores",
//               as: "score",
//               cond: { $eq: ["$$score.category", "Opener"] },
//             },
//           },
//           midTermScores: {
//             $filter: {
//               input: "$scores",
//               as: "score",
//               cond: { $eq: ["$$score.category", "Mid-Term"] },
//             },
//           },
//           finalScores: {
//             $filter: {
//               input: "$scores",
//               as: "score",
//               cond: { $eq: ["$$score.category", "Final"] },
//             },
//           },
//         },
//       },
//       {
//         $addFields: {
//           openerScore: { $avg: "$openerScores.score" },
//           midTermScore: { $avg: "$midTermScores.score" },
//           finalScore: { $avg: "$finalScores.score" },
//         },
//       },
//       {
//         $addFields: {
//           avgScore: { $avg: ["$openerScore", "$midTermScore", "$finalScore"] },
//         },
//       },
//       {
//         $lookup: {
//           from: "learners",  // Assuming the student model is in the "learners" collection
//           localField: "regno",
//           foreignField: "regno",
//           as: "studentData",
//         },
//       },
//       {
//         $unwind: {
//           path: "$studentData",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $addFields: {
//           studentName: { $ifNull: ["$studentData.name", null] },
//         },
//       },
//       {
//         $lookup: {
//           from: "learningarea", // Look up from the learningarea collection
//           localField: "code",    // Match code from the subjectsMarksModel
//           foreignField: "code",  // Match code in the learningarea collection
//           as: "subjectInfo",     // Store subject info in the subjectInfo field
//         },
//       },
//       {
//         $unwind: {
//           path: "$subjectInfo",  // Unwind the subjectInfo array to get the subject data
//           preserveNullAndEmptyArrays: true,  // If no subject is found, preserve null
//         },
//       },
//       {
//         $addFields: {
//           subjectName: { $ifNull: ["$subjectInfo.subjectname", "Unknown Subject"] },
//         },
//       },
//       {
//         $group: {
//           _id: "$regno",
//           stream: { $first: "$stream" },
//           studentName: { $first: "$studentName" },
//           subjects: {
//             $push: {
//               code: "$code",
//               name: "$subjectName",  // Include subject name
//               openerScore: "$openerScore",
//               midTermScore: "$midTermScore",
//               finalScore: "$finalScore",
//               avgScore: "$avgScore",
//             },
//           },
//           overallAvg: { $avg: "$avgScore" },
//         },
//       },
//       {
//         $project: {
//           regno: "$_id",
//           stream: 1,
//           studentName: 1,
//           subjects: 1,
//           overallAvg: 1,
//           _id: 0,
//         },
//       },
//     ]);

//     // If no data is found, return a 404 status
//     if (marks.length === 0) {
//       return res.status(404).json({
//         message: `No marks found for ${term}, ${className}, ${year}`,
//       });
//     }

//     // Respond with the reshaped data
//     res.status(200).json(marks);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error retrieving data",
//       error: error.message,
//     });
//   }
// };
exports.getSubjectMarksByClassYearTerm = async (req, res) => {
  try {
    // Destructure the parameters from the URL
    const { class: className, year, term } = req.params;  // Extract class, year, and term from request params

    // Build the match object for MongoDB query
    const match = {
      class: className,   // Filter by class
      year: year,         // Filter by year
      term: term,         // Filter by term
    };

    // Use MongoDB aggregation to fetch the marks data
    const marks = await subjectsMarksModel.aggregate([

      // Match marks data based on class, year, and term
      {
        $match: match,  // Apply the match filter dynamically
      },
      
      // Group by student (regno) and subject (code)
      {
        $group: {
          _id: { regno: "$regno", code: "$code" },  // Group by student regno and subject code
          regno: { $first: "$regno" },  // Keep the student's registration number (regno)
          code: { $first: "$code" },    // Keep the subject code
          stream: { $first: "$stream" }, // Keep the stream information (e.g. Science, Arts)
          scores: {
            $push: {  // Push each category's score into an array
              category: "$category",  // The exam category (e.g. Opener, Mid-Term, Final)
              score: "$score",        // The score for that category
            },
          },
        },
      },

      // Separate scores into categories (Opener, Mid-Term, Final)
      {
        $addFields: {
          openerScores: {
            $filter: {  // Filter scores that are categorized as "Opener"
              input: "$scores",  // Input is the array of all scores
              as: "score",  // Alias for individual score
              cond: { $eq: ["$$score.category", "Opener"] },  // Filter by category "Opener"
            },
          },
          midTermScores: {
            $filter: {  // Filter scores that are categorized as "Mid-Term"
              input: "$scores",
              as: "score",
              cond: { $eq: ["$$score.category", "Mid-Term"] },  // Filter by category "Mid-Term"
            },
          },
          finalScores: {
            $filter: {  // Filter scores that are categorized as "Final"
              input: "$scores",
              as: "score",
              cond: { $eq: ["$$score.category", "Final"] },  // Filter by category "Final"
            },
          },
        },
      },

      // Calculate the average scores for each category (Opener, Mid-Term, Final)
      {
        $addFields: {
          openerScore: { $avg: "$openerScores.score" },   // Average score for Opener
          midTermScore: { $avg: "$midTermScores.score" }, // Average score for Mid-Term
          finalScore: { $avg: "$finalScores.score" },     // Average score for Final
        },
      },

      // Calculate overall average score from all categories
      {
        $addFields: {
          avgScore: { $avg: ["$openerScore", "$midTermScore", "$finalScore"] },  // Overall average score
        },
      },

      // Lookup student details based on the student's regno
      {
        $lookup: {
          from: "learners",  // Lookup from the "learners" collection
          localField: "regno",  // Local field to match (student regno)
          foreignField: "regno", // Foreign field in the "learners" collection
          as: "studentData",  // Store student data in "studentData" field
        },
      },
      {
        $unwind: {
          path: "$studentData",  // Unwind the student data array into an object
          preserveNullAndEmptyArrays: true,  // Allow missing student data
        },
      },
      {
        $addFields: {
          studentName: { $ifNull: ["$studentData.name", null] },  // Add student name, if available
        },
      },
      //
      
      // Lookup student details based on the student's regno
      {
        $lookup: {
          from: "learners",  // Lookup from the "learners" collection
          localField: "regno",  // Local field to match (student regno)
          foreignField: "regno", // Foreign field in the "learners" collection
          as: "studentPhoto",  // Store student data in "studentData" field
        },
      },
      {
        $unwind: {
          path: "$studentPhoto",  // Unwind the student data array into an object
          preserveNullAndEmptyArrays: true,  // Allow missing student data
        },
      },
      {
        $addFields: {
          studentImage: { $ifNull: ["$studentPhoto.learnerImage", null] },  // Add student name, if available
        },
      },
      //
 
      // Lookup subject details based on the subject code
      {
        $lookup: {
          from: "learningareas",  // Lookup from the "learningareas" collection
          localField: "code",      // Local field to match (subject code)
          foreignField: "code",    // Foreign field in the "learningareas" collection
          as: "subjectInfo",       // Store subject info in "subjectInfo" field
        },
      },
      {
        $unwind: {
          path: "$subjectInfo",    // Unwind the subject data array into an object
          preserveNullAndEmptyArrays: true,  // Allow missing subject data
        },
      },
      {
        $addFields: {
          subjectName: { $ifNull: ["$subjectInfo.subjectname", "Unknown"] },  // Add subject name, if available
        },
      },

      // Lookup teacher details based on the instructor's ID
      {
        $lookup: {
          from: "learningareas",  // Lookup from the "teachers" collection
          localField: "code",  // Local field to match (instructor ID)
          foreignField: "code",  // Foreign field in the "teachers" collection
          as: "teacherInfo",  // Store teacher info in "teacherInfo" field
        },
      },
      {
        $unwind: {
          path: "$teacherInfo",  // Unwind the teacher data array into an object
          preserveNullAndEmptyArrays: true,  // Allow missing teacher data
        },
      },
      {
        $addFields: {
          teacherName: { $ifNull: ["$teacherInfo.instructor", "Unknown"] },  // Add teacher name, if available
        },
      },

      // Group the data again by student (regno) to aggregate subjects and overall average
      {
        $group: {
          _id: "$regno",  // Group by student regno
          stream: { $first: "$stream" },  // Stream (e.g. Science, Arts) of the student
          studentImage:{$first: "$studentImage"},
          studentName: { $first: "$studentName" },  // Student name
          subjects: {  // List of subjects and their scores
            $push: {
              code: "$code",
              name: "$subjectName",  // Subject name
              teacherName: "$teacherName",  // Teacher name
              openerScore: "$openerScore",
              midTermScore: "$midTermScore",
              finalScore: "$finalScore",
              avgScore: "$avgScore",  // Average score for the subject
            },
          },
          overallAvg: { $avg: "$avgScore" },  // Overall average score for the student
        },
      },

      // Project the final response data
      {
        $project: {
          regno: "$_id",  // Return regno as _id
          stream: 1,  // Include stream info
          studentImage:1,
          studentName: 1,  // Include student name
          subjects: 1,  // Include subjects and scores
          overallAvg: 1,  // Include overall average score
          _id: 0,  // Exclude _id field from final output
        },
      },
    ]);

    // If no marks are found for the specified parameters, return a 404 status
    if (marks.length === 0) {
      return res.status(404).json({
        message: `No marks found for ${term}, ${className}, ${year}`,  // Return appropriate message
      });
    }

    // If marks are found, respond with the reshaped data
    res.status(200).json(marks);
  } catch (error) {
    console.error(error);  // Log any errors that occur during processing
    res.status(500).json({
      message: "Error retrieving data",  // Error message
      error: error.message,  // Specific error message
    });
  }
};

// exports.getSubjectMarksByClassYearTermCategory = async (req, res) => {
//   try {
//     // Destructure the parameters from the URL
//     const { class: className, year, term, category } = req.params;

//     // Build the match object for MongoDB query, including the category filter
//     const match = {
//       class: className,   // Filter by class
//       year: year,         // Filter by year
//       term: term,         // Filter by term
//       category: category, // Filter by category (Opener, Mid-Term, Final)
//     };

//     // Use MongoDB aggregation to fetch the marks data
//     const marks = await subjectsMarksModel.aggregate([
//       {
//         $match: match,  // Apply the match filter dynamically
//       },
//       {
//         $group: {
//           _id: { regno: "$regno", code: "$Code" },  // Group by student (regno) and subject (Code)
//           regno: { $first: "$regno" },  // Keep student regno
//           code: { $first: "$Code" },    // Keep subject code
//           stream: { $first: "$stream" }, // Add stream information
//           scores: {
//             $push: {  // Push each category's score into an array
//               category: "$category",
//               score: "$score",
//             },
//           },
//         },
//       },
//       {
//         $addFields: {
//           filteredScores: {
//             $filter: {
//               input: "$scores",  // Filter by the category provided in the request
//               as: "score",
//               cond: { $eq: ["$$score.category", category] },
//             },
//           },
//         },
//       },
//       {
//         $addFields: {
//           filteredScore: { $avg: "$filteredScores.score" },  // Calculate average of the filtered category's scores
//         },
//       },
//       {
//         $lookup: {
//           from: "learners",  // Assuming the student model is in the "learners" collection
//           localField: "regno",  // Match based on regno
//           foreignField: "regno", // Match regno in the learners collection
//           as: "studentData"  // Name of the new array field to store the student data
//         },
//       },
//       {
//         $unwind: {
//           path: "$studentData",  // Unwind the student data array (as it will contain at most one element)
//           preserveNullAndEmptyArrays: true  // If no student is found, keep the rest of the data intact
//         }
//       },
//       {
//         $addFields: {
//           studentName: { $ifNull: ["$studentData.name", null] }  // If no student is found, set name to null
//         }
//       },
//       {
//         $group: {
//           _id: "$regno",  // Group by regno (student)
//           stream: { $first: "$stream" },  // Include the stream information for each student
//           studentName: { $first: "$studentName" },  // Include student name
//           subjects: {
//             $push: {
//               code: "$code",        // Subject code
//               filteredScore: "$filteredScore", // Filtered score for the selected category
//             },
//           },
//         },
//       },
//       {
//         $addFields: {
//           totalScore: { $sum: "$subjects.filteredScore" },  // Sum of filtered scores for all subjects
//           averageScore: {
//             $cond: {
//               if: { $eq: [{ $size: "$subjects" }, 0] }, // If no subjects, set averageScore to 0
//               then: 0,
//               else: { $divide: [{ $sum: "$subjects.filteredScore" }, { $size: "$subjects" }] },
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           regno: "$_id",    // Include regno in the final output
//           stream: 1,        // Include the stream for each student
//           studentName: 1,   // Include the student name
//           subjects: 1,      // Include the list of subjects with their filtered scores
//           totalScore: 1,    // Include the total score
//           averageScore: 1,  // Include the average score
//           _id: 0,           // Remove the _id field
//         },
//       },
//       {
//         $sort: { averageScore: -1 }  // Sort by average score in descending order (highest to lowest)
//       }
//     ]);

//     // If no data is found, return a 404 status
//     if (marks.length === 0) {
//       return res.status(404).json({
//         message: `No marks found for ${category}, ${term}, ${className}, ${year}`,
//       });
//     }

//     // Respond with the reshaped data
//     res.status(200).json(marks);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error retrieving data",
//       error: error.message,
//     });
//   }
// };
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
          _id: { regno: "$regno", code: "$code" },  // Group by student (regno) and subject (code)
          regno: { $first: "$regno" },  // Keep student regno
          code: { $first: "$code" },    // Keep subject code
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
          from: "learners",  // Lookup student details
          localField: "regno",
          foreignField: "regno",
          as: "studentData",
        },
      },
      {
        $unwind: {
          path: "$studentData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          studentName: { $ifNull: ["$studentData.name", null] },
        },
      },
      {
        $lookup: {
          from: "learningareas", // Lookup subject details
          localField: "code",
          foreignField: "code",
          as: "subjectInfo",
        },
      },
      {
        $unwind: {
          path: "$subjectInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          subjectName: { $ifNull: ["$subjectInfo.subjectname", "Unknown"] },
        },
      },
      {
        $lookup: {
          from: "teachers", // Lookup teacher details
          localField: "subjectInfo.instructor",
          foreignField: "_id",
          as: "teacherInfo",
        },
      },
      {
        $unwind: {
          path: "$teacherInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          teacherName: { $ifNull: ["$teacherInfo.fullname", "Unknown"] },
        },
      },
      {
        $group: {
          _id: "$regno",  // Group by regno (student)
          stream: { $first: "$stream" },  // Include the stream information for each student
          studentName: { $first: "$studentName" },  // Include student name
          subjects: {
            $push: {
              code: "$code",        // Subject code
              name: "$subjectName", // Subject name
              teacherName: "$teacherName", // Teacher name
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

// In subjectsMarksController.js
exports.getStudentPerformanceByRegno = async (req, res) => {
  try {
    // Extract the parameters from the request
    const { year, term, category, regno } = req.params;

    // Build the match object for MongoDB query
    const match = {
      year: year,             // Filter by academic year
      term: term,             // Filter by term
      category: category,     // Filter by category (Opener, Mid-Term, Final)
      regno: regno,           // Filter by student's regno
    };

    // Use MongoDB aggregation to fetch the student performance data
    const marks = await subjectsMarksModel.aggregate([
      { $match: match },  // Apply the match filter

      {
        $group: {
          _id: { regno: "$regno", code: "$code" },  // Group by student (regno) and subject (code)
          regno: { $first: "$regno" },
          code: { $first: "$code" },
          stream: { $first: "$stream" },
          scores: {
            $push: {
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
              input: "$scores",
              as: "score",
              cond: { $eq: ["$$score.category", category] }, // Filter by category
            },
          },
        },
      },
      {
        $addFields: {
          filteredScore: { $avg: "$filteredScores.score" }, // Average the filtered category scores
        },
      },
      {
        $lookup: {
          from: "learners",  // Lookup student details
          localField: "regno",
          foreignField: "regno",
          as: "studentData",
        },
      },
      {
        $unwind: {
          path: "$studentData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          studentName: { $ifNull: ["$studentData.name", null] }, // Add student name
        },
      },
      {
        $lookup: {
          from: "learningareas",  // Lookup subject details
          localField: "code",
          foreignField: "code",
          as: "subjectInfo",
        },
      },
      {
        $unwind: {
          path: "$subjectInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          subjectName: { $ifNull: ["$subjectInfo.subjectname", "Unknown"] }, // Add subject name
        },
      },
      {
        $lookup: {
          from: "teachers",  // Lookup teacher details
          localField: "subjectInfo.instructor",
          foreignField: "_id",
          as: "teacherInfo",
        },
      },
      {
        $unwind: {
          path: "$teacherInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          teacherName: { $ifNull: ["$teacherInfo.fullname", "Unknown"] }, // Add teacher name
        },
      },
      {
        $group: {
          _id: "$regno",  // Group by regno (student)
          stream: { $first: "$stream" },
          studentName: { $first: "$studentName" },
          subjects: {
            $push: {
              code: "$code",
              name: "$subjectName",
              teacherName: "$teacherName",
              filteredScore: "$filteredScore",
            },
          },
        },
      },
      {
        $addFields: {
          totalScore: { $sum: "$subjects.filteredScore" },
          averageScore: {
            $cond: {
              if: { $eq: [{ $size: "$subjects" }, 0] },
              then: 0,
              else: { $divide: [{ $sum: "$subjects.filteredScore" }, { $size: "$subjects" }] },
            },
          },
        },
      },
      {
        $project: {
          regno: "$_id",   // Include regno in final output
          stream: 1,
          studentName: 1,
          subjects: 1,
          totalScore: 1,
          averageScore: 1,
          _id: 0,
        },
      },
      {
        $sort: { averageScore: -1 }  // Sort by average score
      },
    ]);

    // If no data is found
    if (marks.length === 0) {
      return res.status(404).json({
        message: `No marks found for student ${regno} in ${category}, ${term}, ${year}`,
      });
    }

    // Respond with the student performance data
    res.status(200).json(marks);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving data",
      error: error.message,
    });
  }
};

