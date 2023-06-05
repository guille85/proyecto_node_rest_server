const { response } = require('express');
const { Mutual } = require('../models');

// Método que obtiene todas las mutuales, paginando de a 5
const obtenerMutuales = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, mutuales ] = await Promise.all([
        Mutual.countDocuments(query),
        Mutual.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        mutuales
    });
}

//Método que obtiene la mutual que coincida con el ID recibido
const obtenerMutual = async(req, res = response ) => {

    const { id } = req.params;
    const mutual = await Mutual.findById( id );
    console.log('mutual: ', mutual);
    console.log('req: ', req.params);
    res.json( mutual );

}

//Método para crear una mutual
const crearMutual = async(req, res = response ) => {
    console.log('req mutual: ', req);
    const { estado, ...body } = req.body;

    const mutualDB = await Mutual.findOne({ nombre: body.nombre }); //verifica si la mutual existe en la DB

    if ( mutualDB ) {
        return res.status(400).json({
            msg: `La mutual ${ mutualDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase()//,
        //usuario: req.usuario._id
    }

    const mutual = new Mutual( data );

    // Guardar DB
    await mutual.save();

    res.status(201).json(mutual);

}

//Método para actualizar la información de una mutual
const actualizarMutual = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, ...data } = req.body;

    console.log()

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    //data.usuario = req.usuario._id;

    const mutual = await Mutual.findByIdAndUpdate(id, data, { new: true });

    await mutual.save();
    res.json( mutual );

}

//Método para borrar una mutual (se setea en false el estado)
const borrarMutual = async(req, res = response ) => {

    const { id } = req.params;
    const mutualBorrada = await Mutual.findByIdAndUpdate( id, { estado: false }, {new: true });
    await mutualBorrada.save();
    res.json( mutualBorrada );
}




module.exports = {
    crearMutual,
    obtenerMutuales,
    obtenerMutual,
    actualizarMutual,
    borrarMutual
}