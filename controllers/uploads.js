const { request, response } = require('express');
const path = require('path');
const fs = require('fs');
var cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivos = async (req = request, res = response) => {
    try {
        // const nombre = await subirArchivo(req.files, ['mr', 'txt'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'img');
        res.json({ nombre });
    } catch (msg) {
        res.status(400).json({ msg });
    }
};

const actualizarImagen = async (req = request, res = response) => {
    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res
                    .status(400)
                    .json({ msg: `No existe un usuario con el id ${id}` });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res
                    .status(400)
                    .json({ msg: `No existe un usuario con el id ${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto.' });
    }

    if (modelo.img) {
        const pathImagen = path.join(
            __dirname,
            '../uploads',
            coleccion,
            modelo.img
        );
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    modelo.save();

    res.json(modelo);
};

const actualizarImagenCloudinary = async (req = request, res = response) => {
    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res
                    .status(400)
                    .json({ msg: `No existe un usuario con el id ${id}` });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res
                    .status(400)
                    .json({ msg: `No existe un usuario con el id ${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto.' });
    }

    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    modelo.img = secure_url;
    modelo.save();

    res.json(modelo);
};

const mostrarImagen = async (req = request, res = response) => {
    const { id, coleccion } = req.params;
    const pathNoImagen = path.join(__dirname, '../assets', 'no-image.jpg');

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res
                    .status(400)
                    .json({ msg: `No existe un usuario con el id ${id}` });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res
                    .status(400)
                    .json({ msg: `No existe un usuario con el id ${id}` });
            }
            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto.' });
    }

    if (modelo.img) {
        const pathImagen = path.join(
            __dirname,
            '../uploads',
            coleccion,
            modelo.img
        );
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }
    res.sendFile(pathNoImagen);
};

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
};
