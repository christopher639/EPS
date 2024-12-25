const mongoose = require("mongoose");
// Define the schema for subject marks
const subjectsMarksSchema = new mongoose.Schema({
    year: {
        type: String, // Year range as a string, e.g., "2024-2025"
        required: true,
    },
    term: {
        type: String, // E.g., "Term-1", "Term-2"
        required: true,
    },
    stream: {
        type: String, // E.g., "Science", "Arts"
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    category: {
        type: String, // E.g., "Opener", "Mid-Term"
        required: true,
    },
    code: {  // Changed "Code" to lowercase "code"
        type: String, // E.g., "MATH101", "ENG202"
        required: true,
    },
    regno: { 
        type: String, // Student registration number
        required: true,
    },
    score: {
        type: Number,
        required: true,
        min: [0, 'Score must be at least 0'],
        max: [100, 'Score must not exceed 100'],
    },
});

// Create the model for subject marks
const subjectsMarksModel = mongoose.models.mark || mongoose.model('mark', subjectsMarksSchema);

module.exports = subjectsMarksModel;
