const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const validator = require("validator");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        minLength:4,
        maxLength:25,
        trim:true,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        lowercase:true,
        trim:true,
        unique:true,
        minLength:4,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid : "+value);
                
            }
        }
    },

}, {timestamps:true});

// function to get the jwt token 
userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({_id:user._id}, process.env.SECRET_KEY , {expiresIn:"1d"});
    return token;
}

// helping function for validating the password 
userSchema.methods.validatePassword = async function(password) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;