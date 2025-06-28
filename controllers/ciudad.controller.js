const db = require('../config/db');

const getCiudades = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Ciudad');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener ciudades:', err);
    res.status(500).json({ error: 'Error al obtener ciudades' });
  }
};

module.exports = {
  getCiudades,
};
