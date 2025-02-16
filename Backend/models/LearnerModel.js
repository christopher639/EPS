const mongoose = require("mongoose");

const LearnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regno: { type: String, required: true },
  grade: { type: String, required: true },
  stream: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  nationality: { type: String, required: true },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  birthCertificateNo: { type: Number },
  address: { type: String, required: true },
  learnerImage: { type: String}, // Image is compulsory
});

const Learner = mongoose.model("Learner", LearnerSchema);
module.exports = Learner;
