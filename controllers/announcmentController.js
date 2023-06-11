const mongoose = require('mongoose');

const announcmentModel = require("../models/announcmentsModel");
const userModel = require('../models/userModel')


exports.addAnnouncment = async (req,res)=>{
    try{
        const name  = req.body.name;
        const description = req.body.description;
        const user_id = req.body.user_id;

        const newAnnouncment = new announcmentModel({
            _id :mongoose.Types.ObjectId(),
            name : name ,
            description: description,
            user_id : user_id
        });

        const result = await newAnnouncment.save();

        if(result){
            res.json({
                message : "Announcment added",
                status : true,
                result : result
            })
        }
        else{
            res.json({
                message : "could not add",
                result : false
            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred",
            status : false,
            error: err.message
        })
    }
}

exports.getLastSevenDaysAnnouncments = async(req,res)=>{

    try{
        const current_user_id = req.query.current_user_id;
        let newArray=[];


        if(!current_user_id){
            return(
                res.json({
                    message: "Please Provide current_user_id",
                    status: false,

                })
            )
        }
        
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const found = await announcmentModel.find({
            createdAt :{
                $gte: oneWeekAgo,
                $lte : currentDate
            }
        }).populate('user_id');

        let result =  [...found];
        result = JSON.parse(JSON.stringify(result))



        for (let i =0 ; i<result.length ; i++){
            if(result[i].likes.includes(current_user_id)){
                console.log(true);
                result[i].user_liked= true
            }else{
                result[i].user_liked = false
            }
        }
        console.log(result)
   
       
               
        for (let i = 0; i < result.length; i++) {
            let element = result[i];
            let users=[];

        if(element.likes){
            let newArray = element.likes;
            for (let j = 0; j < newArray.length; j++) {

                let result = await userModel.findOne({_id : newArray[j]});
                users.push(result);
                element.likedBy= users;
            }
        }
        
            
        }
        console.log(result)

        
   
        

        if(result){
            res.json({
                message : "Announcment fetched of last 7 days",
                status : true,
                result : result
            })
        }
        else{
            res.json({
                message : "could not fetch",
                result : false
            })
        }
        
    }
    catch(err){
        res.json({
            message : "Error Occurred",
            status : false,
            error: err.message
        })
    }
}

exports.getAllAnnouncments = async(req,res)=>{

    
    try{

        const current_user_id = req.query.current_user_id;
        let user_liked = false;

        if(!current_user_id){
            return(
                res.json({
                    message: "Please Provide current_user_id",
                    status: false,

                })
            )
        }
        
        let result = await announcmentModel.find({

        }).populate('user_id');
        result = JSON.parse(JSON.stringify(result))


        for (let i =0 ; i<result.length ; i++){
            if(result[i].likes.includes(current_user_id)){
                console.log(true);
                result[i].user_liked= true
            }else{
                result[i].user_liked = false
            }
        }
        console.log(result)
   
       
               
        for (let i = 0; i < result.length; i++) {
            let element = result[i];
            let users=[];

        if(element.likes){
            let newArray = element.likes;
            for (let j = 0; j < newArray.length; j++) {

                let result = await userModel.findOne({_id : newArray[j]});
                users.push(result);
                element.likedBy= users;
            }
        }
        
            
        }
        console.log(result)
        
            
        if(result){
            res.json({
                message : "All announcments",
                status : true,
                result : result
            })
        }
        else{
            res.json({
                message : "could not fetch",
                result : false
            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred",
            status : false,
            error: err.message
        })
    }
}

exports.likeAnnouncments = async(req,res)=>{
    try{

        const user_id = req.body.user_id;
        const announcment_id = req.body.announcment_id;
        let result;


        if(!user_id ||!announcment_id){
            return(
                res.json({
                    message: "Please Provide user_id and announcment_id",
                    status: false,

                })
            )
        }

        const foundAnnouncment = await announcmentModel.findOne({_id : announcment_id , likes : { $in : user_id}})

        if(!foundAnnouncment){
            result = await announcmentModel.findOneAndUpdate({
                _id : announcment_id
            },
            {
                $push: {likes : user_id}
            },{
                new:true
            }
            )
        }
        else{
            result = foundAnnouncment
        }

        if(result){
            res.json({
                message : "Announcment",
                status : true,
                result : result
            })
        }
        else{
            res.json({
                message : "could Like",
                result : false
            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred",
            status : false,
            error: err.message
        })
    }
}


exports.disLikeAnnouncment = async(req,res)=>{
    try{

        const user_id = req.body.user_id;
        const announcment_id = req.body.announcment_id;
        let result;


        if(!user_id ||!announcment_id){
            return(
                res.json({
                    message: "Please Provide user_id and announcment_id",
                    status: false,

                })
            )
        }

        const foundAnnouncment = await announcmentModel.findOne({_id : announcment_id , likes : { $in : user_id}})
        console.log(foundAnnouncment)

        if(foundAnnouncment){
            result = await announcmentModel.findOneAndUpdate({
                _id : announcment_id
            },
            {
                $pull: {likes : user_id}
            },
            {
                new:true
            }
            )
        }
        else{
            result =  await announcmentModel.findOne({_id : announcment_id})
        }

        if(result){
            res.json({
                message : "Announcment",
                status : true,
                result : result
            })
        }
        else{
            res.json({
                message : "could not Like",
                result : false
            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred",
            status : false,
            error: err.message
        })
    }
}

