const { Schema, model } = require('mongoose');

const MutualSchema = Schema({
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
    cuit: {
        type: String,
        required: [true, 'El cuit es obligatorio']
    },
    condicion_iva: {
        type: String,
        required: [true, 'La condicion frente al iva es obligatoria']
    },
    direccion: { 
        type: String,
        required: [true, 'La direccion es requerida']
     },
});


MutualSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject(); //ver bien que retornar aca
    return data;
}


module.exports = model( 'Mutual', MutualSchema );