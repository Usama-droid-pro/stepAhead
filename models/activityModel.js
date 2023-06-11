const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
  student_id:String,
  emoji : String,
  date : String,
    lunch : {
        type: Boolean , 
        default : false
    },
    toileting : {
        type: Boolean , 
        default : false
    },
    kitchening : {
        type: Boolean , 
        default : false
    },
    sports : {
        type: Boolean , 
        default : false
    }
} 
);
module.exports = mongoose.model("activity", activitySchema);