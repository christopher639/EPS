const mongoose = require('mongoose');

// Define the schema for a Teacher
const teacherSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], // Ensures consistent gender values
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
 
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tse: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['Bonded', 'Government'], // Options for type of teacher
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  subjectsteaching: {
    type: [String], // Array of subjects (e.g., ['Math', 'Science'])
    required: true,
  },

}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

// Create the model for the schema
const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
