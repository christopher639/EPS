const mongoose = require('mongoose');

// Define the schema for a Subject
const subjectSchema = new mongoose.Schema({
  SubjectName: {
    type: String,
    required: true,
  },
  SubjectCode: {
    type: String,
    required: true,
    unique: true,
  },
  Description: {
    type: String,
    required: false, // Optional field
  },
  Level: {
    type: String,
    enum: ['Primary', 'Secondary', 'University'], // Define acceptable levels
    required: true,
  },
  Grade: {
    type: String,
    required: true,
  },
  Department: {
    type: String,
    required: true,
  },
  SubjectCoordinator: {
    type: String,
    required: false, // Optional field
  },
  CurriculumCode: {
    type: String,
    required: false, // Optional field
  },
  TeachingHoursPerWeek: {
    type: Number,
    required: true,
  },
  PassMark: {
    type: Number,
    required: true,
  },
  ElectiveOrCompulsory: {
    type: String,
    enum: ['Elective', 'Compulsory'], // Specify whether it's elective or compulsory
    required: true,
  },
}, {
  timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
});

// Create the model for the schema
const Subject =   mongoose.model.Subject || mongoose.model('Subject', subjectSchema);

module.exports = Subject;
