import mongoose  from "mongoose";
const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://bundi:<db_password>@cluster0.aaxy4.mongodb.net/")
}