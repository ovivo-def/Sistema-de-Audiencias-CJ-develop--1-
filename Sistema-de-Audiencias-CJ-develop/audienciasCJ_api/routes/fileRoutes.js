const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.get('/buscar', fileController.buscar);
router.get('/contenido-carpeta', fileController.contenidoCarpeta);
router.get('/ver-archivo', fileController.verArchivo);
router.get('/filtrar-fecha',fileController.buscarFiltroFecha)
module.exports = router;
