const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


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

userSchema.methods.jwtAuth = async function() {
    const token = await jwt.sign({_id: this._id}, "Dev@secret#Key", {expiresIn: "7d"}) // CREATE JWT TOKEN AND WILL EXPIRE IN 7 DAYS
    return token;
}

userSchema.methods.validatePassword = async function(password) {
    const isValidPassword = await bcrypt.compare(password, this.password); // COMPARE PASSWORD FROM REQUEST PASSWORD AND DB PASSWORD
    return isValidPassword;
}

module.exports = mongoose.model("User", userSchema);