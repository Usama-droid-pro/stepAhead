

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const announcmentSchema = new Schema({
  _id : mongoose.Schema.Types.ObjectId,
  name : String,
  description : String,
  user_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  likes : [
        mongoose.Schema.Types.ObjectId,
  ]
},
{
    timestamps : true
});

module.exports =mongoose.model("announcment", announcmentSchema );