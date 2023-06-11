const mongoose = require('mongoose');
const activityModel = require("../models/activityModel");


exports.createActivity = async (req, res) => {
    try {
        const student_id = req.body.student_id;
        const date = req.body.date;

        if (!student_id || !date) {
            return (
                res.json({
                    message: "student id  and date must be passed for successfull insertion ",
                    status: false
                })
            )
        }

        const emoji = req.body.emoji;
        const lunch = req.body.lunch;
        const toileting = req.body.toileting;
        const kitchening = req.body.kitchening;
        const sports = req.body.sports;

        const foundResult = await activityModel.findOne({ student_id: student_id, date: date });
        let result;

        if (!foundResult) {
            const record = new activityModel({
                _id: mongoose.Types.ObjectId(),
                student_id: student_id,
                date: date,
                emoji: emoji,
                lunch: lunch,
                toileting: toileting,
                kitchening: kitchening,
                sports: sports,
            });
            result = await record.save();
        }

        if (foundResult) {
             result = await activityModel.findOneAndUpdate({ student_id: student_id, date: date },
                {   
                    student_id: student_id,
                    date: date,
                    emoji: emoji,
                    lunch: lunch,
                    toileting: toileting,
                    kitchening: kitchening,
                    sports: sports

                })
        }

        if (result) {
            res.json({
                message: "Activity for student created",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "Could not add record",
                status: false
            })
        }

    }
    catch(err){
        res.json({
            message : "Error Occurred while creating",
            status : false,
            error: err.message
        })
    }
}

exports.getStudentActivity = async(req,res)=>{
    try{
        const student_id = req.query.student_id ;
        const date = req.query.date;

        if (!student_id || !date) {
            return (
                res.json({
                    message: "student id  and date must be passed for successfull insertion ",
                    status: false
                })
            )
        }

        const result = await activityModel.findOne({student_id : student_id , date :date});

        if (result) {
            res.json({
                message: "Activity for student Fetched",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "Could not Fetched record",
                status: false
            })
        }

    }
    catch(err){
        res.json({
            message : "Error Occurred while Fetching",
            status : false,
            error: err.message
        })
    }
}