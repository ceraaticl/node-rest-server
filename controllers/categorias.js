const { request, response } = require('express');
const { Categoria } = require('../models');

const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res
            .status(400)
            .json({ msg: `La categoria ${categoriaDB.nombre} ya existe.` });
    }

    // Generar la data a guardar

    const data = { nombre, usuario: req.usuario._id };

    const categoria = new Categoria(data);
    await categoria.save();
    res.status(201).json(categoria);
};
// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre'),
    ]);
    res.json({ total, categorias });
};

// obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate(
        'usuario',
        'nombre'
    );
    res.json(categoria);
};

// actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    let categoria = await Categoria.findOne({ nombre: data.nombre });
    if (categoria) {
        return res
            .status(400)
            .json({ msg: `La categoria ${categoria.nombre} ya existe.` });
    }

    categoria = await Categoria.findOneAndUpdate(id, data, { new: true });
    res.json(categoria);
};

// borrarCategoria - estado:false
const borrarCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    categoria = await Categoria.findOneAndUpdate(
        id,
        { estado: false },
        { new: true }
    );
    res.json(categoria);
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
};
