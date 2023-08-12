
const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    google: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    }
})

/*
* Elimina los campos de password y __v de la respuesta reescribiendo el metodo toJSON
*/
UsuarioSchema.methods.toJSON = function() {
    const { _id, __v, password, ...usuario } = this.toObject();
    usuario.uuid = _id;
    return usuario;
}


module.exports = model( 'Usuario', UsuarioSchema );