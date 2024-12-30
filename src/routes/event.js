const express = require("express");
const Event = require("../models/event");
const eventRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const cookieParser = require("cookie-parser");
eventRouter.use(cookieParser());
eventRouter.use(express.json());

eventRouter.post("/event/create", async (req, res)=> {
    const {event_name} = req.body;
    const {_id} = req.user;
    try {
        const newEvent = new Event({
            owner_id:_id,event_name
        });
        const data = await newEvent.save();
        res.status(200).json({message:"Event Created Successfully !",data});
    } catch (error) {
        res.status(400).json({message:"Failed creating event ! "+ error.message});
    }
});

eventRouter.get("/all/event",  async (req, res) => {
    const {_id} = req.user;
    try {
        const eventData = await Event.find({owner_id:_id}).populate("owner_id", "username");
        if(eventData.length === 0){
            res.status(404).json({message:"No event data to show !"});
        }else{
            res.status(200).json({message:"Events fetched ! ", eventData});
        }
        
    } catch (error) {
        res.send(error.message);
    }
});

eventRouter.get("/event/:event_id", async (req, res) => {
    const {event_id} = req.params;
    const loggedUser = req.user._id;
    try {
        const event_data = await Event.findById(event_id).populate("owner_id", "username");
        const {_id} = event_data.owner_id;
        if(_id.toString() === loggedUser.toString()){
            res.status(200).json({message:"Event fetched !", event_data});
        }
        else{
            throw new Error("Unauthorized user !");
            
        }
    } catch (error) {
        res.status(400).json({message:"Something went wrong : "+error.message});
    }
});

eventRouter.delete("/event/:event_id",async (req, res) => {
    const loggedInUserId = req.user._id;
    const {event_id} = req.params;
    try {
        const event = await Event.findById(event_id);
        if(!event){
            throw new Error("Invalid event id !");
        }
        const {_id} = event.owner_id;
        if(_id.toString() === loggedInUserId.toString()){
            const data = await Event.findByIdAndDelete(event_id);
            res.status(200).json({message:"Event deleted ! ", data});
        }else{
            throw new Error("Unauthorized owner !");
        }
    } catch (error) {
        res.status(400).json({message:"Something went wrong : "+error.message});
    }
});



module.exports = eventRouter;
