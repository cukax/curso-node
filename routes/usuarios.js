
const { Router } = require('express');
const { check } = require('express-validator');

const Role = require('../models/role');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, existeMail, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarJWT } = require('../middlewares/validar-jwt');

const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet );

router.put('/:id', [
    validarJWT,
    // Igual a: (req, res, next) => validarJWT(req, res, next),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosPut );

router.post('/', [
    check('nombre', "Nombre no es válido").not().isEmpty(), 
    check('password', "Password no es válido").isLength( {min:6} ),
    check('correo', "Correo no válido").isEmail(),
    // Igual a (correo) => existeMail(correo)
    check('correo').custom( existeMail ),
    // check('rol', "Rol no permitido").isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost );

router.delete('/', usuariosDelete );

router.patch('/', usuariosPatch );





module.exports = router;