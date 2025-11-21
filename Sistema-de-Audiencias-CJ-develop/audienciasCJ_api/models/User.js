const { query } = require('../config/db');
const md5 = require('md5');

const User = {

    authenticate: async (username, password) => {
        const hashedPassword = md5(password);
        const sql = 'SELECT * FROM sys_usuario WHERE usuario = ?';

        try {
            const results = await query(sql, [username]);
            return results[0]; // Devuelve true si el usuario existe
        } catch (error) {
            throw error;
        }
    },
    identificate: async (username) =>{
        const sql = 'select nombre, apellido_paterno, apellido_materno from persona where rfc = ?'
        try{
            const results = await query(sql,[username]);
            return results[0];
        } catch (error) {
            throw error;
        }
    }

};

module.exports = User;
