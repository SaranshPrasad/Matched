const express = require("express");
const Event = require("../models/event");
const attendeeRouter = express.Router();
const Attendee = require("../models/attendee");
const {userAuth} = require("../middleware/auth");
attendeeRouter.use(express.json());

attendeeRouter.post("/attendee/:event_id/register", async (req , res ) => {
    const {event_id} = req.params;
    const {gender, answers} = req.body;
    try {
        const eventData = await Event.findById(event_id);
        if(!eventData){
            throw new Error("Event not found !");
        }
        if (!Array.isArray(answers)) {
            throw new Error("Answers are not valid");
        }
        const attendeeCount = await Attendee.countDocuments({event_id});
        const attendeeNumber = attendeeCount + 1;
        const newAttendee = new Attendee({
            temp_id:attendeeNumber,
            event_id:event_id,
            answers:answers,
            gender:gender
        });
        const saveAttendee = await newAttendee.save();
        res.status(200).json({message:"Attendee Registered!" , saveAttendee});

    } catch (error) {
        res.status(400).json({message:"Something went wrong : "+error.message});
    }
});


attendeeRouter.get("/all/:event_id/attendee",userAuth, async (req , res) => {
    const {event_id} = req.params;
    const loggedInUserId = req.user._id;
    try {

        const eventData = await Event.findById(event_id);
        if(!eventData){
            throw new Error("Event not found !");
        }
        if(!(loggedInUserId.toString() === eventData.owner_id.toString())){
            throw new Error("Unauthorized access !");
        }
        const attendeeData = await Attendee.find({event_id});
        res.status(200).json({message:"Attendee fetched !", attendeeData});
    } catch (error) {
        res.status(400).json({message:"Something went wrong : "+error.message});
    }
});

module.exports = attendeeRouter;