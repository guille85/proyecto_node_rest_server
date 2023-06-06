const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Mutual, Paciente, Producto  } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'mutuales',
    'pacientes',
    'productos',
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

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const producto = await Producto.findById(termino)
                            .populate('categoria','nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ nombre: regex, estado: true })
                            .populate('categoria','nombre')

    res.json({
        results: productos
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
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
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