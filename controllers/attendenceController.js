const mongoose = require('mongoose');

const attendenceModel = require("../models/attendenceModel");


exports.createAttendence = async (req, res) => {
    try {
        let attendence = req.body.attendence;
        const class_id = req.body.class_id;
        const date = req.body.date;

        const foundResult = await attendenceModel.findOne({ date: date, class_id: class_id })


       

        if (foundResult) {
            return (
                res.json({
                    message: "Attendence with this date already added for this class",
                    status: false,
                })
            )
        }


        const newAttendence = new attendenceModel({
            _id: mongoose.Types.ObjectId(),
            class_id: class_id,
            date: date,
            attendence: attendence
        });

        const result = await newAttendence.save();

        if (result) {
            res.json({
                message: "Attendence added",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "could not add",
                result: false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}

exports.updateAttendence = async (req, res) => {
    try {
        const attendence_id = req.body.attendence_id;
        const attendence = req.body.attendence;


        const result = await attendenceModel.findOneAndUpdate({ _id: attendence_id }
            ,
            {
                attendence: attendence
            },
            {
                new: true
            }
        );

        if (result) {
            res.json({
                message: "Attendence updated",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "Could not update attendence",
                status: false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }

}

exports.getAttendenceOfClasss = async (req, res) => {
    try {
        const date = req.query.date;
        const class_id = req.query.class_id;

        if (!date || !class_id) {
            return (
                res.json({
                    message: "Must add date and class_id",
                    status: false
                })
            )
        }

        const result = await attendenceModel.findOne({ class_id: class_id, date: date }).populate("attendence.student_id");

        if (result) {
            res.json({
                message: "Attendence of this class Fetched for this date",
                status: true,
                result: result
            })
        }
        else {
            res.json({
                message: "Could not fetch attendence",
                status: false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}

exports.getPercentageOfStudent = async (req, res) => {
    try {
        let date = req.query.date;
        const student_id = req.query.student_id;

   

        let startDate = new Date(date);
        startDate.setDate(1);


        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
        


        console.log(startDate)
        console.log(endDate)

        const attendanceRecords = await attendenceModel.find({
            date: { $gte: startDate, $lte: endDate },
            'attendence.student_id': student_id
        });
        console.log(attendanceRecords)

        const totalClasses = attendanceRecords.length;
        let attendedClasses = 0;


        // count the number of classes attended by the student for the given month
        attendanceRecords.forEach(record => {
            record.attendence.forEach(student => {
                if (student.student_id == student_id && student.isPresent == true) {
                    attendedClasses++;
                }
            });
        });

        console.log(attendedClasses)
        // calculate the attendance percentage
        const attendancePercentage = (attendedClasses / totalClasses) * 100;
        console.log(attendancePercentage)
        console.log(totalClasses)

        if(attendancePercentage){
            res.json({
                message: "Percentage is",
                percentage : attendancePercentage,
                status:true
            })
        }
        else{
            res.json({
                message: "could not find",
                status:false
            })
        }
    }
    catch (err) {
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}