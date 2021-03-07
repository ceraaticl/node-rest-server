const { Router } = require('express');
const { check } = require('express-validator');

const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
} = require('../controllers/productos');

const {
    existeCategoriaPorId,
    existeProductoPorId,
} = require('../helpers/db-validators');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
        check('categoria', 'La categoria es obligatorio.').not().isEmpty(),
        check('categoria', 'No es un id válido ').isMongoId(),
        check('categoria').custom(existeCategoriaPorId),
        validarCampos,
    ],
    crearProducto
);

router.get('/', obtenerProductos);

router.get(
    '/:id',
    [
        check('id', 'La categoria es obligatorio.').not().isEmpty(),
        check('id', 'No es un id válido ').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos,
    ],
    obtenerProducto
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'La categoria es obligatorio.').not().isEmpty(),
        check('id', 'No es un id válido ').isMongoId(),
        check('id').custom(existeProductoPorId),
        // check('categoria', 'No es un id válido ').isMongoId(),
        // check('categoria').custom(existeCategoriaPorId),
        validarCampos,
    ],
    actualizarProducto
);

router.delete(
    '/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'La categoria es obligatorio.').not().isEmpty(),
        check('id', 'No es un id válido ').isMongoId(),
        check('id').custom(existeProductoPorId),
        validarCampos,
    ],
    borrarProducto
);

module.exports = router;
