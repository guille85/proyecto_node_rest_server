const Role = require('../models/role');
const { Usuario, Mutual, Paciente } = require('../models');


const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Mutuales
 */
 const existeMutualPorId = async( id ) => {
    // Verificar si el correo existe
    const existeMutual = await Mutual.findById(id);
    console.log('existeMutual: ', existeMutual);
    if ( !existeMutual ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Pacientes
 */
 const existePacientePorId = async( id ) => {
    // Verificar si el correo existe
    const existePaciente = await Paciente.findById(id);
    console.log('existeMutual: ', existePaciente);
    if ( !existePaciente ) {
        throw new Error(`El id no existe ${ id }`);
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeMutualPorId,
    existePacientePorId
}

