

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
 _id : mongoose.Schema.Types.ObjectId,
 className : String,
 teacher : {
    type:mongoose.Schema.Types.ObjectId,
    ref: "user"
 },
 students : [
    {
        type:mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
 ]
 
},{
    timestamps:true
});

module.exports = mongoose.model("class", classSchema );