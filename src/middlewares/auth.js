const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async(req, res, next) => {
    try {
        const {token} = req.cookies;
        console.log('token',token)
        if(!token) {
            return res.status(400).send({
                data: [],
                error: {
                    errorCode: "Login-03",
                    errorMessage: "Session expired. Please login again."
                }
            });
        }
        const isValidToken = jwt.verify(token, "Dev@secret#Key");
        const {_id} = isValidToken;
        const user = await User.findOne({_id});
        if(!user) {
            return res.status(400).send({
                data: [],
                error: {
                    errorCode: "Login-01",
                    errorMessage: "Session expired. Please login again."                    
                }
            });
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send(err.message)
    }
}

module.exports = {
    userAuth
}