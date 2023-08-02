
const {response} = require('express');

const usuariosGet = (req, res) => {
    res.json({
        msg: 'get API - controlador'
    });
}

const usuariosPost = (req, res) => {

    const body = req.body;

    res.json({
        msg: 'Post API - controlador',
        body
    });
}

const usuariosPut = (req, res) => {

    const {id} = req.params;
    res.json({
        msg: 'Put API - controlador',
        id
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'Delete API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}