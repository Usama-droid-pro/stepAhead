const express = require('express');
const router = express.Router();
const controller = require("../controllers/commentsController")


router.post('/addComment' , controller.addComment);
router.get('/getAnnouncmentComments' , controller.getAnnouncmentComments);
router.delete('/deleteComment' , controller.deleteComment);




module.exports = router