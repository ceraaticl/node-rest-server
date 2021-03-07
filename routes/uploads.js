const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares');
const { cargarArchivos } = require('../controllers/uploads');

const router = Router();

router.post('/', cargarArchivos);

module.exports = router;
