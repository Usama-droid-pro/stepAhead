const  mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema({
  user_name:{
    type:String ,
  } ,
  father_name : String,  //for student
  email : String,
  password: String,
  contact_no : String,
  address : String,
  image : String,
  cv : String,
  added_by: {
    type : String,
    enum : ["admin"]
  },
  added_by_id: {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  user_type : {
    type: String,
    enum : ['student' , 'parent' , 'teacher' , 'admin']
  },
  qualification : String,
  experience : String , 
  reference: String,
 fcm_token : String,

});



module.exports = mongoose.model("user",user );