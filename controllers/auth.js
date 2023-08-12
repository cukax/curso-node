
const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');

const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const login = async ( req, res = response ) => {

    const { correo, password } = req. body;

    try {
        
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado'
            })
        }
        
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        const token = await generarJWT( usuario.id );

        res.json({
            usuario, 
            token,
        });
        
    } catch (error) {
        console.log(error);
        return res.status().json({
            msg: 'Error. Contacte al administrador'
        });
    }

}

module.exports = {
    login
}