const mongoose = require("mongoose");

const matchSchema = mongoose.Schema({
    male_id:{
        type:String,
        required:true
    },
    female_id:{
        type:String,
        required:true
    },
    match_number:{
        type:Number,
        required:true
    },
    event_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        req:"Event"
    },
    score: {
        type: Number,
        required: true,
    },
}, {timestamps:true});

const Match = mongoose.model("Match", matchSchema);
module.exports = Match;