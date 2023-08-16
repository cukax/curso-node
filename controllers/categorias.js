
const { response } = require('express');
const { Categoria } = require('../models');
const categoria = require('../models/categoria');

const obtenerCategorias = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .limit(limite)
            .skip(desde)
            .populate('usuario')
    ]);

    res.json({
        total,
        categorias
    });

}

const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findOne({ _id: id })
        .populate('usuario');

    if (!categoria.estado) {
        return res.status(400).json({
            msg: `La categoria ${categoria.nombre} se encuentra eliminada`
        });
    }

    res.json(categoria);

}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuarioAuth._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json(categoria);

}

const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;

    const { nombre, estado } = req.body;

    const categoriaNombre = await Categoria.findOne({ nombre });

    if (categoriaNombre) {
        return res.status(400).json({
            msg: `La categoria ${nombre}, ya existe`
        })
    }

    const categoria = await Categoria.findByIdAndUpdate(id, {
        nombre,
        estado
    });

    categoria.nombre = nombre;
    categoria.estado = estado;

    res.json(categoria);
    
}

const borrarCategoria = async (req, res = response) => {
    
    const { id } = req.params;
    
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });
    
    res.json(categoria);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}