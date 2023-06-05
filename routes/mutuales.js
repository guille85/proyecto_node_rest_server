const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearMutual,
        obtenerMutuales,
        obtenerMutual,
        actualizarMutual, 
        borrarMutual } = require('../controllers/mutuales');

const { existeMutualPorId } = require('../helpers/db-validators'); 

const router = Router();

const condiciones_iva = ['SUJETO EXENTO', 'RESPONSABLE INSCRIPTO']

/**
 * {{url}}/api/mutuales DEFINIDO EN EL MODEL DE SERVER
 */

//Obtener todas las mutuales - publico
router.get('/', obtenerMutuales );

//Obtener una mutual por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos,
], obtenerMutual );

//Crear mutual - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('condicion_iva').not().isEmpty(),
    check('cuit', 'El cuit es obligatorio').not().isEmpty(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    validarCampos
], crearMutual );

//Actualizar mutual - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    check('id').custom( existeMutualPorId ),
    validarCampos
], actualizarMutual );

//Borrar una mutual - Admin - se setea en false el estado
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMutualPorId ),
    validarCampos,
], borrarMutual);


module.exports = router;