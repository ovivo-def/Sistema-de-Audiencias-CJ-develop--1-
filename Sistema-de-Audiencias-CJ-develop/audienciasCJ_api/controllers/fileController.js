const axios = require('axios');

const fileController = {
    buscar: async (req, res) => {
        const query = req.query.query;
        const everythingUrl = `http://172.31.76.215:8081/?s=${encodeURIComponent(query)}&sort=date modified&ascending=0`;

        try {
            const response = await axios.get(everythingUrl);
            res.send(response.data);
        } catch (error) {
            console.error('Error al realizar la b�squeda:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    buscarFiltroFecha: async (req, res) => {
        const query = req.query.query;
        const everythingUrl = `http://172.31.76.215:8081/?s=${encodeURIComponent(query)}&sort=date modified&ascending=1`;

        try {
            const response = await axios.get(everythingUrl);
            res.send(response.data);
        } catch (error) {
            console.error('Error al realizar la b�squeda:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    contenidoCarpeta: async (req, res) => {
        const path = req.query.path;
        const everythingUrl = `http://172.31.76.215:8081/V%3A/`.concat(path.toString());
        console.log(everythingUrl);
        try {
            const response = await axios.get(everythingUrl);
            console.log("Carpeta Mostrada");
            res.send(response.data);
        } catch (error) {
            console.error('Error al obtener contenido de la carpeta:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    verArchivo: async (req, res) => {
        const relativeFilePath = req.query.path;
        const fileUrl = `http://172.31.76.215:8081/V%3A/${relativeFilePath}`;

        try {
            res.json({ path: fileUrl });
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
};

module.exports = fileController;
