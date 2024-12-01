const mongoose = require('mongoose');

// Define the Dormitory Schema
const DormitorySchema = new mongoose.Schema({
  dormitory_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  gender_restriction: {
    type: String,
    enum: ['Male', 'Female', 'Co-ed'],
    required: true,
  },
  number_of_rooms: {
    type: Number,
    required: true,
  },
  room_type: {
    type: String,
    enum: ['Single', 'Double', 'Suite'],
    required: true,
  },
  facilities: {
    type: [String],
    default: [],
  },
  warden_name: {
    type: String,
    required: true,
  },
  contact_info: {
    type: String,
    required: true,
  },
  assigned_students: {
    type: [mongoose.Schema.Types.ObjectId], // References to student IDs
    ref: 'Student',
    default: [],
  },
  building_year: {
    type: Number,
    required: true,
  },
  maintenance_status: {
    type: String,
    enum: ['Active', 'Under Maintenance'],
    default: 'Active',
  },
  emergency_contact: {
    type: String,
    required: true,
  },
  rules: {
    type: String,
    default: '',
  },
  meal_plan: {
    type: String,
    enum: ['Available', 'Not Available'],
    default: 'Not Available',
  },
  fee_structure: {
    type: Number, // Fee amount in a specified currency
    required: true,
  },
  cleaning_schedule: {
    type: String,
    default: '',
  },
  occupancy_rate: {
    type: Number, // A percentage value (0-100)
    default: 0,
  },
  security_details: {
    type: String,
    default: '',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Dormitory Model
const Dormitory = mongoose.model('Dormitory', DormitorySchema);

module.exports = Dormitory;
