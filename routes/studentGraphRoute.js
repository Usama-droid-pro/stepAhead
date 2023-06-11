const express = require('express');
const router = express.Router();
const controller = require("../controllers/studentGraphController")


router.post('/createStudentGraph' , controller.createGrapph);
router.get('/getStudentGraph' , controller.getStudentGraph);
router.delete('/deleteGraph' , controller.deleteStudentGraph);




module.exports = router