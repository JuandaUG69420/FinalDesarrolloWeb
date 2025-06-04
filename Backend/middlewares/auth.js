'use strict';

const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.log('Token no proporcionado');
        return res.status(403).send({ message: 'Token no proporcionado' });
    }

    let token = authHeader;
    if (token.startsWith('Bearer ')) {
        token = token.slice(7); 
    }


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Error al verificar token:', err);
            return res.status(401).send({ message: 'Token inválido' });
        }

        if (!decoded.id) {
            console.log('Token válido pero sin id');
            return res.status(400).send({ message: 'El token no contiene id' });
        }

        req.userId = decoded.id;  
        next();
    });
}

module.exports = {
    verifyToken
};