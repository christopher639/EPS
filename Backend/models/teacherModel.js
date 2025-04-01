const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schemas
const EmergencyContactSchema = new Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true }, // e.g., "Spouse", "Parent"
  phone: { type: String, required: true },
  alternatePhone: { type: String }
});

const QualificationSchema = new Schema({
  degree: { type: String, required: true }, // e.g., "B.Ed Mathematics"
  institution: { type: String, required: true },
  yearCompleted: { type: Number, required: true },
  certification: { type: String }, // e.g., "TSC Number"
  specialization: { type: String } // e.g., "Special Needs Education"
});

const TeacherSchema = new Schema({
  // Core Identification
  teacherId: { type: String, required: true, unique: true }, // School-generated ID
  tscNumber: { type: String, unique: true, sparse: true }, // For government teachers
  fullName: { type: String, required: true },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'],
    required: true 
  },
  dateOfBirth: { type: Date, required: true },
  nationalId: { type: String, required: true },
  passportPhoto: { type: String }, // URL to stored image

  // Contact Information
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  alternatePhone: { type: String },
  address: { 
    physical: { type: String, required: true },
    postal: { type: String }
  },

  // Employment Details
  employmentType: { 
    type: String, 
    enum: ['Bonded', 'Government', 'Contract', 'Part-time', 'Volunteer'],
    required: true 
  },
  employmentDate: { type: Date, required: true },
  terminationDate: { type: Date },
  salary: { type: Number, required: true },
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    branch: { type: String }
  },
  taxInfo: {
    pin: { type: String }, // KRA PIN for Kenya
    nssf: { type: String }
  },

  // Professional Information
  department: { 
    type: String, 
    enum: ['Mathematics', 'Languages', 'Sciences', 'Humanities', 'Technical', 'Administration'],
    required: true 
  },
  subjectsTeaching: { type: [String], required: true }, // e.g., ["Math", "Physics"]
  currentClasses: [{ 
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    stream: { type: String } // e.g., "North"
  }],
  isClassTeacher: { type: Boolean, default: false },
  classTeacherOf: { type: Schema.Types.ObjectId, ref: 'Class' }, // If applicable
  qualifications: [QualificationSchema],

  // System Access
  systemRole: { 
    type: String, 
    enum: ['Teacher', 'HOD', 'Deputy', 'Principal', 'Admin'],
    default: 'Teacher' 
  },
  username: { type: String, unique: true },
  password: { type: String, select: false }, // Password will be hashed
  lastLogin: { type: Date },

  // Emergency Contacts
  emergencyContacts: [EmergencyContactSchema],

  // Professional Development
  trainingRecords: [{
    title: { type: String },
    provider: { type: String },
    date: { type: Date },
    duration: { type: String } // e.g., "2 weeks"
  }],

  // Evaluation & Performance
  appraisalRecords: [{
    year: { type: Number },
    score: { type: Number },
    remarks: { type: String }
  }],

  // Leave Management
  leaveBalance: { 
    annual: { type: Number, default: 21 }, // Kenya standard
    sick: { type: Number, default: 7 },
    compassionate: { type: Number, default: 3 }
  },

  // Status
  status: { 
    type: String, 
    enum: ['Active', 'Suspended', 'On Leave', 'Terminated', 'Retired'],
    default: 'Active' 
  },
  notes: { type: String }
}, { 
  timestamps: true 
});

// Prevent OverwriteModelError
const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;