const mongoose = require("mongoose");

const studentGraph = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
  student_id:mongoose.Schema.Types.ObjectId,
    a : {
        type: Array , 
    },
    b : {
        type: Array , 
    },
    c : {
        type: Array , 
    },
   
} 
);
module.exports = mongoose.model("studentGraph", studentGraph);