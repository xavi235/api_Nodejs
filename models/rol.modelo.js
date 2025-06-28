const db = require('../config/db');

module.exports = {
  getAll: async () => {
    const [results] = await db.query('SELECT * FROM Rol');
    return results;
  },
  getById: async (id) => {
    const [results] = await db.query('SELECT * FROM Rol WHERE id_rol = ?', [id]);
    return results;
  }
};
