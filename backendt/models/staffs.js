const mongoose = require("mongoose")

const staffSchema = new mongoose.Schema({
    staffNo:String,
    fname:String,
    Lname:String,
    position:String,
    sex:String,
    dot:String,
    salary:Number,
    branchNo:String

},{
    timestamps:true
})

const staffModel = mongoose.model.staffSchema || mongoose.model("Staffmember",staffSchema)
module.exports = staffModel
