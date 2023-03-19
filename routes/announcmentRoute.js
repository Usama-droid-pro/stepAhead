const express = require('express');
const router = express.Router();
const controller = require("../controllers/announcmentController")


router.post('/addAnnouncment' , controller.addAnnouncment);
router.get('/getLastSevenDaysAnnouncments' , controller.getLastSevenDaysAnnouncments);
router.get('/getAllAnnouncments' , controller.getAllAnnouncments);
router.put('/likeAnnouncments' , controller.likeAnnouncments);
router.put('/disLikeAnnouncment' , controller.disLikeAnnouncment);



module.exports = router