const db = require('../config/db');

const Ciudad = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM ciudad');
    return rows;
  }
};

module.exports = Ciudad;