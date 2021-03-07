const { response, request } = require('express');
const { Producto } = require('../models');

const crearProducto = async (req = request, res = response) => {
    let { estado, usuario, nombre, ...data } = req.body;
    data.nombre = nombre.toUpperCase();
    let producto = await Producto.findOne({ nombre });
    if (producto) {
        return res
            .status(400)
            .json({ msg: `La categoria ${producto.nombre} ya existe.` });
    }
    // Generar data a guardar
    data.usuario = req.usuario._id;
    producto = new Producto(data);
    await producto.save();
    res.status(201).json(producto);
};

const obtenerProductos = async (req = request, res = response) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre'),
    ]);
    res.json({ total, productos });
};

const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');
    res.json(producto);
};

const actualizarProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, categoria, usuario, ...data } = req.body;
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    let producto = await Producto.findOne({ nombre: data.nombre });
    if (producto) {
        return res
            .status(400)
            .json({ msg: `El produto ${data.nombre} ya existe.` });
    }

    producto = await Producto.findOneAndUpdate(id, data, { new: true });
    res.json(producto);
};

const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findOneAndUpdate(
        id,
        { estado: false },
        { new: true }
    );

    res.json({ producto });
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
};
