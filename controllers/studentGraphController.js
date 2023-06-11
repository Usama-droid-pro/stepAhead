const mongoose = require('mongoose');
const studentGraphModel = require("../models/studentGraphModel")


exports.createGrapph = async(req,res)=>{
    try{
        const a = req.body.a;
        const b = req.body.b;
        const c= req.body.c;
        const student_id = req.body.student_id;

        if(!student_id){
            return(
                res.json({
                    message: "Please Provide student_id",
                    status : false

                })
            )
        }

        const foundResult = await studentGraphModel.findOne({student_id : student_id});
        let result ;
        if(foundResult){
            result = await studentGraphModel.findOneAndUpdate({student_id : student_id} ,
                {
                    a :a,
                    b: b,
                    c : c
                },
                {
                    new: true
                }
        )
        }
        if(!foundResult){
            const newRec  = new studentGraphModel({
                _id : mongoose.Types.ObjectId(),
                student_id : student_id,
                a : a ,
                b : b ,
                c: c
            })
            result = await newRec.save();
        }


        if(result){
            res.json({
                message: "Record Inserted successfully",
                status : true ,
                result : result ,
            })
        }
        else {
            res.json({
                message: "Could not insert record",
                status : false
            })
        }

    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status : false,
            error : err.message
        })
    }
}

exports.getStudentGraph = async(req,res)=>{
    try{

        const student_id = req.query.student_id;

        if(!student_id){
            return(
                res.json({
                    message: "Please Provide student_id",
                    status : false

                })
            )
        }

        const foundResult = await studentGraphModel.findOne({student_id : student_id});


        if(foundResult){
            res.json({
                message: "Record Inserted successfully",
                status : true ,
                result : foundResult ,
            })
        }
        else {
            res.json({
                message: "Could not insert record",
                status : false
            })
        }

    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status : false,
            error : err.message
        })
    }
}


exports.deleteStudentGraph = async(req,res)=>{
    try{

        const student_id = req.query.student_id;

        if(!student_id){
            return(
                res.json({
                    message: "Please Provide student_id",
                    status : false

                })
            )
        }

        const foundResult = await studentGraphModel.deleteOne({student_id : student_id});
        console.log(foundResult)

        if(foundResult.deletedCount>0){
            res.json({
                message: "Record Deleted successfully",
                status : true ,
                result : foundResult ,
            })
        }
        else {
            res.json({
                message: "Could not Delete record",
                status : false
            })
        }

    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status : false,
            error : err.message
        })
    }
}