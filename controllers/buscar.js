const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Mutual, Paciente } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'mutuales',
    'pacientes',
    'roles'    
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });

}

const buscarMutuales = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const mutual = await Mutual.findById(termino);
        return res.json({
            results: ( mutual ) ? [ mutual ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const mutuales = await Mutual.find({ nombre: regex, estado: true })

    res.json({
        results: mutuales
    });

}


const buscarPacientes = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const paciente = await Paciente.findById(termino)
                            .populate('mutual','nombre');
        return res.json({
            results: ( paciente ) ? [ paciente ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const pacientes = await Paciente.find({ nombre: regex, estado: true })
                            .populate('mutual','nombre')

    res.json({
        results: pacientes
    });

}



const buscar = ( req, res = response ) => {
    
    const { coleccion, termino  } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'mutuales':
            buscarMutuales(termino, res);
        break;
        case 'pacientes':
            buscarPacientes(termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }

}



module.exports = {
    buscar
}