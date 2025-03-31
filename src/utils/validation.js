const validator = require("validator");
const User = require("../models/user");
validateSignupData = async (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    
    if(validator.isEmpty(firstName)) {
        throw new Error("First name cannot be empty");
    } else if(firstName.length < 3) {
        throw new Error("First name must be at least 3 characters");
    } else if(firstName.length > 50) {
        throw new Error("First name must be less than 50 characters");
    } else if(validator.isEmpty(lastName)) {
        throw new Error("Last name cannot be empty");
    } else if(lastName.length < 3) {
        throw new Error("Last name must be at least 3 characters");
    } else if(lastName.length > 50) {
        throw new Error("Last name must be less than 50 characters");        
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Please enter a valid email id");
    } else if(validator.isEmpty(password)) {
        throw new Error("Password cannot be empty");
    }
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
        throw new Error("Email ID already exists. Please use another email.");
    }
}

module.exports = {
    validateSignupData,
}