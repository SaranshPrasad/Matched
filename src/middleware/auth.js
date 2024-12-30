const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config();

const userAuth = async (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Authentication required"});
    }
        const token = authHeader.split(" ")[1];
        const decodedMessage = await jwt.verify(token, process.env.SECRET_KEY);
        const {_id} = decodedMessage;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found login again !");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({message:"Something went wrong :- "+error.message});
    }
}

module.exports = {userAuth};
