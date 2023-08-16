
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id').notEmpty(),
    check('id').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerProducto);

router.post('/', [
    validarJWT,
    check('nombreProducto', 'El nombre del producto es obligatorio').notEmpty(),
    check('nombreCategoria', 'El nombre de la categoria es obligatorio').notEmpty(),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    check('id').notEmpty(),
    check('id').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarProducto)

router.delete('/:id', [
    validarJWT,
    check('id').notEmpty(),
    check('id').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarProducto);

module.exports = router;