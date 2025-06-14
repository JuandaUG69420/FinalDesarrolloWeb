'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('users', UserSchema);
