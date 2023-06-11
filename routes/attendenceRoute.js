const express = require('express');
const router = express.Router();
const controller = require("../controllers/attendenceController")


router.post('/addAttendence' , controller.createAttendence);
router.get('/getAttendenceOfClasss' , controller.getAttendenceOfClasss);
router.put('/updateAttendence' , controller.updateAttendence);
router.get('/getAttendencePercentage' , controller.getPercentageOfStudent);
// router.put('/updateClass' , controller.updateClass);
// router.get('/getClassById' , controller.getClassById);
// router.delete('/deleteClass' , controller.deleteClass);




module.exports = router