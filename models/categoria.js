
const {  Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
});

CategoriaSchema.methods.toJSON = function() {
    const { _id, __v, ...categoria } = this.toObject();
    categoria.uuid = _id;
    const { nombre } = categoria.usuario;
    categoria.usuario = nombre;
    return categoria;
}


module.exports = model( 'Categoria', CategoriaSchema ); 