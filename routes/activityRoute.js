const express = require('express');
const router = express.Router();
const controller = require("../controllers/activityController")


router.post('/createActivity' , controller.createActivity);
router.get('/getStudentActivity' , controller.getStudentActivity);




module.exports = router