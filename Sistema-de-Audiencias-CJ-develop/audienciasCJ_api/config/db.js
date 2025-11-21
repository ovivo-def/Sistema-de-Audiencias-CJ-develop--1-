const mysql = require('mysql');

const db = mysql.createConnection({
    host: '172.31.76.144',
    user: 'sggroot',
    password: '$66Mxldp134!2013',
    database: 'sigg'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    db,
    query
};