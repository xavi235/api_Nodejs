const db = require('../config/db');

const Casa = {
  getCasasPorEmpresaYCiudad: (idEmpresa, idCiudad) => {
    const sql = `
      SELECT 
        Casa.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.nombre AS nombre_ciudad,
        Empresa.id_empresa,
        Empresa.nombre AS nombre_empresa,
        Empresa.descripcion AS descripcion_empresa,
        Empresa.contacto AS telefono_empresa,
        Empresa.correo AS correo_empresa,
        GROUP_CONCAT(ImagenCasa.url_imagen) AS imagenes
      FROM Casa
      JOIN Usuario ON Casa.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Casa.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenCasa ON Casa.id_casa = ImagenCasa.id_casa
      WHERE Usuario.id_empresa = ? AND Casa.id_ciudad = ?
      GROUP BY Casa.id_casa;
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [idEmpresa, idCiudad], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getCasasDeUsuariosIndependientes: () => {
    const sql = `
      SELECT 
        Casa.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.nombre AS nombre_ciudad,
        Empresa.id_empresa,
        Empresa.nombre AS nombre_empresa,
        Empresa.descripcion AS descripcion_empresa,
        Empresa.contacto AS telefono_empresa,
        Empresa.correo AS correo_empresa,
        GROUP_CONCAT(ImagenCasa.url_imagen) AS imagenes
      FROM Casa
      JOIN Usuario ON Casa.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Casa.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenCasa ON Casa.id_casa = ImagenCasa.id_casa
      WHERE Usuario.id_empresa IS NULL
      GROUP BY Casa.id_casa;
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getCasaPorId: (id) => {
    const sql = `
      SELECT 
        Casa.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.id_ciudad,
        Ciudad.nombre AS nombre_ciudad,
        GROUP_CONCAT(ImagenCasa.url_imagen) AS imagenes
      FROM Casa
      JOIN Usuario ON Casa.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Casa.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN ImagenCasa ON Casa.id_casa = ImagenCasa.id_casa
      WHERE Casa.id_casa = ?
      GROUP BY Casa.id_casa;
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  getTodasLasCasas: () => {
  const sql = `
    SELECT 
      Casa.*,
      Usuario.nombre_usuario,
      Usuario.correo,
      Usuario.contacto,
      Ciudad.nombre AS nombre_ciudad,
      Empresa.id_empresa,
      Empresa.nombre AS nombre_empresa,
      Empresa.descripcion AS descripcion_empresa,
      Empresa.contacto AS telefono_empresa,
      Empresa.correo AS correo_empresa,
      GROUP_CONCAT(ImagenCasa.url_imagen) AS imagenes
    FROM Casa
    JOIN Usuario ON Casa.id_usuario = Usuario.id_usuario
    LEFT JOIN Ciudad ON Casa.id_ciudad = Ciudad.id_ciudad
    LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
    LEFT JOIN ImagenCasa ON Casa.id_casa = ImagenCasa.id_casa
    GROUP BY Casa.id_casa;
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
},

crearCasa: (data, imagenes) => {
  return new Promise((resolve, reject) => {
    const {
      titulo,
      descripcion,
      precio,
      enlace_ubicacion,
      habitaciones,
      banos,
      cochera,
      pisos,
      id_usuario,
      id_ciudad
    } = data;

    const sql = `
      INSERT INTO Casa (
        titulo, descripcion, precio, fecha_publicacion,
        enlace_ubicacion, habitaciones, banos, cochera, pisos,
        id_usuario, id_ciudad
      ) VALUES (?, ?, ?, DEFAULT, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      titulo, descripcion, precio,
      enlace_ubicacion, habitaciones, banos, cochera, pisos,
      id_usuario, id_ciudad
    ], (err, result) => {
      if (err) return reject(err);

      const id_casa = result.insertId;

      if (!imagenes || imagenes.length === 0) return resolve({ id_casa });

      const sqlImagenes = `
        INSERT INTO ImagenCasa (id_casa, url_imagen)
        VALUES ?
      `;

      const valores = imagenes.map(img => [id_casa, `/imagenes/casas/${img.filename}`]);

      db.query(sqlImagenes, [valores], (err) => {
        if (err) return reject(err);
        resolve({ id_casa });
      });
    });
  });
},

getCasasPorUsuario: (idUsuario) => {
  const sql = `
    SELECT 
      Casa.*,
      Usuario.nombre_usuario,
      Usuario.correo,
      Usuario.contacto,
      Ciudad.nombre AS nombre_ciudad,
      Empresa.id_empresa,
      Empresa.nombre AS nombre_empresa,
      Empresa.descripcion AS descripcion_empresa,
      Empresa.contacto AS telefono_empresa,
      Empresa.correo AS correo_empresa,
      GROUP_CONCAT(ImagenCasa.url_imagen) AS imagenes
    FROM Casa
    JOIN Usuario ON Casa.id_usuario = Usuario.id_usuario
    LEFT JOIN Ciudad ON Casa.id_ciudad = Ciudad.id_ciudad
    LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
    LEFT JOIN ImagenCasa ON Casa.id_casa = ImagenCasa.id_casa
    WHERE Usuario.id_usuario = ?
    GROUP BY Casa.id_casa;
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [idUsuario], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}
};


module.exports = Casa;
