//jshint esversion:6
require("dotenv").config(); // enviroment variable
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
//const encrypt = require("mongoose-encryption"); // lost to hashing or md5
//const md5 = require("md5")// FOR hashing passwords // lost to bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
// const secret = "ThisIsOurLittleSecret."; // lost to enviroment variables
//userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"] } ); // lost to hashing or md5
const User = mongoose.model("User", userSchema);

//console.log(md5("123456789"));

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

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        // Store hash in your password DB.

        // create brand new user
        const newUser = new User({
          email: req.body.username,
          // password: md5(req.body.password) // md5 turns that text into an irriversible hash // lost to bcrypt
          password: hash
        });
        newUser.save(function(err){
          if(err){
            console.log(err);
          }else{
            res.render("secrets"); // to user in the browser
          };
        });


    });
  });

});






app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  //const password = md5(req.body.password); // we'll hash it again to authenticate // lost to bcrypt

  User.findOne({ email: username}, function(err, foundUser){

    if(err){
      console.log(err);
    }else{
      if(foundUser){
        // Load hash from your password DB.
        bcrypt.compare(password, foundUser.password, function(err, result) {
            // result == true
            if(result === true){
              res.render("secrets");
            }

        });
      };
    };

  });

});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
