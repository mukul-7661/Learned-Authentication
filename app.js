quire("dotenv").config();
const express = require("express");st ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userDB');

    const userSchema = new mongoose.Schema({
        email: String,
        password: String
    });

    


    const User = new mongoose.model("User", userSchema);

    app.get("/", function (req, res) {
        res.render("home");
    });

    app.get("/login", function (req, res) {
        res.render("login");
    });

    app.get("/register", function (req, res) {
        res.render("register");
    });

    app.post("/register", function(req, res){

        bcrypt.hash(req.body.password, saltRounds, function(err, hash){
            const newUser = new User({
                email: req.body.username,
                password: hash 
            });
    
            newUser.save(function(err){
                if(err) {
                    console.log(err);
                }
                else{
                    res.render("secrets");
                }
            });
        })

        
    });

    app.post("/login", function(req, res){
        const userName = req.body.username;
        const password = req.body.password;

        User.findOne({email: userName}, function(err, foundUser){
            if(err){
                console.log(err);
            }
            else{
                if(foundUser){
                    bcrypt.compare(password, foundUser.password, function(err, result){
                        if(result == true){
                            res.render("secrets");
                        }
                    });
                }
                
            }
        })
    });


    app.listen(3000, function () {
        console.log("Server is running");
    });

}
