require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended:true }));


const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ["password"] });

const User =  mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save()
    .then(function(){
        console.log("Successful register")
        res.render("secrets");
    })
    .catch(function(err){
        console.log(err);
    });
})
app.post("/login", function(req,res){
    
    const userName = req.body.username;
    const password =  req.body.password;
    
    User.findOne({email:userName})
    .then(function(foundUser){
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    })
    .catch(function(err){
        console.log(err);
    });
})



app.listen(3000, function(req, res){
})