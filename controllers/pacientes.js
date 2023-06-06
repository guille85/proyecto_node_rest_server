const { response } = require('express');
const { Paciente } = require('../models');


const obtenerPacientes = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, pacientes ] = await Promise.all([
        Paciente.countDocuments(query),
        Paciente.find(query)
            .populate('mutual', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        pacientes
    });
}

const obtenerPaciente = async(req, res = response ) => {

    const { id } = req.params;
    const paciente = await Paciente.findById( id )
                            .populate('mutual', 'nombre');

    res.json( paciente );

}

const crearPaciente = async(req, res = response ) => {

    const { estado, ...body } = req.body;

    const pacienteDB = await Paciente.findOne({ dni: body.dni });

    if ( pacienteDB ) {
        return res.status(400).json({
            msg: `El paciente cuyo DNI es: ${ pacienteDB.dni }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        apellido: body.apellido.toUpperCase(),
    //    usuario: req.usuario._id
    }

    const paciente = new Paciente( data );

    // Guardar DB
    await paciente.save();

    res.status(201).json(paciente);

}

const actualizarPaciente = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    if( data.apellido) {
        data.apellido = data.apellido.toUpperCase();
    }

    const paciente = await Paciente.findByIdAndUpdate(id, data, { new: true });

    // Guardar DB
    await paciente.save();
    res.json( paciente );

}

const borrarPaciente = async(req, res = response ) => {

    const { id } = req.params;
    const pacienteBorrado = await Paciente.findByIdAndUpdate( id, { estado: false }, {new: true });

    // Guardar DB
    await pacienteBorrado.save();
    res.json( pacienteBorrado );
}




module.exports = {
    crearPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    borrarPaciente
}