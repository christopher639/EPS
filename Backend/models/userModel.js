const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true }, // Unique but optional for Google users
  password: { type: String }, // Optional for Google users
  fullName: { type: String, required: true },
  username: { type: String, unique: true, sparse: true }, // Unique but optional for Google users
  phoneNumber: { type: String },
  profilePicture: { type: String },
  role: { type: String, default: "instructor" }, // Default role
  status: { type: String, default: "pending" }, // Needs admin approval
  address: { type: String },
  dateOfBirth: { type: Date },
  preferences: { type: String },
  googleId: { type: String, unique: true, sparse: true }, // Google OAuth ID
  googleEmail: { type: String, unique: true, sparse: true }, // Google email
});

module.exports = mongoose.model("User", userSchema);