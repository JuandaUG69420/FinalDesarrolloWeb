'use strict';

var express = require('express');
var contactoController = require('../controllers/contacto');
var authMiddleware = require('../middlewares/auth');

var router = express.Router();

router.post('/api/contacto', authMiddleware.verifyToken, contactoController.createContacto);
router.get('/api/contactos', authMiddleware.verifyToken, contactoController.getContactosByUser);
router.put('/api/contacto/:id', authMiddleware.verifyToken, contactoController.updateContacto);
router.delete('/api/contacto/:id', authMiddleware.verifyToken, contactoController.deleteContacto);

module.exports = router;
