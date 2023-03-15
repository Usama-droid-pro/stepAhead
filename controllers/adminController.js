const adminModel= require("../models/adminModel");
const bcrypt = require("bcryptjs");
const fs= require('fs')


exports.getAllAdmins= (req,res)=>{
    adminModel.find({},function(err, foundResult){
        try{
            res.json(foundResult)
        }catch(err){
            res.json(err)
        }
    })
}

exports.getSpecificAdmin= async (req,res)=>{
    try{
        const adminId = req.params.adminId;
         if (!adminId){
            return (
                res.json({
                    message: "Please Provide Admin Id ",
                    status:false
                })
            )
         }

         const result = await adminModel.findOne({_id:adminId});
         if(result){
            res.json({
                message: "Admin fetched",
                status:true,
                result:result
            })
         }
         else{
            res.json({
                message: "Couldn't find ",
                status:false,
            })
         }
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status:false,
            error:err.message
        })
    }
    
    
}
exports.deleteAdmin= async (req,res)=>{
    const adminId = req.params.adminId;

    if(!adminId){
        return (
            res.json({
                message: "Please Provide adminId",
                status:false,
            })
        )
    }
    const result = await adminModel.deleteOne({_id:adminId});
    if(result.deletedCount>0){
        res.json({
            message: "Admin Deleted Successfully",
            status:true,
            result:result
        })
    }
    else{
        res.json({message: "Admin could not be deleted" , status:false})
    }
}

exports.updatePassword=async (req,res)=>{

    const email=req.body.email;
    const newPassword=req.body.newPassword;
    


    if(email && newPassword !==null && typeof email && typeof newPassword!=="undefined"){
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        adminModel.findOneAndUpdate({
            email:email,
            },
            {
              password:hashPassword
            }, 
            function(err, result) 
            { 
               
                if(result){
                    console.log("password updated successfully") 
                    res.json({
                        message: "password updated successfully",
                        success: true,
                        result:result
                        
                    })
                } else{
                    res.json({
                        message: "could'nt update admin password",
                        success: false,
                        error:err,
                        data:result
                    })
                }
        });
    }
    else{
        res.json({
            message:"email , newPassword  may be null or undefined",
        })
    }

     
}

exports.updateAdmin = async (req,res)=>{
    try{
        const email = req.body.email;
        const user_name = req.body.user_name;
        const admin_id= req.body.admin_id;


        if(!admin_id){
            return(
                res.json({
                    message: "provide admin id",
                    status:false
                })
            )
        }

        const result = await adminModel.findOneAndUpdate({_id:admin_id} , {email:email, user_name:user_name} , {new:true});

        if(result){
            res.json({
                message: "Admin updated",
                result:result,
                status:true
            })
        }
        else{
            res.json({
                message: "Could not update",
                status:false,
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred ",
            status:false,
            error:err.message
        })
    }
}

exports.updateAdminImage = async (req,res)=>{
    try{
        const admin_id = req.body.admin_id;
        if(!req.file){
            return (
                res.json({
                    message: "Please provide image for image update",
                    status:false
                })
            )
        }

        const foundImage = await adminModel.findOne({_id:admin_id});
        if(foundImage.image){
            if(fs.existsSync(foundImage.image)){
                fs.unlinkSync(foundImage.image, (err)=>{
                    if(!err){
                        console.log("Deleted")
                    }else{
                        return false;
                    }
                })
            } 
            else{
                console.log('resourece not found')
            }
          
        }

        const result = await adminModel.findOneAndUpdate({_id:admin_id} , {image:req.file.path} , {new:true});
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
// exports.updateProfile= (req,res)=>{
//     const userId = req.body.userId;
//     const name = req.body.name;
//     const age = req.body.age;
//     const email=req.body.email;

//     if(userId !== null && typeof userId !== "undefined"){
//         if(req.file){
//             doctorModel.findOneAndUpdate({_id:userId} ,
//             {
//                 name:name,
//                 age:age,
//                 profileImage:{
//                     data:req.file.path,
//                     contentType:"image/jpeg",
//                 },
//                 email:email
//             },
//             {
//                 new:true
//             },function(err,foundResult){
//                 res.json({
//                     message:"updated",
//                     updatedData:foundResult
//                 })
//             })
//         }
//         else{
//             doctorModel.findOneAndUpdate({_Id:userId} ,
//                 {
//                     name:name,
//                     age:age,
//                     email:email,
//                 },
//                 {
//                     new:true
//                 },function(err,foundResult){
//                     res.json({
//                         message:"updated",
//                         updatedData:foundResult
//                     })
//                 })
            
//         }

//     }else{
//         res.json({
//             message:"userId is null or undefined"
//         })
//     }

// }
