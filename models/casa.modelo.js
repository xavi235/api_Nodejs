const db = require('../config/db');

const Casa = {
  getCasasPorEmpresaYCiudad: async (idEmpresa, idCiudad) => {
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
      WHERE Usuario.id_empresa = ? AND Casa.id_ciudad = ? AND Casa.estado = 1
      GROUP BY Casa.id_casa;
    `;

    const [results] = await db.query(sql, [idEmpresa, idCiudad]);
    return results;
  },

  getCasasDeUsuariosIndependientes: async () => {
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
        AND Casa.estado = 1
      GROUP BY Casa.id_casa;
    `;

    const [results] = await db.query(sql);
    return results;
  },

  getCasaPorId: async (id) => {
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
        AND Casa.estado = 1
      GROUP BY Casa.id_casa;
    `;
    const [results] = await db.query(sql, [id]);
    return results[0];
  },

  getTodasLasCasas: async () => {
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
      WHERE Casa.estado = 1
      GROUP BY Casa.id_casa;
    `;
    const [results] = await db.query(sql);
    return results;
  },

  crearCasa: async (data, imagenes) => {
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

    const [result] = await db.query(sql, [
      titulo, descripcion, precio,
      enlace_ubicacion, habitaciones, banos, cochera, pisos,
      id_usuario, id_ciudad
    ]);

    const id_casa = result.insertId;

    if (!imagenes || imagenes.length === 0) return { id_casa };

    const sqlImagenes = `
      INSERT INTO ImagenCasa (id_casa, url_imagen)
      VALUES ?
    `;

    const valores = imagenes.map(img => [id_casa, `/imagenes/casas/${img.filename}`]);

    await db.query(sqlImagenes, [valores]);

    return { id_casa };
  },

  getCasasPorUsuario: async (idUsuario) => {
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
        AND Casa.estado = 1
      GROUP BY Casa.id_casa;
    `;

    const [results] = await db.query(sql, [idUsuario]);
    return results;
  },

  desactivarCasa: async (id) => {
    const sql = `UPDATE Casa SET estado = 0 WHERE id_casa = ?`;
    const [result] = await db.query(sql, [id]);
    return { affectedRows: result.affectedRows };
  },

  actualizarCasa: async (idCasa, data, imagenes) => {
    const {
      titulo,
      descripcion,
      precio,
      enlace_ubicacion,
      habitaciones,
      banos,
      cochera,
      pisos,
      id_ciudad,
      estado
    } = data;

    const sqlUpdate = `
      UPDATE Casa SET
        titulo = ?,
        descripcion = ?,
        precio = ?,
        enlace_ubicacion = ?,
        habitaciones = ?,
        banos = ?,
        cochera = ?,
        pisos = ?,
        id_ciudad = ?,
        estado = ?
      WHERE id_casa = ?
    `;

    await db.query(sqlUpdate, [
      titulo, descripcion, precio, enlace_ubicacion,
      habitaciones, banos, cochera, pisos, id_ciudad, estado || 1, idCasa
    ]);

    if (!imagenes || imagenes.length === 0) {
      return { message: 'Casa actualizada sin cambiar imágenes' };
    }

    const sqlDeleteImgs = `DELETE FROM ImagenCasa WHERE id_casa = ?`;
    await db.query(sqlDeleteImgs, [idCasa]);

    const sqlInsertImgs = `INSERT INTO ImagenCasa (id_casa, url_imagen) VALUES ?`;
    const valores = imagenes.map(img => [idCasa, `/imagenes/casas/${img.filename}`]);
    await db.query(sqlInsertImgs, [valores]);

    return { message: 'Casa actualizada con nuevas imágenes' };
  },
};

module.exports = Casa;
