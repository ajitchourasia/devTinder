const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://mynodedev:vOfLDMygZ4a5XsKo@nodetraining.evvzc.mongodb.net/devTinder")
}

module.exports = {
    connectDB
}