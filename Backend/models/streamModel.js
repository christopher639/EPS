const mongoose = require("mongoose");

// Define the schema for streams
const streamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures stream names are unique
    trim: true,   // Removes leading/trailing whitespace
  },
  teacher: {
    type: String,
    required: true, // Name of the teacher managing the stream
  },
},{
    timestamps:true
});

// Create the model for streams
const Stream = mongoose.models.stream || mongoose.model("stream", streamSchema);

module.exports = Stream;
