const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, verificarArchivo } = require('../middlewares');
const {
    cargarArchivos,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen,
} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', verificarArchivo, cargarArchivos);

router.put(
    '/:coleccion/:id',
    [
        check('id', 'El id es obligatorio.').not().isEmpty(),
        check('id', 'El id no es válido.').isMongoId(),
        check('coleccion', 'La coleccion es obligatoria.').not().isEmpty(),
        check('coleccion').custom((c) =>
            coleccionesPermitidas(c, ['usuarios', 'productos'])
        ),
        verificarArchivo,
        validarCampos,
    ],
    // actualizarImagen
    actualizarImagenCloudinary
);

router.get(
    '/:coleccion/:id',
    [
        check('id', 'El id es obligatorio.').not().isEmpty(),
        check('id', 'El id no es válido.').isMongoId(),
        check('coleccion', 'La coleccion es obligatoria.').not().isEmpty(),
        check('coleccion').custom((c) =>
            coleccionesPermitidas(c, ['usuarios', 'productos'])
        ),
        validarCampos,
    ],
    mostrarImagen
);

module.exports = router;
