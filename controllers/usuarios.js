const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {
    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;
    res.json({ msg: 'get api - controlador', q, nombre, apikey, page, limit });
};
const usuariosPost = (req, res = response) => {
    const { nombre, edad } = req.body;
    res.json({ msg: 'post api - controlador', nombre, edad });
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
