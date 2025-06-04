'use strict';

var Contacto = require("../models/contacto");

async function createContacto(req, res) {
    try {
        const params = req.body;

        if (!params.nombre || !params.apellidos || !params.celular) {
            return res.status(400).send({ message: "Nombre, apellidos y celular son obligatorios" });
        }

        const contacto = new Contacto({
            nombre: params.nombre,
            apellidos: params.apellidos,
            telefonoFijo: params.telefonoFijo,
            celular: params.celular,
            email: params.email,
            usuario: req.userId
        });

        const saved = await contacto.save();
        res.status(201).send({ message: "Contacto creado correctamente", contacto: saved });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.celular) {
            return res.status(409).send({ message: "El celular ya está registrado." });
        }
        res.status(500).send({ message: "Error al guardar el contacto", error });
    }
}


function getContactosByUser(req, res) {
    var userId = req.userId;

    Contacto.find({ usuario: userId }).then(
        contactos => res.status(200).send({ contactos }),
        error => res.status(500).send({ message: "Error al buscar contactos", error: error })
    );
}

function updateContacto(req, res) {
    const id = req.params.id;
    const datos = req.body;
    const userId = req.userId;

    Contacto.findOneAndUpdate(
        { _id: id, usuario: userId },
        datos,
        { new: true }
    )
    .then(contactoActualizado => {
        if (!contactoActualizado) {
            return res.status(404).send({ 
                message: "Contacto no encontrado o no tienes permiso para editarlo" 
            });
        }

        res.status(200).send({ 
            message: "Contacto actualizado correctamente", 
            contacto: contactoActualizado 
        });
    })
    .catch(error => {
        res.status(500).send({ message: "Error al actualizar el contacto", error });
    });
}

function deleteContacto(req, res) {
    const id = req.params.id;
    const userId = req.userId;

    Contacto.findOneAndDelete({ _id: id, usuario: userId })
    .then(contactoEliminado => {
        if (!contactoEliminado) {
            return res.status(404).send({ 
                message: "Contacto no encontrado o no tienes permiso para eliminarlo" 
            });
        }

        res.status(200).send({ 
            message: "Contacto eliminado correctamente", 
            contacto: contactoEliminado 
        });
    })
    .catch(error => {
        res.status(500).send({ message: "Error al eliminar el contacto", error });
    });
}


module.exports = {
    createContacto,
    getContactosByUser,
    updateContacto,
    deleteContacto
};
