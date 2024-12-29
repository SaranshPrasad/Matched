const mongoose = require("mongoose");
const validate = require("validator");

const attendeeSchema = new mongoose.Schema({
    temp_id:{
        type:Number
    },
    event_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },
    answers:{
        type:[String],
        required:true
    },
    gender:{
        type:String,
        validate(value){
            if(!(value === "Male" || value === "Female")){
                throw new Error("Gender is not valid!");
            }
        }
    }
}, {timestamps:true});
const Attendee = mongoose.model("Attendee", attendeeSchema);
module.exports = Attendee;