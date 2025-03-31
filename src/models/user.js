const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName : { 
        type: String,
        minLength: 3,
        maxLength: 50
    },
    lastName : { 
        type: String,
        maxLength: 50
    },
    emailId : { 
        type: String,
        required : true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password : { type: String },
    age : { type: Number },
    gender : { type: String },
}, {
    timestamps: true,
})

module.exports = mongoose.model("User", userSchema);