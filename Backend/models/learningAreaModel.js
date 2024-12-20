const mongoose = require("mongoose");

const learningAreaSchema = new mongoose.Schema(
  {
    subjectname: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes leading and trailing spaces
    },
    subjectcode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // Ensures code is stored in uppercase
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    department: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacherModel", // Assumes a Teacher model exists
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1, // In weeks or months based on the application's convention
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Discontinued"],
      default: "Active",
    },
    language: {
      type: String,
      default: "English",
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "studentModel", // Assumes a Student model exists
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);
const LearningArea = mongoose.model("LearningArea", learningAreaSchema);

module.exports = LearningArea;
