const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearPaciente,
        obtenerPacientes,
        obtenerPaciente,
        actualizarPaciente, 
        borrarPaciente } = require('../controllers/pacientes');

const { existeMutualPorId, existePacientePorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/pacientes
 */

//  Obtener todos los pacientes - publico
router.get('/', obtenerPacientes );

// Obtener un paciente por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePacientePorId ),
    validarCampos,
], obtenerPaciente );

// Crear paciente - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('apellido','El apellido es obligatorio').not().isEmpty(),
    check('dni','El DNI es obligatorio').not().isEmpty(),
    check('fecha_nacimiento','La fecha de nacimiento es obligatoria').not().isEmpty(),
    check('mutual','No es un id de Mongo').isMongoId(),
    check('mutual').custom( existeMutualPorId ),
    validarCampos
], crearPaciente );

// Actualizar paciente- privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    check('paciente','No es un id de Mongo').isMongoId(),
    check('id').custom( existePacientePorId ),
    validarCampos
], actualizarPaciente );

// Borrar un paciente - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existePacientePorId ),
    validarCampos,
], borrarPaciente);


module.exports = router;