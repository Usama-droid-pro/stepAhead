const express = require('express');
const router = express.Router();
const controller = require("../controllers/userController")
const upload = require("../middlewares/userImageMulter")
const uploadImage = require("../middlewares/imageUpload")


router.post("/register" , upload.fields(
    [
        {
            name : "image",
            maxCount : 1
        }, 
        {
            name: "cv" , 
            maxCount : 1

        }
    ]
)
, controller.register)
router.post("/login" , controller.login)
router.get("/getAllUsers" , controller.getAllUsers)
router.get("/getSpecificUser/:user_id" , controller.getSpecificUser)
router.delete("/deleteUser/:user_id" , controller.deleteUser)
router.put("/updateUser" , controller.updateUser)
router.put("/updatePassword" , controller.updatePassword)
router.put("/updateImage", upload.single("image") , controller.updateImage)
router.put("/updateCv", upload.single("cv") , controller.updateCv)
router.get("/getAllStudents" , controller.getAllStudents)
router.get("/getAllTeachers" , controller.getAllTeachers)
router.post("/imageUpload" ,uploadImage.single("image"), controller.imageUpload)

router.get("/teachersByAdminId" , controller.teachersByAdminId)
router.get("/studentsByAdminId" , controller.studentsByAdminId)





module.exports = router