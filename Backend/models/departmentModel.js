const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
   //   trim: true,
    },
    departmentCode: {
      type: String,
      required: true,
     // unique: true,
      uppercase: true,
     // trim: true,
    },
    departmentHead: {
      type: String,
      required: true,
  //    trim: true,
    },
    numberOfStaff: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
   //   trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
   //   lowercase: true,
      // Uncomment the regex below if you want to validate email format
      // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    contactPhone: {
      type: String,
      required: true,
      // Uncomment the regex below if you want to validate phone number format
      // match: /^\+?[0-9\s\-]+$/,
    },
    establishedYear: {
      type: Number,
      required: true,
     // min: 1800,
     // max: new Date().getFullYear(),
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Department =
  mongoose.models.Department || mongoose.model("Department", departmentSchema);
module.exports = Department;
