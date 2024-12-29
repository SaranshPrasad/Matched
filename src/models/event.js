const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    owner_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    event_name:{
        type:String,
        required:true
    },
    event_date:{
        type:Date,
        default: Date.now
    }
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;