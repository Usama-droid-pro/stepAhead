

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
 _id : mongoose.Schema.Types.ObjectId,
 comment : String,
 user_id : {
    type:mongoose.Schema.Types.ObjectId,
    ref: "user"
 },
 announcment_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "announcment"
 }
},{
    timestamps:true
});

module.exports = mongoose.model("comments", commentSchema );