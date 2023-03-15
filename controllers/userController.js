const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel")

const fs = require("fs");


exports.register= async (req,res)=>{

    try{
         const user_type = req.body.user_type;
        const father_name = req.body.father_name;


        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        //Check if the user is already in the db
        const emailExists = await userModel.findOne({ email: req.body.email });

        if (emailExists) return res.status(400).json({
            message: "Email already exists",
            status:'failed'
        })
  
        //hash passwords
            var salt = await bcrypt.genSalt(10);
            var hashPassword = await bcrypt.hash(req.body.password, salt);
        
        
        var image;
        var cv ;

        
        console.log(req.files)

        if(req.files){
            if(req.files.image[0]){
                image= req.files.image[0].path
            }
           
        }

        if(req.files){
            if(req.files.cv[0]){
                cv= req.files.cv[0].path;
            }
        }

        if(!user_type){
            return(
                res.json({
                    message: "please provde user_type",
                    status : false
                })
            )
        }

        if(user_type == 'student'){
            if(!father_name){
                return(
                    res.json({
                        message: "please provde father_name as user_type is student",
                        status : false
                    })
                )
            }
        }

        if(user_type!=='student'){
            if(father_name){
                return(
                    res.json({
                        message: "please dont provide father name , if user is not of type student",
                        status : false
                    })
                )
            }
        }

        const userRegister = new userModel({
        _id:mongoose.Types.ObjectId(),
        email:req.body.email,
        password:hashPassword,
        user_name:req.body.user_name,
        fcmToken:req.body.fcmToken,
        image:image,
        father_name:father_name,
        contact_no : req.body.contact_no,
        address : req.body.address,
        cv:cv,
        user_type : user_type
        
        

        })

        const registeredUser = await userRegister.save();
       
        if(registeredUser){
            const token = jwt.sign({ _id: registeredUser._id }, process.env.TOKEN)
            res.json({
                message: "User has been Registered" ,
                result:registeredUser,
                statusCode:201,
                token:token
            })
        }
        else{
            res.json({
                message:"User could not be registered",
                result: result,
                statusCode:400
            })
        }

    }
    catch(e){
        res.json({
            message : "Error occurred while registering User",
            error: e.message,
            statusCode:404

        })
    }
}


exports.login = async (req,res)=>{
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
  
    const user = await userModel.findOne({ email: req.body.email });
  
    if (!user) return res.status(400).json({
        message: "Email or Password is incorrect",
        status:"failed"
    });
  
    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) return res.status(400).json({
        message: "Email or Password is incorrect",
        status:"failed"
    });;

    const token = jwt.sign({ _id: user._id}, process.env.TOKEN);

    res.json({
        message: "Logged in successfully", 
        result:user,
        token: token,
        status:"success",
        
    })


}




exports.getAllUsers = async (req,res)=>{

    try{
        const users = await userModel.find({});
        if(users){
            res.json({
                message: "All users fetched successfully",
                result: users,
                status:"success",
                statusCode:200
            })
        }
        else{
            res.json({
                message: "users could not be fetched",
                result:result,
                statusCode:404
            })
        }
    }
    catch(error){
        res.json({
            message: "error occurred while fetching users" ,
            error:error.message
        })
    }
}

exports.getSpecificUser = async(req, res)=>{
    try{
        const result = await userModel.findOne({_id:req.params.user_id})
        if(result){
            res.json({
                message: "User has been fetched",
                result: result,
                statusCode:200
            })
        }
        else{
            res.json({
                message:"User could not be fetched",
            })
        }
    }
    catch(err){
        res.json({
            message: "error occurred while getting user",
            error:err.message,
            statusCode:500
        })
    }
}

exports.deleteUser = async(req, res)=>{
    try{
        const user_id = req.params.user_id;

        const foundImage = await userModel.findOne({_id:user_id});
        if(foundImage.image){
            fs.unlinkSync(foundImage.image, (err)=>{
                if(!err){
                    console.log("Deleted")
                }
            })
        }

        const result = await userModel.deleteOne({_id: user_id})
        if(result.deletedCount>0){
            res.json({
                message: "user deleted successfully",
                result:result
            })
        }
        else{
            res.json({
                message: "could not delete user , user with this id may not exist",
                result:result
            })
        }
        
     }
     catch(err){
        res.json({
            message: "Error occurred while deleting user",
            error:err.message,
            statusCode:500
        })
     }
}


