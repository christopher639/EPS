const express = require("express")
const cors = require("cors")
const path = require("path");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");

//middles wares
const app = express()
app.use(bodyParser.json());
const port = process.env.PORT|| 3000;
app.use(express.json())
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// importing the routes
const feeDistributionRoutes = require('./Routes/feeDistributionRoutes');
const streamRoutes = require("./Routes/streamRoutes");
const learningAreaRoutes = require('./Routes/learningAreasRoutes.js');
const userRoutes = require('./Routes/userRoutes');
const studentRoutes = require("./Routes/studentRoutes");
const departmentRoutes =require("./Routes/departmentRoutes.js")
const subjectMarksRoutes = require("./Routes/subjectMarksRoutes");
const teacherRoutes = require('./Routes/teacherRoutes');
const expenseRoutes = require('./Routes/expenseRoutes');
const feesPaymentRoutes = require('./Routes/feesPaymentRoutes'); 
const learnerRoutes = require("./Routes/LearnerRoutes");
// using Routes
app.use('/api/fees-payments', feesPaymentRoutes);
app.use('/api/expenses', expenseRoutes); 
app.use('/api/fee-distributions', feeDistributionRoutes);
app.use("/api/streams", streamRoutes);
app.use('/api/learning-areas', learningAreaRoutes);
app.use("/api/students",studentRoutes);
app.use('/api/users', userRoutes);
app.use("/api/learners", learnerRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use("/uploads", express.static("uploads")); // To serve uploaded images
app.use('/api/marks',subjectMarksRoutes)
app.use("/api/students", studentRoutes);
//database online connections
// mongoose.connect("mongodb+srv://bundi:JnioqaoPY3DHT6g6@cluster0.aaxy4.mongodb.net/examination-processing-system")
// .then(()=>{
// console.log("Database connected")
// })
//database local connections
mongoose.connect("mongodb://localhost:27017/dreamhomehouse")
.then(()=>{
  console.log("Database connected")
})

//api to post data
app.listen(port,()=>{
    console.log(`Server is running at port http://localhost:${port}`)
})
//texting the apis
app.get("/",(req,res)=>{
    res.send("Api is working Christopher Bundi")
})


