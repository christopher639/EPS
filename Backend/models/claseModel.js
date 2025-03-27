const mongoose = require("mongoose");

// Define the schema for streams
const claseSchema = new mongoose.Schema({
  clasename: {
    type: String,
    required: true,
    unique: true, // Ensures stream names are unique
    trim: true,   // Removes leading/trailing whitespace
  },
  claseteacher: {
    type: String,
  },
},{
    timestamps:true
});

// Create the model for classes
const claseStream = mongoose.models.clase || mongoose.model("clase", claseSchema);

module.exports = claseStream;
