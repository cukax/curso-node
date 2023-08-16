

const { response } = require('express');
const { Producto, Categoria } = require('../models');

const { ObjectId } = require('mongoose').Types;

const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .limit(limite)
            .skip(desde)
            .populate('usuario')
            .populate('categoria')
    ]);

    res.json({
        total,
        productos
    });

}

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findOne({ _id: id })
        .populate('usuario')
        .populate('categoria');

    if (!producto.estado) {
        return res.status(400).json({
            msg: `El producto ${producto.nombre} se encuentra eliminado`
        });
    }

    res.json(producto);

}

const crearProducto = async (req, res = response) => {

    // const isMongoId = ObjectId.isValid();

    const nombreProducto = req.body.nombreProducto.toUpperCase();
    const nombreCategoria = req.body.nombreCategoria.toUpperCase();
    const {precio, descripcion} = req.body;
    
    const productoDB = await Producto.findOne({ nombre: nombreProducto });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${req.body.nombreProducto}, ya existe`
        })
   
    }
    
    const categoriaDB = await Categoria.findOne({ nombre: nombreCategoria });

    if (!categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${req.body.nombreCategoria}, no existe`
        })
    }

    const data = {
        nombre: nombreProducto,
        categoria: categoriaDB._id,
        usuario: req.usuarioAuth._id,
        precio,
        descripcion
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto);

}

const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;

    const { nombre, estado } = req.body;

    const productoNombre = await Producto.findOne({ nombre });

    if (productoNombre) {
        return res.status(400).json({
            msg: `El producto ${nombre}, ya existe`
        })
    }

    const producto = await Producto.findByIdAndUpdate(id, {
        nombre,
        estado
    });

    producto.nombre = nombre;
    producto.estado = estado;

    res.json(producto);
    
}

const borrarProducto = async (req, res = response) => {
    
    const { id } = req.params;
    
    const producto = await Producto.findByIdAndUpdate(id, { estado: false });
    
    res.json(producto);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}