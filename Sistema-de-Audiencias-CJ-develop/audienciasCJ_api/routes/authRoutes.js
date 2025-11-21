const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const md5 = require('md5');


// Rutas
router.post('/login', authController.login);
router.get('/info',  authController.info); // Usa el middleware para verificar el token
router.post('/watermark', authController.watermark); // Usa el middleware para verificar el token

module.exports = router;
