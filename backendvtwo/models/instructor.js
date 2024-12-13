const mongoose = require('mongoose');

// Define the schema for a Teacher
const teacherSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  MiddleName: {
    type: String,
    required: false, // Optional
  },
  Gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], // Ensures consistent gender values
    required: true,
  },
  DateOfBirth: {
    type: Date,
    required: true,
  },
  NationalID: {
    type: String,
    required: true,
    unique: true,
  },
  PhoneNumber: {
    type: String,
    required: true,
  },
  EmailAddress: {
    type: String,
    required: true,
    unique: true,
  },
  TSCNumber: {
    type: String,
    required: true,
    unique: true,
  },
  TypeOfTeacher: {
    type: String,
    enum: ['Bonded', 'Government'], // Options for type of teacher
    required: true,
  },
  Salary: {
    type: Number,
    required: true,
  },
  SubjectsTeaching: {
    type: [String], // Array of subjects (e.g., ['Math', 'Science'])
    required: true,
  },
  Address: {
    Street: { type: String, required: true },
    City: { type: String, required: true },
    StateOrProvince: { type: String, required: true },
    PostalCode: { type: String, required: true },
    Country: { type: String, required: true },
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});
// Create the model for the schema
const teacher = mongoose.models.teacher || mongoose.model('teacher', teacherSchema);
module.exports = teacher;
