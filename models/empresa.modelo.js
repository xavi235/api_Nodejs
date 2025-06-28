const db = require('../config/db');

const Empresa = {};

Empresa.getEmpresasPorCiudad = async (idCiudad) => {
  const [rows] = await db.query(
    `SELECT e.* 
     FROM Empresa e
     JOIN EmpresaCiudad ec ON e.id_empresa = ec.id_empresa
     WHERE ec.id_ciudad = ?`,
    [idCiudad]
  );
  return rows;
};

module.exports = Empresa;