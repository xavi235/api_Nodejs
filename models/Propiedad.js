const { Model, DataTypes } = require('sequelize');
const db = require('../db');

class Propiedad extends Model {}

Propiedad.init({
  id_propiedad: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING },
  descripcion: { type: DataTypes.STRING },
  tamano: { type: DataTypes.INTEGER },
  precio_min: { type: DataTypes.FLOAT },
  precio_max: { type: DataTypes.FLOAT },
  estado: { type: DataTypes.INTEGER },
  Enlace_ubicacion: { type: DataTypes.STRING },
  id_usuario: { type: DataTypes.INTEGER },
  id_ubicacion: { type: DataTypes.INTEGER },
  id_tipo: { type: DataTypes.INTEGER },
}, { sequelize: db, modelName: 'propiedad' });

Propiedad.associate = models => {
  Propiedad.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
  Propiedad.belongsTo(models.Ubicacion, { foreignKey: 'id_ubicacion' });
  Propiedad.belongsTo(models.TipoPropiedad, { foreignKey: 'id_tipo' });
  Propiedad.hasMany(models.Imagen, { foreignKey: 'id_propiedad' });
};

module.exports = Propiedad;
