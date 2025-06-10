const db = require('../config/db');

module.exports = {
  getAll: () => db.query('SELECT * FROM Rol'),
  getById: (id) => db.query('SELECT * FROM Rol WHERE id_rol = ?', [id])
};
