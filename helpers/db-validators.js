const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });

    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado`);
    }
}

const existeMail = async ( correo = '' ) => {
    const existeMail = await Usuario.findOne({ correo });

    if ( existeMail ) {
        throw new Error(`El correo ${correo} ya existe`);
    }
}

const existeUsuarioPorId = async ( id ) => {
    const existeUsusario = await Usuario.findById( id );
    
    if ( !existeUsusario ) {
        throw new Error(`El id de usuario ${id} no existe en la BD`);
    }
}


module.exports = {
    esRoleValido,
    existeMail,
    existeUsuarioPorId
}