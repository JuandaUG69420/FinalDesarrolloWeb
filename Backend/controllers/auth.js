'use strict';

var User = require("../models/usuario");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config();

function register(req, res) {
    var params = req.body;
    var newUser = new User();

    newUser.email = params.email;
    newUser.nombre = params.nombre;

    if (!params.email || !params.password) {
        return res.status(400).send({ message: "Email and password are required" });
    }

    bcrypt.hash(params.password, 10, (err, hash) => {
        if (err) return res.status(500).send({ message: "Error encrypting password", error: err });

        newUser.password = hash;

        newUser.save().then(
            savedUser => res.status(200).send({ message: "User registered successfully", user: savedUser }),
            error => res.status(500).send({ message: "Error registering user", error: error })
        );
    });
}

function login(req, res) {
    var params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).send({ message: "Email and password are required" });
    }

    User.findOne({ email: params.email }).then(user => {
        if (!user) return res.status(404).send({ message: "User not found" });

        bcrypt.compare(params.password, user.password, (err, match) => {
            if (err || !match) return res.status(401).send({ message: "Invalid credentials" });

            var token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            });

            res.status(200).send({ message: "Login successful", token: token });
        });
    }).catch(err => {
        res.status(500).send({ message: "Login error", error: err });
    });
}

module.exports = {
    register,
    login
};
