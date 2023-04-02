//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"] });
const User = new mongoose.model("User", userSchema);

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(3000, () => {
    console.log("Server started on port 3000.");
})

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});

//level 1 security: email and password
app.post("/register", (req, res) => {
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });
    async function saveOneUser() {
        try {
            await user.save();
            console.log("Successfully register a user!");
            res.render("secrets");
        } catch {
            res.send("Please try again!");
        }

    }
    saveOneUser();
});
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    async function findTheUser() {
        try {
            const userFound = await User.findOne({ email: username });
            if (userFound) {
                if (userFound.password === password) {
                    res.render("secrets");
                } else {
                    res.send("Please enter your password again!");
                }
            }
        } catch {
            res.send("Please enter your email or password again!");
        }
    }
    findTheUser();
}
);