const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeacherSchema = new Schema({
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  teachingSubjects: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one teaching subject is required'
    }
  },
  department: {
    type: String,
    required: true,
  },
  tscNumber: {
    type: String,
    unique: true,
    sparse: true, // Allows null values without triggering duplicate error
    trim: true
  },
  employeeNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  bankAccount: {
    accountName: {
      type: String,
      required: true,
      trim: true
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true
    },
    bankName: {
      type: String,
      required: true,
      trim: true
    },
 
  }
}, { 
  timestamps: true 
});

// Prevent OverwriteModelError
const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;