
const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg : 'No hay token en la petición'
        });
    }
    
    try {

        const { uuid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY );
        
        const usuario = await Usuario.findOne({ '_id': uuid });

        if ( usuario.rol !== 'ADMIN_ROLE' ) {
            return res.status(401).json({
                msg : 'Usuario sin permisos para realizar la operación'
            });
        }

        req.usuarioAuth = usuario;
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg : 'Token no válido'
        });
    }


}

module.exports = {
    validarJWT
}