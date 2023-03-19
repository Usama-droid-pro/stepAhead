const mongoose = require('mongoose');

const commentModel = require("../models/commentsModel");

exports.addComment= async(req,res)=>{
    try{
        const comment = req.body.comment ;
        const user_id = req.body.user_id;
        const announcment_id = req.body.announcment_id;

        if(!user_id || ! comment){
            return(
                res.json({
                    message: "Must provide userid and comment",
                    status : false
                })
            )
        }


        const newComment = new commentModel({
            _id : mongoose.Types.ObjectId(),
            user_id: user_id,
            comment: comment,
            announcment_id : announcment_id
        });


        const result = await newComment.save();


        if(result){
            res.json({
                message: "New Comments has been added",
                status : true,
                result : result 
            })
        }
        else{
            res.json({
                message: "Could not add commment",
                status : false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error occurred",
            status : false,
            error : err.message
        })
    }
}

exports.getAnnouncmentComments= async(req,res)=>{
    try{
        const announcment_id = req.query.announcment_id;

        if(!announcment_id){
            return(
                res.json({
                    message: "Must provide announcment_id a",
                    status : false
                })
            )
        }



        const result = await commentModel.find({announcment_id : announcment_id }).populate("user_id").populate("announcment_id")
        if(result){
            res.json({
                message: "All Comments for this announcment fetched",
                status : true,
                result : result 
            })
        }
        else{
            res.json({
                message: "Could not Fetch announcments",
                status : false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error occurred",
            status : false,
            error : err.message
        })
    }
}

exports.deleteComment = async(req,res)=>{
    try{
        const comment_id = req.query.comment_id;
        const current_user_id = req.query.current_user_id;

    if(!comment_id || !current_user_id){
            return(
                res.json({
                    message: "Must provide comment_id and current_user_id",
                    status : false
                })
            )
        }


        const result = await commentModel.deleteOne({_id : comment_id , user_id : current_user_id});

        if(result.deletedCount>0){
            res.json({
                message: "comment deleted successfully",
                status : false
            })
        }
        else{
            res.json({
                message: "Could not delete comment , make sure this comment belongs to this current user id",
                status : false
            })
        }
        
    }
    catch(err){
        console.log(err)
        res.json({
            message: "Error occurred",
            status : false,
            error : err.message
        })
    }
}