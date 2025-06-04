'use strict';

var mongoose = require('mongoose');
var application = require('./app');

mongoose.connect('mongodb://localhost:27017/FinalDesarrolloWeb').then(
    () => {
        console.log("Database connection successful. Starting application");
        application.listen(6762, function () {
            console.log("Application started on port 6762");
        });
    },
    err => {
        console.log("Error when connecting to database. Application not started: " + err);
    }
);
