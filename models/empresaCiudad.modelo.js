const db = require('../config/db');

module.exports = {
  getAll: () => db.query('SELECT * FROM EmpresaCiudad'),
  getByEmpresa: (id) => db.query('SELECT * FROM EmpresaCiudad WHERE id_empresa = ?', [id])
};
