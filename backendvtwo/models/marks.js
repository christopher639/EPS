const mongoose = require("mongoose")
const markSchema = mongoose.Schema({
  name:String,
  adm:String,
  math:Number,
  eng:Number,
  sci:Number,
  phy:Number,
  bio:Number,
  chem:Number,
  kisw:Number,
  geo:Number,
},{
  timestamps:true
})
const MarkModel = mongoose.model.mark || mongoose.model("mark",markSchema)
module.exports = MarkModel