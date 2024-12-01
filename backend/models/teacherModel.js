const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    fullname: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    nationaid: {
      type: String,
      required: false,  // Remove unique constraint
    },
    email: {
      type: String,
      required: true,
     
    },
    phone: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    subjectsteaching: {
      type: [String],
      required: true,
    },
    type: {
      type: String,
      enum: ['Bonded', 'Government'],
      required: true,
    },
    tse: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
}, {
  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
