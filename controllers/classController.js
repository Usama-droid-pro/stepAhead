const mongoose = require('mongoose');

const classModel = require("../models/classModel");


exports.addClass = async (req,res)=>{
    try{
        const className  = req.body.className;
        const teacher = req.body.teacher;
        const students = req.body.students;

        if(!className || !teacher){
            return(
                res.json({
                    message : "Must provide className and teacher",
                    status : false,
                })
            )
        }

        const foundClass = await classModel.findOne({className: {$regex: className,$options:"i"}})
        
        if(foundClass){
            return(
                res.json({
                    message : "class with this name already exists",
                    status : false,
                })
            )
        }

        const newClass = new classModel({
            _id :mongoose.Types.ObjectId(),
            className : className ,
            teacher: teacher,
            students : students
        });

        const result = await newClass.save();

        if(result){
            res.json({
                message : "Class Added",
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

exports.getAllClasses = async(req,res)=>{
    try{
        const result = await classModel.find().populate("students").populate("teacher");

        if(result){
            res.json({
                message : "All classes fetched",
                status : true,
                result : result
            })
        }
        else{
            res.json({
                message : "could not fetch classes",
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

exports.getAllClassesOfTeacher = async(req,res)=>{
    try{

        const teacher_id = req.query.teacher_id;

        if(!teacher_id){
            return(
                res.json({
                    message : "Must provide teacher_id",
                    status : false,
                })
            )
        }

        const result = await classModel.find({teacher : teacher_id}).populate("students").populate("teacher");

        if(result){
            res.json({
                message : "All classes fetched with this teacher id",
                status : true,
                result : result
            })
        }
        else{
            res.json({
                message : "could not fetch classes",
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

exports.getStudentClasses = async(req,res)=>{
    try{
        const student_id = req.query.student_id;
        if(!student_id){
            return(
                res.json({
                    message : "Must provide student_id",
                    status : false,
                })
            )
        }
            
            const result =await classModel.find({students : student_id }).populate("students").populate("teacher");

            if(result){
                res.json({
                    message : "All classes in which this student is enrolled",
                    status : true,
                    result : result
                })
            }
            else{
                res.json({
                    message : "could not fetch classes",
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

exports.updateClass = async(req,res)=>{
    try{
        const class_id = req.body.class_id;
        const className = req.body.className;
        const students = req.body.students;
        const teacher = req.body.teacher;


        if(className){
            const foundClass = await classModel.findOne({className: {$regex: className , $options:"i"}})
            if(foundClass){
                if(foundClass._id != class_id){
                    return(
                        res.json({
                            message : "class with this name already exists",
                            status : false,
                        })
                    )
                }
           
        }
        }

        

        if(!class_id){
            return(
                res.json({
                    message : "Must provide class_id",
                    status : false,
                })
            )
        }

        const result = await classModel.findOneAndUpdate({_id : class_id},
            {
                students : students,
                className : className,
                teacher : teacher
            },
            {
                new: true
            });

            if(result){
                res.json({
                    message : "Class Updated",
                    status : true,
                    result : result
                })
            }
            else{
                res.json({
                    message : "Could not update",
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

exports.getClassById = async(req,res)=>{
    try{
        const class_id = req.query.class_id;
        if(!class_id){
            return(
                res.json({
                    message : "Must provide class_id",
                    status : false,
                })
            )
        }


        const result = await classModel.findOne({_id : class_id}).populate("students").populate("teacher");

        if(result){
            res.json({
                message : "Class fetched",
                status : true,
                result : result
            })
        }
        else{
            res.json({
                message : "could not fetch class",
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

exports.deleteClass = async(req,res)=>{
    try{
        const class_id = req.query.class_id;
        if(!class_id){
            return(
                res.json({
                    message : "Must provide class_id",
                    status : false,
                })
            )
        }

        const result = await classModel.deleteOne({_id : class_id});

        if(result.deletedCount>0){
            res.json({
                message : "Delete Class",
                status : true,
                result : result
            })
        }
        else{
            res.json({
                message : "could not Delete class",
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