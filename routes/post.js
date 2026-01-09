const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title:String,
  description:String,
  image:{
    type:String,
    required:true,
  },
date:{
  type:Date,
  default:Date.now(),
},
user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"user",
},
});

module.exports = mongoose.model("post",postSchema);