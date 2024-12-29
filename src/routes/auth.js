const express = require("express");
const authRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/user");
const {validateSignUpData , validateLoginData } = require("../utils/validator");

authRouter.use(express.json());
authRouter.use(cookieParser());

authRouter.post("/auth/signup", async (req, res) => {
    const {email, password, username } = req.body;
    try {
        validateSignUpData(req);
        const existingUser = await User.find({username:username});
        if(existingUser.length === 0){
            const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
             username, password:hashedPassword, email
        });
        const data = await newUser.save();
        res.status(200).json({message:"User saved successfully", data});
        }else{
            throw new Error("Username already exists !");
        }
        
    } catch (error) {
        res.status(400).send("Something went wrong : "+error.message);
    }
});

authRouter.post("/auth/login", async (req, res) => {
    const {email , password } = req.body;
    try {
        validateLoginData(req);
        if(!email){
            throw new Error("Invalid email and password !"); 
        }
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(401).json({message:"Invalid credentials !"});    
        }
        const isValidPassword = user.validatePassword(password);
        if(isValidPassword){
            const token =  await user.getJWT();
            res.cookie('token', token);
            res.status(200).json({message:"User logged In successfully !!" , user, token:token});
        }
    } catch (error) {
        return res.status(400).json({message:"Something went wrong "+error.message})
    }
});

authRouter.post("/auth/logout", userAuth , async (req, res) => {
    const {username}  = req.user;
      res.cookie("token", null, {
        expires: new Date(Date.now()),
      });
      res.status(200).json({message:`${username} Logout Successfully !`})
});



module.exports = authRouter;