exports.updateUser = async (req,res)=>{
    try{
        const user_id = req.body.user_id
        const email = req.body.email
        const user_name = req.body.user_name;
        const fcmToken = req.body.fcmToken;
        const contact_no = req.body.contact_no;
        const address = req.body.address ;
        const father_name =req.body.father_name;
        
        const foundResult = await userModel.findOne({_id : user_id});

        if(foundResult){
            if(foundResult.user_type){
                if(foundResult.user_type=='teacher'){
                    if(father_name){
                        return(
                            res.json({
                                message: "please dont provide father name , if user is not of type student",
                                status : false
                            })
                        )
                    }
                }
            }
        }


    
        userModel.findOneAndUpdate({_id:user_id},
            {
                email:email,
                user_name:user_name,
                fcmToken:fcmToken,
                contact_no :contact_no,
                address : address ,
                father_name : father_name
                },
            {
                new:true
            }
            ,function(err, result){
                if(result){
                    res.json({
                        message: "updated successfully",
                        result: result,
                        statusCode:200
                    })
                }
                else{
                    res.json({
                        message: "failed to update successfully",
                        result: result
                    })
                }
            }
            
            )
    }
    catch(err){
        res.json({
            message:"error occurred while updating successfully",
            Error:err.message
        })
    }
}



exports.updatePassword =async (req,res)=>{
    try{
        const email = req.body.email;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);


        const result = await userModel.findOneAndUpdate({email: email} ,
            {
                password:hashPassword
            },
            {
                new:true
            }) 

            if(result){
                res.json({
                    message: "Password has been updated",
                    result:result
            })
            }
            else{
                res.json({
                    message: "Password could not be updated successfully",
                    result:null
                })
            }
    }
    catch(err){
        res.json({
            message: "Error occurred while updating passwords",
            error:err.message
        })
    }
}


exports.updateImage = async (req,res)=>{
    try{
        const user_id = req.body.user_id;
        if(!req.file){
            return (
                res.json({
                    message: "Please provide image for image update",
                    status:false
                })
            )
        }

        const foundImage = await userModel.findOne({_id:user_id});
        if(foundImage.image){
            fs.unlinkSync(foundImage.image, (err)=>{
                if(!err){
                    console.log("Deleted")
                }
            })
        }

        const result = await userModel.findOneAndUpdate({_id:user_id} , {image:req.file.path} , {new:true});
        if(result){
            res.json({
                message: "Image Updated successfully",
                result:result
        })
        }
        else{
            res.json({
                message: "could not update image",
                result:null
            })
        }
        
    }
    catch(err){
        res.json({
            message: "Error occurred",
            error:err.message
        })
    }
}

exports.updateCv = async (req,res)=>{
    try{
        const user_id = req.body.user_id;
        if(!req.file){
            return (
                res.json({
                    message: "Please provide cv file for cv update",
                    status:false
                })
            )
        }

        const foundResult = await userModel.findOne({_id : user_id});

        if(foundResult){
            if(foundResult.user_type){
                if(foundResult.user_type=='student'){
                   
                        return(
                            res.json({
                                message: "This id is of student , cv can only update for teacher",
                                status : false
                            })
                        )
                    
                }
            }
        }

        const foundcv = await userModel.findOne({_id:user_id});
        if(foundcv.cv){
            fs.unlinkSync(foundcv.cv, (err)=>{
                if(!err){
                    console.log("Deleted")
                }
            })
        }

        const result = await userModel.findOneAndUpdate({_id:user_id} , {cv:req.file.path} , {new:true});
        if(result){
            res.json({
                message: "cv file Updated successfully",
                result:result
        })
        }
        else{
            res.json({
                message: "could not update cv file",
                result:null
            })
        }
        
    }
    catch(err){
        res.json({
            message: "Error occurred",
            error:err.message
        })
    }
}


const registerSchema = Joi.object({
  user_name: Joi.string(),
  email: Joi.string().min(6).email(),
  password: Joi.string().min(6),
  fcmToken: Joi.string(),
  user_type: Joi.string(),
  contact_no : Joi.string(),
  address : Joi.string(),
  father_name : Joi.string()
});

const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});