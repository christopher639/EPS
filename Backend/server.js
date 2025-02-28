const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config(); // Load environment variables

// Middleware
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({origin:"*"}));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const feeDistributionRoutes = require("./Routes/feeDistributionRoutes");
const streamRoutes = require("./Routes/streamRoutes");
const learningAreaRoutes = require("./Routes/learningAreasRoutes");
const userRoutes = require("./Routes/userRoutes");
const studentRoutes = require("./Routes/studentRoutes");
const departmentRoutes = require("./Routes/departmentRoutes");
const subjectMarksRoutes = require("./Routes/subjectMarksRoutes");
const teacherRoutes = require("./Routes/teacherRoutes");
const expenseRoutes = require("./Routes/expenseRoutes");
const feesPaymentRoutes = require("./Routes/feesPaymentRoutes");
const learnerRoutes = require("./Routes/LearnerRoutes");

// Use routes
app.use("/api/fees-payments", feesPaymentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/fee-distributions", feeDistributionRoutes);
app.use("/api/streams", streamRoutes);
app.use("/api/learning-areas", learningAreaRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/learners", learnerRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/marks", subjectMarksRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
//atlas 1 connection   mongodb+srv://bundi:JnioqaoPY3DHT6g6@cluster0.aaxy4.mongodb.net/examination-processing-system
//database online connections
mongoose.connect("mongodb+srv://christopherbundi639:xDFLqAKg7G78hcuu@cluster0.uosxzen.mongodb.net/samge")
.then((error)=>{
console.log("Database connected")
})

//database local connections
// mongoose
//   .connect("mongodb://localhost:27017/dreamhomehouse")
//   .then(() => {
//     console.log("Database connected");
//   })
//   .catch((err) => {
//     console.error("Database connection error:", err);
//   });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Test API
app.get("/", (req, res) => {
  res.send("API is working - Christopher Bundi");
});

