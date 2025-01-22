const mongoose = require("mongoose");

const learningAreaSchema = new mongoose.Schema(
  {
    subjectname: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes leading and trailing spaces
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Department",//Assuming that Department model exist
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher", // Assumes a Teacher model exists
      required: false,
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
        ref: "student", // Assumes a Student model exists
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);
const LearningArea = mongoose.model("LearningArea", learningAreaSchema);

module.exports = LearningArea;
