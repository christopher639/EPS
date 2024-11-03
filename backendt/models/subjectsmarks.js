const mongoose = require("mongoose");

const subjectsMarksSchema = new mongoose.Schema({
    subjectcode: { type: String, required: true },
    regno: { type: String, required: true },
    score: {
        type: Number,
        required: true,
        min: [0, 'Score must be at least 0'],
        max: [100, 'Score must not exceed 100']
    }
});

const subjectsMarksModel =  mongoose.model.subjectmark ||  mongoose.model('subjectmark', subjectsMarksSchema);
module.exports = subjectsMarksModel;
