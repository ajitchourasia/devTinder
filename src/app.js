const express = require('express');
const { connectDB } = require("./config/database")
const User = require("./models/user")
const app = express();
const {validateSignupData} = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")

app.use(express.json()); // Express middleware. Without this we can't get data in "req.body"
app.use(cookieParser()); // Express middleware to get cookies from cookie-parser

app.get("/searchUserByEmail", async(req, res)=>{
    const userEmail = req.body.emailId
    try{
        const userData = await User.find({emailId: userEmail})
        if(userData.length===0){
            res.send("User not found");
        } else {
            res.send(userData);
        }
    } catch(err) {
        res.status(400).send(err.message)
    }
})

app.get("/feed", async(req, res)=>{
    try{
        const cookies = req.cookies; // GET COOKIES
        const {token} = cookies; // EXTRACT TOKEN
        
        if(!token) {
            throw new Error(JSON.stringify({
                data: [],
                error: {
                    errorCode: "Login-03",
                    errorMessage: "Session expired. Please login again."
                }
            }));
        }

        const isValidToken = await jwt.verify(token, "Dev@secret#Key"); // VERIFY JWT TOKEN
        
        const {_id} = isValidToken; // GET ID FROM JWT TOKEN
        const user = await User.findOne({_id}) // FIND USER EXIST IN DB OR NOT

        if(!user) {
            throw new Error(JSON.stringify({
                data: [],
                error: {
                    errorCode: "Login-01",
                    errorMessage: "Session expired. Please login again."
                }
            }));
        }

        const userData = await User.find({}) // GET USER LIST FROM DB

        res.send(userData);

    } catch(err) {
        res.status(400).send(err.message)
    }
})

app.post("/login", async(req, res)=>{
    try{
        const {emailId, password} = req.body;

        const userData = await User.findOne({emailId : emailId}) // FIND USER EXIST IN DB OR NOT

        if(!userData){
            res.status(400).send({
                data: [],
                error: {
                    errorCode: "Login-01",
                    errorMessage: "Invalid Credential" 
                }
            });
        } else {
            const passwordMatch = await bcrypt.compare(password, userData.password) // COMPARE PASSWORD FROM REQUEST PASSWORD AND DB PASSWORD

            if(passwordMatch) {
                const token = await jwt.sign({_id: userData._id}, "Dev@secret#Key"); // CREATE JWT TOKEN

                res.cookie("token", token) // SET COOKIE

                res.status(200).send({
                    data: "User logged in successfully.",
                    error: {}
                });
                
            } else {                
                res.status(400).send({
                    data: [],
                    error: {
                        errorCode: "Login-02",
                        errorMessage: "Invalid Credential"
                    }
                });
            }
        }
    } catch(err) {
        res.status(400).send(err.message)
    }
})
app.post("/signup", async(req, res) => {

    try {
        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10)

        // New "instance" of "User" mode
        const user = new User({firstName, lastName, emailId, password: passwordHash});
        
        // VALIDATE REQUEST BODY
        await validateSignupData(req);
        
        await user.save();

        res.send({
            data: "User added successfully.",
            error: []
        });
    } catch(err) {
        res.status(400).send(
            {
                data:[],
                error: {
                    errorCode : '',
                    errorMessage: err.message
                }
            }
        )
    }
})

app.delete("/deleteUser", async(req, res) => {
    try {
        //DELETED BY USER ID
        // const userId = req.body.userId
        // await User.findByIdAndDelete(userId)

        //findByIdAndDelete must use userid for delete if you want to delete by emailId use findOneAndDelete({emailId : emailId})

        // DELETED BY EMAIL ID
        const emailId = req.body.emailId

        await User.findOneAndDelete({emailId : emailId})   // findOneAndDelete
        res.send("User deleted successfully");
    } catch(err) {
        res.status(400).send(err.message)
    }
})

app.patch('/updateUser', async(req, res)=>{
    try{
        const emailId = req.body.emailId
        const data = req.body
        await User.findOneAndUpdate({emailId : emailId}, data)
        res.send("User updated successfully");
    } catch(err) {
        res.status(400).send(err.message)
    }
})
connectDB()
.then(()=>{
    console.log("DB connection established...")
    app.listen(3000, ()=>{
        console.log("Server is listening successfully...")
    });
})
.catch(err=>{
    console.error("DB connection error");
})

// app.get
// app.post
// app.delete ...
