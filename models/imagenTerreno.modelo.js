const db = require('../config/db');

module.exports = {
  getAll: () => db.query('SELECT * FROM ImagenTerreno'),
  getByTerreno: (id) => db.query('SELECT * FROM ImagenTerreno WHERE id_terreno = ?', [id])
};
