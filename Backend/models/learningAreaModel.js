const mongoose = require("mongoose");

const learningAreaSchema = new mongoose.Schema(
  {
    subjectname: {
      type: String,
      required: true,
      trim: true, // Removes leading and trailing spaces
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      
    },
    department: {
      type:String
      
    },
    instructor: {
      type:String
      
    },
    level:{
       type:String
    },
    duration: {
      type: Number,
      required: true,
      min: 1, // In weeks or months based on the application's convention
    },
    content:{
     type:String
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
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);
const LearningArea = mongoose.model("LearningArea", learningAreaSchema);

module.exports = LearningArea;
