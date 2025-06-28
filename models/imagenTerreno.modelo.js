const db = require('../config/db');

module.exports = {
  getAll: async () => {
    const [results] = await db.query('SELECT * FROM ImagenTerreno');
    return results;
  },
  getByTerreno: async (id) => {
    const [results] = await db.query('SELECT * FROM ImagenTerreno WHERE id_terreno = ?', [id]);
    return results;
  }
};
