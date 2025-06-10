const { Model, DataTypes } = require('sequelize');
const db = require('../db');

class Imagen extends Model {}

Imagen.init({
  id_imagen: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ruta_imagen: { type: DataTypes.STRING },
  id_propiedad: { type: DataTypes.INTEGER }
}, { sequelize: db, modelName: 'imagen' });

Imagen.belongsTo(Propiedad, { foreignKey: 'id_propiedad' });

module.exports = Imagen;
