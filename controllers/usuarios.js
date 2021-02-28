const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const usuariosGet = (req = request, res = response) => {
    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;
    res.json({ msg: 'get api - controlador', q, nombre, apikey, page, limit });
};
const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    // Verificar correo

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar en DB
    await usuario.save();
    res.json({ msg: 'post api - controlador', usuario });
};
const usuariosPut = (req, res = response) => {
    const { id } = req.params;
    res.json({ msg: 'put api - controlador', id });
};
const usuariosPatch = (req, res = response) => {
    res.json({ msg: 'patch api - controlador' });
};
const usuariosDelete = (req, res = response) => {
    res.json({ msg: 'delete api - controlador' });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};
