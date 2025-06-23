const db = require('../config/db');

const Terreno = {
  getTerrenosPorEmpresaYCiudad: (idEmpresa, idCiudad) => {
    const sql = `
      SELECT 
        Terreno.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.nombre AS nombre_ciudad,
        Empresa.id_empresa,
        Empresa.nombre AS nombre_empresa,
        Empresa.descripcion AS descripcion_empresa,
        Empresa.contacto AS telefono_empresa,
        Empresa.correo AS correo_empresa,
        GROUP_CONCAT(ImagenTerreno.url_imagen) AS imagenes
      FROM Terreno
      JOIN Usuario ON Terreno.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Terreno.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenTerreno ON Terreno.id_terreno = ImagenTerreno.id_terreno
      WHERE Usuario.id_empresa = ? AND Terreno.id_ciudad = ? AND Terreno.estado = 1
      GROUP BY Terreno.id_terreno;
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [idEmpresa, idCiudad], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getTerrenosDeUsuariosIndependientes: () => {
    const sql = `
      SELECT 
        Terreno.*,
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
        GROUP_CONCAT(ImagenTerreno.url_imagen) AS imagenes
      FROM Terreno
      JOIN Usuario ON Terreno.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Terreno.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenTerreno ON Terreno.id_terreno = ImagenTerreno.id_terreno
      WHERE Usuario.id_empresa IS NULL AND Terreno.estado = 1
      GROUP BY Terreno.id_terreno;
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getTerrenoPorId: (id) => {
    const sql = `
      SELECT 
        Terreno.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.id_ciudad,
        Ciudad.nombre AS nombre_ciudad,
        GROUP_CONCAT(ImagenTerreno.url_imagen) AS imagenes
      FROM Terreno
      JOIN Usuario ON Terreno.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Terreno.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN ImagenTerreno ON Terreno.id_terreno = ImagenTerreno.id_terreno
      WHERE Terreno.id_terreno = ? AND Terreno.estado = 1
      GROUP BY Terreno.id_terreno;
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  getTodosLosTerrenos: () => {
  const sql = `
    SELECT 
      Terreno.*,
      Usuario.nombre_usuario,
      Usuario.correo,
      Usuario.contacto,
      Ciudad.nombre AS nombre_ciudad,
      Empresa.id_empresa,
      Empresa.nombre AS nombre_empresa,
      Empresa.descripcion AS descripcion_empresa,
      Empresa.contacto AS telefono_empresa,
      Empresa.correo AS correo_empresa,
      GROUP_CONCAT(ImagenTerreno.url_imagen) AS imagenes
    FROM Terreno
    JOIN Usuario ON Terreno.id_usuario = Usuario.id_usuario
    LEFT JOIN Ciudad ON Terreno.id_ciudad = Ciudad.id_ciudad
    LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
    LEFT JOIN ImagenTerreno ON Terreno.id_terreno = ImagenTerreno.id_terreno
    WHERE Terreno.estado = 1
    GROUP BY Terreno.id_terreno;
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
},

crearTerreno: (data, imagenes) => {
    return new Promise((resolve, reject) => {
      const {
        titulo,
        descripcion,
        precio,
        enlace_ubicacion,
        tamano,
        servicios_basicos,              
        id_usuario,
        id_ciudad
      } = data;

      const sql = `
        INSERT INTO Terreno (
          titulo, descripcion, precio, fecha_publicacion,
          enlace_ubicacion, tamano, servicios_basicos,
          id_usuario, id_ciudad
        ) VALUES (?, ?, ?, DEFAULT, ?, ?, ?, ?, ?)
      `;

      db.query(sql, [
        titulo, descripcion, precio,
        enlace_ubicacion, tamano, servicios_basicos,
        id_usuario, id_ciudad
      ], (err, result) => {
        if (err) return reject(err);

        const id_terreno = result.insertId;

        if (!imagenes || imagenes.length === 0) return resolve({ id_terreno });

        const sqlImagenes = `
          INSERT INTO ImagenTerreno (id_terreno, url_imagen)
          VALUES ?
        `;

        const valores = imagenes.map(img => [id_terreno, `/imagenes/terrenos/${img.filename}`]);

        db.query(sqlImagenes, [valores], (err) => {
          if (err) return reject(err);
          resolve({ id_terreno });
        });
      });
    });
  },
  getTerrenosPorUsuario: (idUsuario) => {
  const sql = `
    SELECT 
      Terreno.*,
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
      GROUP_CONCAT(ImagenTerreno.url_imagen) AS imagenes
    FROM Terreno
    JOIN Usuario ON Terreno.id_usuario = Usuario.id_usuario
    LEFT JOIN Ciudad ON Terreno.id_ciudad = Ciudad.id_ciudad
    LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
    LEFT JOIN ImagenTerreno ON Terreno.id_terreno = ImagenTerreno.id_terreno
    WHERE Usuario.id_usuario = ? AND Terreno.estado = 1
    GROUP BY Terreno.id_terreno;
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [idUsuario], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
},

desactivarTerreno: (id) => {
  const sql = `UPDATE Terreno SET estado = 0 WHERE id_terreno = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve({ affectedRows: result.affectedRows });
    });
  });
},

actualizarTerreno: (idTerreno, data, imagenes) => {
  return new Promise((resolve, reject) => {
    const {
      titulo,
      descripcion,
      precio,
      enlace_ubicacion,
      tamano,
      servicios_basicos,
      id_ciudad,
      estado
    } = data;

    const sqlUpdate = `
      UPDATE Terreno SET
        titulo = ?,
        descripcion = ?,
        precio = ?,
        enlace_ubicacion = ?,
        tamano = ?,
        servicios_basicos = ?,
        id_ciudad = ?,
        estado = ?
      WHERE id_terreno = ?
    `;

    db.query(sqlUpdate, [
      titulo, descripcion, precio, enlace_ubicacion,
      tamano, servicios_basicos, id_ciudad, estado || 1, idTerreno
    ], (err, result) => {
      if (err) return reject(err);

      if (!imagenes || imagenes.length === 0) {
        return resolve({ message: 'Terreno actualizada sin cambiar imágenes' });
      }

      const sqlDeleteImgs = `DELETE FROM ImagenTerreno WHERE id_terreno = ?`;

      db.query(sqlDeleteImgs, [idTerreno], (err) => {
        if (err) return reject(err);

        const sqlInsertImgs = `INSERT INTO ImagenTerreno (id_terreno, url_imagen) VALUES ?`;
        const valores = imagenes.map(img => [idTerreno, `/imagenes/terrenos/${img.filename}`]);
        db.query(sqlInsertImgs, [valores], (err) => {
          if (err) return reject(err);
          resolve({ message: 'Terreno actualizada con nuevas imágenes' });
        });
      });
    });
  });
},


};

module.exports = Terreno;
