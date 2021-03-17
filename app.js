//jshint esversion:6
require("dotenv").config(); // enviroment variable
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose Connections
//https://mongoosejs.com/docs/connections.html#
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});


// Mongoose encryption needs SCHEMA, plugin() then model
// https://www.npmjs.com/package/mongoose-encryption
const userSchema = new mongoose.Schema( {
  email: String,
  password: String
});
// const secret = "ThisIsOurLittleSecret.";
userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"] } );
const User = mongoose.model("User", userSchema);



app.get("/", function(req, res){
  res.render("home");
  //res.send("Hello to the browser user");
  //console.log("Hello to comand line");
});
app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  // create brand new user
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets"); // to user in the browser
    };
  });
});


app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username}, function(err, foundUser){

    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password === password)
        res.render("secrets");
      };
    };

  });

});





























app.listen(3000, function() {
  console.log("Server started on port 3000");
});
