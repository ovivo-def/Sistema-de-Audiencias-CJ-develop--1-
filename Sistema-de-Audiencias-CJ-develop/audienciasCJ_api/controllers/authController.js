const { exec } = require('child_process');
const User = require('../models/user');
const md5 = require('md5');

const authController = {
    login: async (req, res) => {
        const { svd_usr, svd_pss } = req.body;
        try {
            const authenticated = await User.authenticate(svd_usr, svd_pss);

            if (!authenticated) {
                return res.json({ valor: -1, descripcion: 'Usuario no encontrado' });
            }

            console.log(authenticated);
            const pss = md5(svd_pss);
            const usr = svd_usr.toUpperCase();

            if (authenticated.BLOQUEADO == 1) {
                return res.json({ valor: -1, descripcion: 'Usuario bloqueado o deshabilitado' });
            }
            else {
                return res.json({valor: 1, descripcion: 'Usuario encontrado'});
            }

            /*if (pss === authenticated.CONTRASENA && usr === authenticated.USUARIO) {
                // Generar el token JWT

                const token = jwt.sign({ usuario: usr }, md5('C0nsejeria'), { expiresIn: '1h' });
                console.log(token);
                req.session.usuario = usr; // Guarda el usuario en la sesión si es necesario
                return res.json({ valor: 1, descripcion: 'Usuario verificado', token });
            } else {
                return res.json({ valor: -1, descripcion: 'Contraseña o usuario incorrecto' });
            }*/
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    info: async (req, res) => {
        const { usuario } = req.session; // Obtén el usuario de la sesión
        if (!usuario) {
            return res.status(401).json({ valor: -1, descripcion: 'No autenticado' });
        }

        try {
            const infoPersonal = await User.identificate(usuario); // Usa el usuario de la sesión
            res.json(infoPersonal);
        } catch (err) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    watermark: (req, res) => {
        const { usuario } = req.session; // Obtén el usuario de la sesión

        if (!usuario) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        // Ejecuta el script de Python (usa 'python' en lugar de 'python3' en Windows)
        const pythonCommand = `python C:\\Users\\usuario\\Documents\\Defensoria\\Sistema-de-Audiencias-CJ\\audienciasCJ_api\\watermark_script.py ${usuario}`;

        exec(pythonCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error ejecutando el script: ${error.message}`);
                return res.status(500).json({ error: 'Error interno ejecutando el script de Python' });
            }

            if (stderr) {
                console.error(`Error en el script de Python: ${stderr}`);
                return res.status(500).json({ error: 'Error en el script de Python' });
            }

            res.json({ message: 'Marca de agua creada exitosamente', output: stdout });
        });
    }
};

module.exports = authController;
