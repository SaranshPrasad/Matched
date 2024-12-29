const validator = require("validator");

const validateSignUpData = (req) =>{
    const {username , email , password } = req.body;
    if (!(username || email || password)) {
        throw new Error("Please provide all user data !");
    }else if(!validator.isEmail(email)){
        throw new Error("Please provide a valid email address !");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password !");
    }
}

const validateLoginData = (req) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new Error("Please provide Email and Password !");
    }
}




module.exports = {
    validateSignUpData, validateLoginData
}