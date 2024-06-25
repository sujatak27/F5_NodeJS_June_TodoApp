const express = require ('express');
require("dotenv").config();
const clc = require("cli-color");
const bcrypt=require("bcryptjs");
const mongoose = require('mongoose');

//file imports
const {userDataValidation} = require ("./utils/authUtils");
const userModel = require ("./models/userModel");
const isAuth = require("./midd")


//constants
const app = express();
const PORT = process.env.PORT;

//db connection
mongoose.connect(process.env.MONGO_URI) // is a promise
.then(()=>{
    console.log(clc.yellowBright.bold("mongo db connected sucessfully"));
})
.catch((err)=>console.log(clc.redBright(err)));

//middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended : true })); //body parser url encoded
app.use(express.json()); //body parser json

app.get("/", (req,res)=>{
     return res.send("Server is running");
});

app.get("/register", (req,res)=>{
    return res.render("registerPage");
});
app.post("/register", async (req,res)=>{
    //console.log("hi");
    //return res.send("User register successfully");
    console.log(req.body);
    //return res.send("User register successfully");
    const {name, email, username, password} = req.body;   

//data validation
try{
    await userDataValidation ({email, username, name, password});
}
catch (error)
{ return res.status(400).json(error);}


//email and username should be unique
try{
    const userEmailExist = await userModel.findOne({email:email});
    //console.log(userEmailExist);
    if(userEmailExist)
        {return res.status(400).json("Email already exist");}
        
    const userUsernameExist =await userModel.findOne({username:username});
        if(userUsernameExist)
        {return res.status(400).json("Username already exists");}

//encrypt the password
const hashedpassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT));

// store in db

const userObj= new userModel({
    name,email,
    username,
    password :hashedpassword,
});

// const userDb = await userModel.create({name, email, username, password});

const userDb= await userObj.save();
return res.redirect("/login");
} catch(error){
    return res.status(500).json({
        message :"Internal server error",
        error:error,
    });
}

// try{
//     const userDb = await userObj.save();
//     return res.status(201).json({
//         message : "User registered successfully",
//         data: userDb,
//     });
// } catch (error)
// {
//     return res.status(500).json({
//         message :"Internal server error",
//         error: error,
//     });
// }
});

app.get("/login",(req,res)=>{
    return res.render("loginPage");
});

app.post("/login", async (req, res)=>{
    const {loginId, password}=req.body;
    if(!loginId || !password) return res.status(400).json("Missing login credentials");

    if (typeof loginId !=="string") return res.status(400).json("login is not a string");
    if (typeof password !=="string") return res.status(400).json("password is not a string");

    //find user from db
    try {
        let userDb={};
        if (isEmailRe)
    }
});
app.listen(PORT,()=>{
    console.log(clc.yellowBright.bold("Server is running at "));
    console.log(clc.yellowBright.underline(`http://localhost:${PORT}/`));
});
