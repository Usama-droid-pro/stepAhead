const router = require("express").Router();
const mongoose=require("mongoose")

const adminModel= require("../models/adminModel");
const bcrypt = require("bcryptjs");

const Joi = require("joi");
const jwt = require("jsonwebtoken");
const controller= require("../controllers/adminController")
const upload = require('../middlewares/adminImageMulter')


router.get("/allAdmins" ,controller.getAllAdmins)
router.get("/specificAdmin/:adminId" , controller.getSpecificAdmin)
router.delete("/deleteAdmin/:adminId" , controller.deleteAdmin);
router.put("/updateAdminPassword", controller.updatePassword)
router.put('/updateAdminImage',upload.single("image"),controller.updateAdminImage);
router.put('/updateAdmin',controller.updateAdmin);




router.post("/register", upload.single('image'), async (req, res) => {
  let image;
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //Check if the user is already in the db
    const emailExists = await adminModel.findOne({ email: req.body.email });
  
    if (emailExists) return res.status(400).json({
      message: "Email already exists",
      status:"false"
    });
  
    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
  

    if(req.file){
      image=req.file.path
    }

  
    //create new user
    const admin = new adminModel({
      _id:mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hashPassword,
      image:image,
      user_name:req.body.user_name
    });
  
    try {
      const savedAdmin= await admin.save();
      
      res.json({
        _id:savedAdmin._id,
        email:savedAdmin.email,
        password:savedAdmin.password,
        image:savedAdmin.image,
        user_name:savedAdmin.user_name
      })
    } catch (err) {
      res.status(400).send(err);
    }
  });

router.post("/login",async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
  
    const admin = await adminModel.findOne({ email: req.body.email });
   
  
    if (!admin) return res.status(400).json({
      message: "Email Or Password is Wrong",
      status:"false"
    });
  
    const validPass = await bcrypt.compare(req.body.password, admin.password);
    if (!validPass) return res.status(400).json({
      message: "Email Or Password is Wrong",
      status:"false"
    });
  ;
  
    //Create and assign a token
    const token = jwt.sign({ _id: admin._id }, process.env.TOKEN);
    res.json({
      message:"Logged in successfully",
      token: token,
      _id:admin._id,
      email:admin.email,
      password:admin.password,

    })
  });



const registerSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    user_name:Joi.string()
  });
  
  const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });


  router.get("/logout",(req,res)=>
  {
    res.cookie('jwt' ,'',{maxAge:1} )
    res.json("Cookie deleted, logout successfully")
    
    
  })

module.exports = router;
