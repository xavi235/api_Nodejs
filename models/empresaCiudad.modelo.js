const db = require('../config/db');

module.exports = {
  getAll: async () => {
    const [results] = await db.query('SELECT * FROM EmpresaCiudad');
    return results;
  },
  getByEmpresa: async (id) => {
    const [results] = await db.query('SELECT * FROM EmpresaCiudad WHERE id_empresa = ?', [id]);
    return results;
  }
};
