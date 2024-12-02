const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema({
  officeName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    default: "Not Specified",
  },
  contactEmail: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  officeHead: {
    type: String, // You can change this to ObjectId if referencing a User model
    trim: true,
  },
  officeType: {
    type: String,
    enum: ['Administrative', 'Academic', 'Support', 'Finance','Other'],
    default: 'Other',
  },
  officeHours: {
    type: String,
    trim: true,
  },
  responsibilities: {
    type: String,
    trim: true,
  },
  budget: {
    type: Number,
    default: 0,
  },
  staffCount: {
    type: Number,
    default: 0,
  },

  dateEstablished: {
    type: Date,
    default: Date.now,
  },
  officeStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'Under Renovation'],
    default: 'Active',
  },



});

// Creating a model
const Office = mongoose.model.Office || mongoose.model('Office', officeSchema);

module.exports = Office;
