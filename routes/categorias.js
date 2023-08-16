
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', obtenerCategorias);

router.get('/:id', [
    check('id').notEmpty(),
    check('id').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], crearCategoria);

router.put('/:id', [
    validarJWT,
    check('id').notEmpty(),
    check('id').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria)

router.delete('/:id', [
    validarJWT,
    check('id').notEmpty(),
    check('id').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;