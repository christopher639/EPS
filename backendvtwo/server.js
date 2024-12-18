const express = require("express")
const cors = require("cors")
const path = require("path");
const mongoose = require("mongoose")


const bodyParser = require('body-parser');

const learningrouter =require("./Routes/LearningAreaRoutes.js")
const departmentRoutes =require("./Routes/departmentRoutes.js")
const officeRoutes = require('./Routes/officeRoutes.js');
const teacherRoutes = require('./Routes/teacherRoutes');

const staffModel = require("./models/staffs.js")
const MarkModel = require("./models/marks.js")
const UserModel = require("./models/Users.js")

const LearningArea = require("./models/Learningarea.js")
const studentModel = require("./models/students.js")
const subjectsMarksModel  =  require('./models/subjectsmarks.js')
const streamModel = require("./models/stream.js")
const LastRegno = require('./models/LastRegno.js');


const app = express()
const port = process.env.PORT|| 3000;
app.use(express.json())
app.use(cors());

/**
 * mongoose.connect("mongodb://localhost:27017/dreamhomehouse")
.then(()=>{
  console.log("Database connected")
})
 */

//Routes

app.use('/api/learningAreas', learningrouter);
app.use('/api/departments', departmentRoutes);
app.use('/api/offices', officeRoutes);
app.use('/api/teachers', teacherRoutes);

mongoose.connect("mongodb+srv://bundi:JnioqaoPY3DHT6g6@cluster0.aaxy4.mongodb.net/examination-processing-system")
.then(()=>{
console.log("Database connected")
})

//API to get all users or staff
app.get('/api/staffs',async(req,res)=>{
 try {
  const staffs = await staffModel.find()
  res.status(200).json(staffs)
 } catch (error) {
  res.status(500).json({message: error.message})
 }
})
//api to post data
app.listen(port,()=>{
    console.log(`Server is running at port http://localhost:${port}`)
})

// Routes

app.get("/",(req,res)=>{
    res.send("Api is working Christopher Bundi")
})
//New APIS
app.post("/api/staff",async(req,res)=>{
 try {
  const staff = await staffModel.create(req.body)
  res.status(200).json({success:"true",message:"Data saved successfully"})
 } catch (error) {
  res.status(500).json({message:error.message})
 }
})
//same apis


