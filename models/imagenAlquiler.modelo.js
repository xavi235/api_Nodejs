const db = require('../config/db');

module.exports = {
  getAll: () => db.query('SELECT * FROM ImagenAlquiler'),
  getByAlquiler: (id) => db.query('SELECT * FROM ImagenAlquiler WHERE id_alquiler = ?', [id])
};
