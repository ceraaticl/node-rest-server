const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req = request, res = response) => {
    try {
        const { correo, password } = req.body;
        const usuario = await Usuario.findOne({ correo });

        // Verificar si el email existe
        if (!usuario) {
            return res
                .status(400)
                .json({ msg: 'Usuario / Password no son correctos - correo' });
        }

        // Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false',
            });
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password',
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({ usuario, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Contacte con el administrador' });
    }
};

module.exports = { login };
