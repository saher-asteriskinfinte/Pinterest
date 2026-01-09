const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect(process.env.MONGO_URI);


const userSchema = mongoose.Schema({
username:String,
fullname:String,
email:String,
password:String,
profileImage:{
  type:String,
  default:"/images/uploads/default.jpg",
},
board:{
  type:[String],
  default:[],
},
posts:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:"post",
}],
});

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema);