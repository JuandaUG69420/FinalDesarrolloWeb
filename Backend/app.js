'use strict';

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacto');

const application = express();

application.use(cors());
application.use(express.json()); 
application.use(express.urlencoded({ extended: false }));

application.use(userRoutes);
application.use(contactRoutes);

module.exports = application;
