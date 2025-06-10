const db = require('../config/db');

const getUbicaciones = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM ubicacions', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const getUbicacionById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM ubicacions WHERE id_ubicacion = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

module.exports = {
    getUbicaciones,
    getUbicacionById
};
