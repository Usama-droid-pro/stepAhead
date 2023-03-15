const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
  user_name:String,
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

  password: {
    type: String,
    required: true,
    max: 2048,
    min: 6,
  },
  image:String
} 
);
module.exports = mongoose.model("admin", adminSchema);