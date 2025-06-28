const db = require('../config/db');

module.exports = {
  getAll: async () => {
    const [results] = await db.query('SELECT * FROM ImagenAlquiler');
    return results;
  },
  getByAlquiler: async (id) => {
    const [results] = await db.query('SELECT * FROM ImagenAlquiler WHERE id_alquiler = ?', [id]);
    return results;
  }
};
