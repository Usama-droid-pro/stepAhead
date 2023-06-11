const express = require('express');
const router = express.Router();
const controller = require("../controllers/classController")


router.post('/addClass' , controller.addClass);
router.get('/getAllClasses' , controller.getAllClasses);
router.get('/getAllClassesOfTeacher' , controller.getAllClassesOfTeacher);
router.get('/getStudentClasses' , controller.getStudentClasses);
router.put('/updateClass' , controller.updateClass);
router.get('/getClassById' , controller.getClassById);
router.delete('/deleteClass' , controller.deleteClass);




module.exports = router