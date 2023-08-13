
const { request, response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');

const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req = request, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            const data = {
                nombre, 
                correo,
                password: 'Prueba',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        if ( !usuario.estado ) {
            return res.status(401).json({
                msj: 'Hable con el administrador, usuario bloqueado' 
            });
        }

        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }

}

module.exports = {
    login,
    googleSignIn
}