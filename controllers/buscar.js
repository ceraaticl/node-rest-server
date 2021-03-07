const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles'];

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            total: usuario ? 1 : 0,
            results: usuario ? [usuario] : [],
        });
    }

    const regex = RegExp(termino, 'i');

    const [total, usuario] = await Promise.all([
        Usuario.countDocuments({
            $or: [{ nombre: regex }, { correo: regex }],
            $and: [{ estado: true }],
        }),
        Usuario.find({
            $or: [{ nombre: regex }, { correo: regex }],
            $and: [{ estado: true }],
        }),
    ]);
    res.json({ total, results: usuario });
};

const buscarCategoria = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            total: categoria ? 1 : 0,
            results: categoria ? [categoria] : [],
        });
    }

    const regex = RegExp(termino, 'i');

    const [total, categoria] = await Promise.all([
        Categoria.countDocuments({ nombre: regex, estado: true }),
        Categoria.find({ nombre: regex, estado: true }),
    ]);
    res.json({ total, results: categoria });
};
const buscarProducto = async (termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const producto = await Producto.findById(termino).populate(
            'categoria',
            'nombre'
        );
        return res.json({
            total: producto ? 1 : 0,
            results: producto ? [producto] : [],
        });
    }

    const regex = RegExp(termino, 'i');

    const [total, producto] = await Promise.all([
        Producto.countDocuments({ nombre: regex, estado: true }),
        Producto.find({ nombre: regex, estado: true }).populate(
            'categoria',
            'nombre'
        ),
    ]);
    res.json({ total, results: producto });
};

const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategoria(termino, res);
            break;
        case 'productos':
            buscarProducto(termino, res);
            break;

        default:
            res.status(500).json({ msg: 'Se me olvio hacer esta búsqueda.' });
    }
};

module.exports = { buscar };
