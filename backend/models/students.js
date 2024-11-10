const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    passport: { type: String,  },
    name: { type: String, required: true },
    dot: { type: Date, required: true }, // Date of admission
    dob: { type: Date, required: true }, // Date of birth
    regno: { type: String, required: true },
    gender: { type: String, required: true },
    previous: { type: String, required: true }, // Previous school or level
    stream: { type: String, required: true },
    parentname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

const studentModel = mongoose.model.student ||   mongoose.model("student", studentSchema);

module.exports = studentModel;
