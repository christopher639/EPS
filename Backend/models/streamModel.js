const mongoose = require("mongoose");

// Define the schema for streams
const streamSchema = new mongoose.Schema({
  clase:{
    type:String,
    required:true
  },
  name: {
    type: String,
    required: true,
    unique: true, // Ensures stream names are unique
    trim: true,   // Removes leading/trailing whitespace
  },
  teacher: {
    type: String,
     // Name of the teacher managing the stream
  },
},{
    timestamps:true
});

// Create the model for streams
const Stream = mongoose.models.stream || mongoose.model("stream", streamSchema);

module.exports = Stream;
