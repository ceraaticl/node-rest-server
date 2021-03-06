const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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
        res.status(500).json({ msg: 'Contacte con el administrador.' });
    }
};

const googleSignin = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { nombre, img, correo } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            const data = {
                nombre,
                correo,
                img,
                google: true,
                password: ':P',
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado.',
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({ usuario, token });

        res.json({ msg: 'Todo ok! Google Signin.' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Token de Google no válido.' });
    }
};

module.exports = { login, googleSignin };
