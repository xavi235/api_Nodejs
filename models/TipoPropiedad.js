const db = require('../config/db');

const getTipoPropiedades = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tipo_propiedads', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const createTipoPropiedad = (tipoPropiedad) => {
    return new Promise((resolve, reject) => {
        const { nombre } = tipoPropiedad;
        db.query('INSERT INTO tipo_propiedads (nombre) VALUES (?)', [nombre], (err, results) => {
            if (err) return reject(err);
            resolve(results.insertId);
        });
    });
};

const getTipoPropiedadById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tipo_propiedads WHERE id_tipo = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

const updateTipoPropiedad = (id, tipoPropiedad) => {
    return new Promise((resolve, reject) => {
        const { nombre } = tipoPropiedad;
        db.query('UPDATE tipo_propiedads SET nombre = ? WHERE id_tipo = ?', [nombre, id], (err, results) => {
            if (err) return reject(err);
            resolve({ id_tipo: id, nombre });
        });
    });
};

const deleteTipoPropiedad = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM tipo_propiedads WHERE id_tipo = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = {
    getTipoPropiedades,
    createTipoPropiedad,
    getTipoPropiedadById,
    updateTipoPropiedad,
    deleteTipoPropiedad
};
