const db = require('../config/db');

module.exports = {
  getAll: async () => {
    const [results] = await db.query('SELECT * FROM ImagenCasa');
    return results;
  },
  getByCasa: async (id) => {
    const [results] = await db.query('SELECT * FROM ImagenCasa WHERE id_casa = ?', [id]);
    return results;
  }
};
