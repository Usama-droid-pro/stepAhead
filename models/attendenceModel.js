

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendenceSchema = new Schema({
 _id : mongoose.Schema.Types.ObjectId,
 class_id : {
    type:mongoose.Schema.Types.ObjectId,
    ref: "class"
 },
 attendence:[
    {
        _id:false,
       student_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        isPresent: {
            type:Boolean,
            
        }
    },
    
 ],
 date: {
    type:Date,
 }
},{
    timestamps:true
});

module.exports = mongoose.model("attendence", attendenceSchema );