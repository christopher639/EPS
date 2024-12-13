const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
  name:String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile:Number
},{
  timestamps:true
})
const UserModel = mongoose.model.user || mongoose.model("user",userSchema)
module.exports = UserModel