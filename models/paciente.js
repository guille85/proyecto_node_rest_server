const { Schema, model } = require('mongoose');

const PacienteSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    dni: {
        type: String,
        required: [true, 'El DNI es obligatorio']
    },
    fecha_nacimiento: {
        type: Date,
        required: [true, 'Fecha de nacimiento es obligatoria']
    },
    mutual: {
        type: Schema.Types.ObjectId,
        ref: 'Mutual'
    },
    observaciones: { type: String }
});


PacienteSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Paciente', PacienteSchema );
