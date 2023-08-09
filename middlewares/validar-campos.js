const { validationResult } = require('express-validator');

/*
* Recupera todos los errores producidos por la validación del express-validator 
*/

const validarCampos = ( req, res, next) => {

    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    }

    next();

}

module.exports = {
    validarCampos
}