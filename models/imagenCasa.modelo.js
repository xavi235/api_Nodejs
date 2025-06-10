const db = require('../config/db');

module.exports = {
  getAll: () => db.query('SELECT * FROM ImagenCasa'),
  getByCasa: (id) => db.query('SELECT * FROM ImagenCasa WHERE id_casa = ?', [id])
};
