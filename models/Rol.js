const db = require('../config/db');
const getRoles = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM rols', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const createRol = (rol) => {
    return new Promise((resolve, reject) => {
        const { nombre, descripcion } = rol;
        db.query('INSERT INTO rols (nombre, descripcion) VALUES (?, ?)', 
            [nombre, descripcion], (err, results) => {
            if (err) return reject(err);
            resolve(results.insertId);
        });
    });
};

const getRolById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM rols WHERE id_rol = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

// Actualizar un rol
const updateRol = (id, rol) => {
    return new Promise((resolve, reject) => {
        const { nombre, descripcion } = rol;
        db.query('UPDATE rols SET nombre = ?, descripcion = ? WHERE id_rol = ?', 
            [nombre, descripcion, id], (err, results) => {
            if (err) return reject(err);
            resolve({ id_rol: id, nombre, descripcion });
        });
    });
};

const deleteRol = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM rols WHERE id_rol = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = {
    getRoles,
    createRol,
    getRolById,
    updateRol,
    deleteRol
};
