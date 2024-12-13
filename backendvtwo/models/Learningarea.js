const mongoose = require('mongoose');
const LearningAreaSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: true,
    trim: true, // e.g., 'CHEM10'
  },
  name: {
    type: String,
    required: true,
    trim: true, // e.g., 'Chemistry'
  },
  description: {
    type: String,
    default: 'No description provided.',
  },
  level: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true, // e.g., 'Sciences'
  },
  teacher: {
    type: String,
    required: true, // e.g., 'Sciences'
  },
  assessmentType: {
    type: String,
    required: true, 
  },
  status: {
    type: String,
    required: true,
  },
  languageOfInstruction: {
    type: String,
    required: true, 
  },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields
const LearningArea = mongoose.model.LearningArea ||   mongoose.model('LearningArea', LearningAreaSchema);
module.exports = LearningArea;
