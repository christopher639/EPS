const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      match: /.+\@.+\..+/,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      
    },
    nationality: {
      type: String,
      
    },
    photo: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
      required:false
    },
    regno: {
      type: String,
      required: true,
      unique: true,
    },
     birthCertificateNo :{
       type:String
     },
     year:{
       type:String
     },
     belongToStaff:{
      type: String,
      enum: ["NO", "YES"],
      default: "NO",
     },
     studentType:{
      type: String,
      enum: ["Border", "Day Schooler"],
      default: "Border",
     },
    admissionDate: {
      type: Date,
      required: true,
    },
    enrollmentStatus: {
      type: String,
      enum: ["Enrolled", "Graduated", "Suspended"],
      default: "Enrolled",
    },
    stream: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: String,
    },
    healthStatus: {
      type: String,
      enum: ["Healthy", "Needs Medical Attention"],
      default: "Healthy",
    },
    physicalDisability: {
      type: Boolean,
      default: false,
    },
    immunizationStatus: {
      type: String,
    },
    guardianName: {
      type: String,
    },
    guardianRelationship: {
      type: String,
    },
    feeStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },
    scholarships: {
      type: [String],
    },
    feeHistory: [
      {
        amountPaid: {
          type: Number,
          required: false,
        },
        paymentDate: {
          type: Date,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const studentModel = mongoose.model.student || mongoose.model("student", studentSchema);
module.exports = studentModel;
