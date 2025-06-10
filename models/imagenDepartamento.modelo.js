const db = require('../config/db');

module.exports = {
  getAll: () => db.query('SELECT * FROM ImagenDepartamento'),
  getByDepartamento: (id) => db.query('SELECT * FROM ImagenDepartamento WHERE id_departamento = ?', [id])
};
