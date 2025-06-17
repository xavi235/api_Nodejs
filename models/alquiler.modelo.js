const db = require('../config/db');

const Alquiler = {
  getAlquileresPorEmpresaYCiudad: (idEmpresa, idCiudad) => {
    const sql = `
      SELECT 
        Alquiler.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.nombre AS nombre_ciudad,
        Empresa.id_empresa,
        Empresa.nombre AS nombre_empresa,
        Empresa.descripcion AS descripcion_empresa,
        Empresa.contacto AS telefono_empresa,
        Empresa.correo AS correo_empresa,
        GROUP_CONCAT(ImagenAlquiler.url_imagen) AS imagenes
      FROM Alquiler
      JOIN Usuario ON Alquiler.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Alquiler.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenAlquiler ON Alquiler.id_alquiler = ImagenAlquiler.id_alquiler
      WHERE Usuario.id_empresa = ? AND Alquiler.id_ciudad = ?
      GROUP BY Alquiler.id_alquiler;
    `;


    return new Promise((resolve, reject) => {
      db.query(sql, [idEmpresa, idCiudad], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getAlquileresDeUsuariosIndependientes: () => {
    const sql = `
      SELECT 
        Alquiler.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.id_ciudad,
        Ciudad.nombre AS nombre_ciudad,
        Empresa.id_empresa,
        Empresa.nombre AS nombre_empresa,
        Empresa.descripcion AS descripcion_empresa,
        Empresa.contacto AS telefono_empresa,
        Empresa.correo AS correo_empresa,
        GROUP_CONCAT(ImagenAlquiler.url_imagen) AS imagenes
      FROM Alquiler
      JOIN Usuario ON Alquiler.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Alquiler.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenAlquiler ON Alquiler.id_alquiler = ImagenAlquiler.id_alquiler
      WHERE Usuario.id_empresa IS NULL
      GROUP BY Alquiler.id_alquiler;
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getAlquilerPorId: (id) => {
    const sql = `
      SELECT 
        Alquiler.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.id_ciudad,
        Ciudad.nombre AS nombre_ciudad,
        GROUP_CONCAT(ImagenAlquiler.url_imagen) AS imagenes
      FROM Alquiler
      JOIN Usuario ON Alquiler.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Alquiler.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN ImagenAlquiler ON Alquiler.id_alquiler = ImagenAlquiler.id_alquiler
      WHERE Alquiler.id_alquiler = ?
      GROUP BY Alquiler.id_alquiler;
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },
 

  getTodosLosAlquileres: () => {
  const sql = `
    SELECT 
      Alquiler.*,
      Usuario.nombre_usuario,
      Usuario.correo,
      Usuario.contacto,
      Ciudad.nombre AS nombre_ciudad,
      Empresa.id_empresa,
      Empresa.nombre AS nombre_empresa,
      Empresa.descripcion AS descripcion_empresa,
      Empresa.contacto AS telefono_empresa,
      Empresa.correo AS correo_empresa,
      GROUP_CONCAT(ImagenAlquiler.url_imagen) AS imagenes
    FROM Alquiler
    JOIN Usuario ON Alquiler.id_usuario = Usuario.id_usuario
    LEFT JOIN Ciudad ON Alquiler.id_ciudad = Ciudad.id_ciudad
    LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
    LEFT JOIN ImagenAlquiler ON Alquiler.id_alquiler = ImagenAlquiler.id_alquiler
    GROUP BY Alquiler.id_alquiler;
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
},

crearAlquiler: (data, imagenes) => {
    return new Promise((resolve, reject) => {
      const {
        titulo,
        descripcion,
        precio_mensual,
        enlace_ubicacion,
        amoblado,
        tiempo_minimo_meses,
        incluye_servicios,
        id_usuario,
        id_ciudad
      } = data;

      const sql = `
        INSERT INTO Alquiler (
          titulo, descripcion, precio_mensual, fecha_publicacion,
          enlace_ubicacion, amoblado, tiempo_minimo_meses, incluye_servicios,
          id_usuario, id_ciudad
        ) VALUES (?, ?, ?, DEFAULT, ?, ?, ?, ?, ?, ?)
      `;

      db.query(sql, [
        titulo, descripcion, precio_mensual,
        enlace_ubicacion, amoblado, tiempo_minimo_meses, incluye_servicios,
        id_usuario, id_ciudad
      ], (err, result) => {
        if (err) return reject(err);

        const id_alquiler = result.insertId;

        if (!imagenes || imagenes.length === 0) return resolve({ id_alquiler });

        const sqlImagenes = `
          INSERT INTO ImagenAlquiler (id_alquiler, url_imagen)
          VALUES ?
        `;

        const valores = imagenes.map(img => [id_alquiler, `/imagenes/alquileres/${img.filename}`]);

        db.query(sqlImagenes, [valores], (err) => {
          if (err) return reject(err);
          resolve({ id_alquiler });
        });
      });
    });
  },
  getAlquileresPorUsuario: (idUsuario) => {
    const sql = `
      SELECT 
        Alquiler.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.id_ciudad,
        Ciudad.nombre AS nombre_ciudad,
        Empresa.id_empresa,
        Empresa.nombre AS nombre_empresa,
        Empresa.descripcion AS descripcion_empresa,
        Empresa.contacto AS telefono_empresa,
        Empresa.correo AS correo_empresa,
        GROUP_CONCAT(ImagenAlquiler.url_imagen) AS imagenes
      FROM Alquiler
      JOIN Usuario ON Alquiler.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Alquiler.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenAlquiler ON Alquiler.id_alquiler = ImagenAlquiler.id_alquiler
      WHERE Usuario.id_usuario = ?
      GROUP BY Alquiler.id_alquiler;
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [idUsuario], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },
};

module.exports = Alquiler;
