const mongoose = require("mongoose");

const subjectsMarksSchema = new mongoose.Schema({
     yearOfStudy:{
         type:Date,
        required:false
     },
     term:{
        type:String,
        required:false
     },
     stream:{
        type:String,
         required:false
     },
     examCategory:{
        type:String,
         required:false
     },

    subjectcode: { 
        type: String, 
        required: true 
    },
    regno: { 
        type: String,
        required: true },
    score: {
        type: Number,
        required: true,
        min: [0, 'Score must be at least 0'],
        max: [100, 'Score must not exceed 100']
    }
});
const subjectsMarksModel =  mongoose.model.subjectmark ||  mongoose.model('subjectmark', subjectsMarksSchema);
module.exports = subjectsMarksModel;
