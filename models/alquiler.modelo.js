const db = require('../config/db');

const Alquiler = {
  getAlquileresPorEmpresaYCiudad: async (idEmpresa, idCiudad) => {
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
      WHERE Usuario.id_empresa = ? AND Alquiler.id_ciudad = ? AND Alquiler.estado = 1
      GROUP BY Alquiler.id_alquiler;
    `;

    const [results] = await db.query(sql, [idEmpresa, idCiudad]);
    return results;
  },

  getAlquileresDeUsuariosIndependientes: async () => {
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
      WHERE Usuario.id_empresa IS NULL AND Alquiler.estado = 1
      GROUP BY Alquiler.id_alquiler;
    `;
    const [results] = await db.query(sql);
    return results;
  },

  getAlquilerPorId: async (id) => {
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
      WHERE Alquiler.id_alquiler = ? AND Alquiler.estado = 1
      GROUP BY Alquiler.id_alquiler;
    `;

    const [results] = await db.query(sql, [id]);
    return results[0];
  },

  getTodosLosAlquileres: async () => {
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
      WHERE Alquiler.estado = 1
      GROUP BY Alquiler.id_alquiler;
    `;
    const [results] = await db.query(sql);
    return results;
  },

  crearAlquiler: async (data, imagenes) => {
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

    const [result] = await db.query(sql, [
      titulo, descripcion, precio_mensual,
      enlace_ubicacion, amoblado, tiempo_minimo_meses, incluye_servicios,
      id_usuario, id_ciudad
    ]);

    const id_alquiler = result.insertId;

    if (!imagenes || imagenes.length === 0) return { id_alquiler };

    const sqlImagenes = `
      INSERT INTO ImagenAlquiler (id_alquiler, url_imagen)
      VALUES ?
    `;

    const valores = imagenes.map(img => [id_alquiler, `/imagenes/alquileres/${img.filename}`]);

    await db.query(sqlImagenes, [valores]);

    return { id_alquiler };
  },

  getAlquileresPorUsuario: async (idUsuario) => {
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
      WHERE Usuario.id_usuario = ? AND Alquiler.estado = 1
      GROUP BY Alquiler.id_alquiler;
    `;

    const [results] = await db.query(sql, [idUsuario]);
    return results;
  },

  desactivarAlquiler: async (id) => {
    const sql = `UPDATE Alquiler SET estado = 0 WHERE id_alquiler = ?`;
    const [result] = await db.query(sql, [id]);
    return { affectedRows: result.affectedRows };
  },

  actualizarAlquiler: async (idAlquiler, data, imagenes) => {
    const {
      titulo,
      descripcion,
      precio_mensual,
      enlace_ubicacion,
      amoblado,
      tiempo_minimo_meses,
      incluye_servicios,
      id_ciudad,
      estado
    } = data;

    const sqlUpdate = `
      UPDATE Alquiler SET
        titulo = ?,
        descripcion = ?,
        precio_mensual = ?,
        enlace_ubicacion = ?,
        amoblado = ?,
        tiempo_minimo_meses = ?,
        incluye_servicios = ?,
        id_ciudad = ?,
        estado = ?
      WHERE id_alquiler = ?
    `;

    await db.query(sqlUpdate, [
      titulo, descripcion, precio_mensual, enlace_ubicacion,
      amoblado, tiempo_minimo_meses, incluye_servicios, id_ciudad, estado || 1, idAlquiler
    ]);

    if (!imagenes || imagenes.length === 0) {
      return { message: 'alquiler actualizada sin cambiar imágenes' };
    }

    const sqlDeleteImgs = `DELETE FROM ImagenAlquiler WHERE id_alquiler = ?`;
    await db.query(sqlDeleteImgs, [idAlquiler]);

    const sqlInsertImgs = `INSERT INTO ImagenAlquiler (id_alquiler, url_imagen) VALUES ?`;
    const valores = imagenes.map(img => [idAlquiler, `/imagenes/alquileres/${img.filename}`]);
    await db.query(sqlInsertImgs, [valores]);

    return { message: 'alquiler actualizada con nuevas imágenes' };
  },
};

module.exports = Alquiler;
