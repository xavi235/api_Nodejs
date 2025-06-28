const db = require('../config/db');

module.exports = {
  getAll: async () => {
    const [results] = await db.query('SELECT * FROM ImagenDepartamento');
    return results;
  },
  getByDepartamento: async (id) => {
    const [results] = await db.query('SELECT * FROM ImagenDepartamento WHERE id_departamento = ?', [id]);
    return results;
  }
};
