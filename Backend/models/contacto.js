'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    telefonoFijo: { type: String },
    celular: { type: String, required: true, unique: true },
    email: { type: String }
});

module.exports = mongoose.model('contacts', ContactSchema);
