const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const md5 = require('md5');

const PORT = 3000;
const IP = '172.31.76.215';

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

app.use(cors(/*{
    origin: 'http://localhost:3001', // Cambia esto al origen de tu frontend
    credentials: true
}*/));
app.use(express.json());

// Configuración de sesiones
/*
app.use(session({
    secret: md5('123'), // Debe ser una clave secreta segura
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Cambiar a true si usas HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hora
    }
}));
*/

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

/* SECCIÓN COMENTADA POR FALTA DE CERTIFICADO VÁLIDO HTTPS
const httpsServer = https.createServer(credenciales, app);

httpsServer.listen(PORT, IP, () => {
    console.log(`Servidor HTTPS corriendo en https://${IP}:${PORT}`);
});
*/
app.listen(PORT, () => console.log(`Server running on http://${IP}:${PORT}`));