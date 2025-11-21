const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const app = express();
const PORT = 3001;
const IP = 'localhost'; // Esta es la dirección IP de tu máquina virtual

app.use(cors());
// Sirviendo archivos estáticos desde 'public'
app.use(express.static('public'));


/* COMENTADO TEMPORALMENTE POR FALTA DE CERTIFICADO HTTPS VÁLIDO
// Cargar certificado y clave privada
const llavePrivada = fs.readFileSync('C:/Users/Administrador/Documents/Sistema de Audiencias/private.key');
const certificado = fs.readFileSync('C:/Users/Administrador/Documents/Sistema de Audiencias/certificate.crt');
const credenciales = {
    key: llavePrivada,
    cert: certificado,
    passphrase: "C0nsejeria" //passwd de la llave privada usada en la creación del certificado
};
// Crear servidor HTTPS
const httpsServer = https.createServer(credenciales, app);

// Iniciar servidor HTTPS
httpsServer.listen(PORT, IP, () => {
    console.log(`Servidor HTTPS corriendo en https://${IP}:${PORT}`);
});
*/
app.listen(PORT, () => console.log(`Server running on http://${IP}:${PORT}`));