//update data
app.put("/update",async(req,res)=>{
  try {
    const {id,...rest} = req.body
     const staff=  await staffModel.updateOne({_id:id},rest)
    res.status(200).json({success:"true",message:"Data saved successfully",staff:staff})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})


//User model controllers date 14-10-2024
app.get("/Users",async(req,res)=>{
  try {
    const users = await UserModel.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({success:"false",message:error})
  }
})

app.post("/create",async(req,res)=>{
  try {
    const user = await UserModel.create(req.body)
    res.status(200).json({success:"true",message:"User posted successfully" ,user:user})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})
//Api to update 
app.put("/updateuser",async(req,res)=>{
 try {
  const {id,...rest} =req.body
  
    const user = await UserModel.updateOne({_id:id},rest)
  res.status(200).json({Success:"true",message:"Data updated successfully" ,user:user})
 } catch (error) {
  res.status(500).json({message:error.message})
 }
})

//Api to delete user
app.delete("/delete/:id",async(req,res)=>{
  try {
    const {id} = req.params
    await UserModel.findByIdAndDelete(id)
    res.status(200).json({success:"true",message:"Data deleted successfully"})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})



//marks Api to get all marks
app.get("/marks",async(req,res)=>{
  try {
   const mark = await MarkModel.find()
   res.status(200).json(mark)
  } catch (error) {
   res.status(500).json({message:error.message})
  }
 })


 app.post("/mark",async(req,res)=>{
  try {
    const mark = await MarkModel.create(req.body)
    res.status(200).json({success:"true",message:"Marks posted successfully" ,mark:mark})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

//23/10/2024
//to get all the marks for math

//api to post data to math model

//english apis
app.get("/api/eng",async(req,res)=>{
  try {
    const eng =  await engModel.find()
    res.status(200).json(eng)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})


app.post("/api/eng",async(req,res)=>{
  try {
    const eng = await engModel.create(req.body)
    res.status(200).json({success:"true",message:"eng created to database"})
  } catch (error) {
    res.status.json({message: error.message})
  }
})


//students api to get student and to post students to the database
app.get("/api/students",async(req,res)=>{
  
  try {

    const students  = await studentModel.find()
    res.status(200).json(students)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})


//api to post student information to the database

//image storage


// Route for adding a new student and handling image upload
app.post('/api/students', async (req, res) => {
  // Working on the API to avoid posting similar students in the database
  const { regno } = req.body;

  try {
    // Check if a student with the same registration number already exists
    const studentregno = await studentModel.findOne({ regno });

    if (studentregno) {
      // If the student exists, send an appropriate response
      return res.status(400).json({
        success: false,
        message: `Student with registration number ${regno} already exists in the database.`,
      });
    }

    // Create the new student if no duplicate is found
    await studentModel.create(req.body);

    // Return success message for successful student admission
    res.status(201).json({
      success: true,
      message: "Student admitted successfully",
    });
  } catch (error) {
    // Catch any errors and return an error response
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



app.get('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  try {
    const student = await studentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student details' });
  }
});


//apii to delete student
app.delete("/api/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await studentModel.findByIdAndDelete(id);
    res.status(200).json({ success: "true", message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



//api to find a student by regno
app.get("api/student/:regno",async(req,res) =>{
  const  {regno}   = req.params
  try {
    const student = await studentModel.findOne({regno});
    if(!student){
      res.status(404).json({success:"false",message:`Student with regNo: ${regno} does not exixt in the database`})
    }
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

//The big deal for today is handling the looks and aggreate =s to combine 3 collections



//aggreagation and lookups  data 23/10/2024
app.get("/api/subjectmark",async(req,res)=>{
  try {
     await subjectsMarksModel.find();
    res.status(200).json({
      success: true,
      message: "Mark Saved"
    });
  } catch (error) {
    res.status(404).json({message:error.message})
  }
})

app.post("/api/subjectmark",async(req,res)=>{
  try {
    await subjectsMarksModel.create(req.body)
     res.status(200).json({success:"true",message:"New Student with marks has been admitted to the database"})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})





app.delete("/api/subjectmark/:id", async (req, res) => {
  const markId = req.params.id; // Get the ID from the URL

  try {
    const result = await subjectsMarksModel.findByIdAndDelete(markId); // Replace with your actual model
    if (!result) {
      return res.status(404).send('Mark not found');
    }

    res.status(200).json({ message: "Mark deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});










//the look ups and aggregate of student collection and subject mark collections
app.get("/api/joined-students_marks", async (req, res) => {
  try {
    const joinStudentMarks = await studentModel.aggregate([
      {
        // Step 1: Lookup marks for each student
        $lookup: {
          from: "subjectmarks", // Collection to join
          localField: "regno",  // Field from students
          foreignField: "regno", // Field from marks
          as: "marks" // Output array field
        }
      },
      {
        // Step 2: Match only students in form1x
        $match: {
          stream: "form1x" // Assuming 'stream' field indicates the form
        }
      },
      {
        // Step 3: Project the required fields
        $project: {
          _id: 0,  // Exclude the _id field
          name: 1, // Include the student name
          regno: 1, // Include the regno
          marks: {
            $arrayToObject: {
              $map: {
                input: "$marks",
                as: "mark",
                in: { k: "$$mark.subjectcode", v: "$$mark.score" }
              }
            }
          }
        }
      }
    ]);

    res.status(200).json(joinStudentMarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.get("/api/joined-students-generallay", async (req, res) => {
  try {
    const joinStudentMarks = await studentModel.aggregate([
      {
        // Step 1: Lookup marks for each student
        $lookup: {
          from: "subjectmarks", // Collection to join
          localField: "regno",  // Field from students
          foreignField: "regno", // Field from marks
          as: "marks" // Output array field
        }
      },
      {
        // Step 2: Project the required fields, including the stream
        $project: {
          _id: 0,  // Exclude the _id field
          name: 1, // Include the student name
          regno: 1, // Include the regno
          stream: 1, // Include the student's stream
          marks: {
            $arrayToObject: {
              $map: {
                input: "$marks",
                as: "mark",
                in: { k: "$$mark.subjectcode", v: "$$mark.score" }
              }
            }
          }
        }
      }
    ]);

    res.status(200).json(joinStudentMarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





const getJoinedStudentsMarks = async (stream) => {
  return await studentModel.aggregate([
    {
      // Step 1: Lookup marks for each student
      $lookup: {
        from: "subjectmarks", // Collection to join
        localField: "regno",  // Field from students
        foreignField: "regno", // Field from marks
        as: "marks" // Output array field
      }
    },
    {
      // Step 2: Match only students in the specified stream
      $match: {
        stream: stream // Dynamic stream filtering
      }
    },
    {
      // Step 3: Project the required fields
      $project: {
        _id: 0,  // Exclude the _id field
        name: 1, // Include the student name
        regno: 1, // Include the regno
        stream: 1, // Include the stream
        marks: {
          $arrayToObject: {
            $map: {
              input: "$marks",
              as: "mark",
              in: { k: "$$mark.subjectcode", v: "$$mark.score" }
            }
          }
        }
      }
    }
  ]);
};

// Reusable API endpoint
app.get("/api/joined-students_marks/:stream", async (req, res) => {
  try {
    const { stream } = req.params; // Extract stream from URL parameters
    const joinStudentMarks = await getJoinedStudentsMarks(stream);
    res.status(200).json(joinStudentMarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getStudentCountByStream = async () => {
  return await studentModel.aggregate([
    {
      // Step 1: Group by stream and count students in each stream
      $group: {
        _id: "$stream", // Group by stream
        totalStudents: { $sum: 1 } // Count the number of students in each stream
      }
    },
    {
      // Step 2: Project the required fields for output
      $project: {
        _id: 0, // Exclude the _id field
        stream: "$_id", // Rename _id field to stream
        totalStudents: 1 // Include the total number of students in each stream
      }
    }
  ]);
};

// Reusable API endpoint
app.get("/api/total-students-by-stream", async (req, res) => {
  try {
    const studentCountByStream = await getStudentCountByStream();
    res.status(200).json(studentCountByStream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//27/10/2024  stream 
app.post("/api/stream",async(req,res)=>{
  try {
    const stream = await streamModel.create(req.body)
    res.status(200).json({success:"true",message:"New Stream with  has been created to the database"})
 } catch (error) {
   res.status(500).json({message:error.message})
 }
})

app.get("/api/stream",async(req,res)=>{
  try {
    const streams = await streamModel.find()
    res.status(200).json(streams)
 } catch (error) {
   res.status(500).json({message:error.message})
 }
})

app.get('/api/last-registration-number', async (req, res) => {
  try {
    // Try fetching the latest registration number from the database
    const lastRegnoDoc = await LastRegno.findOne().sort({ _id: -1 }).limit(1); // Find the last entry

    if (lastRegnoDoc) {
      // If a regno is found, return the regno number incremented by 1
      return res.status(200).json({ lastRegno: lastRegnoDoc.lastRegno });
    }

    // If no regno found, return the default starting regno
    return res.status(200).json({ lastRegno: 5000 }); // Starting regno
  } catch (error) {
    console.error("Error fetching last registration number:", error);
    return res.status(500).json({ message: "Failed to fetch last registration number" });
  }
});

// routes/registration.js
app.post('/api/update-last-regno', async (req, res) => {
  try {
    const { lastRegno } = req.body;

    // Check if the body contains a valid lastRegno value
    if (typeof lastRegno !== 'number') {
      return res.status(400).json({ message: "Invalid registration number" });
    }

    // Find or create the document that stores the lastRegno
    const existingRegno = await LastRegno.findOne();

    if (existingRegno) {
      // If it exists, update the registration number
      existingRegno.lastRegno = lastRegno;
      await existingRegno.save();
    } else {
      // Otherwise, create a new record
      const newRegno = new LastRegno({ lastRegno });
      await newRegno.save();
    }

    return res.status(200).json({ message: "Last registration number updated successfully" });
  } catch (error) {
    console.error("Error updating last registration number:", error);
    return res.status(500).json({ message: "Failed to update last registration number" });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // Catch-all route to serve React app for any route not handled by the API
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


