const express = require("express");
const Attendee = require("../models/attendee");
const Match = require("../models/match");
const {userAuth} = require("../middleware/auth");
const matchRouter = express.Router();
const Event = require("../models/event");
matchRouter.get("/match/:event_id",userAuth, async (req, res) => {
    const { event_id } = req.params;
    const loggedInUserId = req.user._id;
    try {
        const eventData = await Event.findById(event_id);
        if(!eventData){
            throw new Error("Event not found !");
        }
        if(!(loggedInUserId.toString() === eventData.owner_id.toString())){
            throw new Error("Unauthorized access !");
        }
        const males = await Attendee.find({ event_id, gender: "Male" }); 
        const females = await Attendee.find({ event_id, gender: "Female" });

        if (!males.length || !females.length) {
            return res.status(400).json({ message: "Not enough attendees for matching." });
        }

        const matches = [];
        const matchedMales = new Set(); 
        const matchedFemales = new Set(); 
        males.forEach((male) => {
            let bestMatch = null;
            let highestScore = 0;

            females.forEach((female) => {
                if (!matchedFemales.has(female._id)) {
                    // Calculate similarity score
                    const score = calculateSimilarity(male.answers, female.answers);

                    // Update the best match
                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = female;
                    }
                }
            });

            if (bestMatch) {
                matches.push({
                    male_id: male.temp_id,
                    female_id: bestMatch.temp_id,
                    match_number: matches.length + 1,
                    event_id,
                    score: highestScore,
                });

                matchedMales.add(male._id);
                matchedFemales.add(bestMatch._id);
            }
        });
        await Match.insertMany(matches,{ ordered: false });

        res.status(200).json({ message: "Matches created successfully!", matches });
    } catch (error) {
        res.status(500).json({ message: "Error creating matches: " + error.message });
    }
});

matchRouter.get("/match/:event_id/:temp_id", async (req, res) => {
    const {event_id, temp_id} = req.params;
    try {
        const eventData = await Event.findById(event_id);
        if(!eventData){
            throw new Error("Event not exists !");
        }
        const response = await Match.find({event_id:event_id, 
            $or: [
                {
                    male_id:temp_id
                },
                {
                    female_id:temp_id
                }
            ]
        });
        const matchNumbers = response.map(match => match.match_number);
        res.status(200).json({message:"Match number fetched !", matchNumbers});
    } catch (error) {
        res.status(400).json({message:"Something went wrong !"+error.message});
    }
});
const calculateSimilarity = (answers1, answers2) => {
    let score = 0;

    for (let i = 0; i < answers1.length; i++) {
        if (answers1[i] === answers2[i]) {
            score += 1;
        }
    }

    return score;
};

module.exports = matchRouter;
