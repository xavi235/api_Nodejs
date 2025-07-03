const db = require('../config/db');

const Casa = {
  async getCasasPorEmpresaYCiudad(idEmpresa, idCiudad) {
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
    const [results] = await db.execute(sql, [idEmpresa, idCiudad]);
    return results;
  },

  async getCasasDeUsuariosIndependientes() {
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
    const [results] = await db.execute(sql);
    return results;
  },

  async getCasaPorId(id) {
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
    const [results] = await db.execute(sql, [id]);
    return results[0];
  },

  async getTodasLasCasas() {
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
    const [results] = await db.execute(sql);
    return results;
  },
  
  async crearCasa(data, imagenes) {
    const {
      titulo,
      descripcion,
      precio,
      enlace_ubicacion,
      habitaciones,
      banos,
      cochera,
      pisos,
      id_usuario
    } = data;

    const id_ciudad = await getCiudadDeEmpresaPorUsuario(id_usuario);
    if (!id_ciudad) throw new Error('No se pudo determinar la ciudad de la empresa del usuario.');

    const sql = `
      INSERT INTO Casa (
        titulo, descripcion, precio, fecha_publicacion,
        enlace_ubicacion, habitaciones, banos, cochera, pisos,
        id_usuario, id_ciudad
      ) VALUES (?, ?, ?, DEFAULT, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
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

  async getCasasPorUsuario(idUsuario) {
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
    const [results] = await db.execute(sql, [idUsuario]);
    return results;
  },

  async desactivarCasa(id) {
    const sql = `UPDATE Casa SET estado = 0 WHERE id_casa = ?`;
    const [result] = await db.execute(sql, [id]);
    return { affectedRows: result.affectedRows };
  },

  async actualizarCasa(idCasa, data, imagenes) {
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
      estado,
      imagenes_existentes
    } = data;

    const imagenesAConservar = typeof imagenes_existentes === 'string' 
      ? JSON.parse(imagenes_existentes) 
      : imagenes_existentes || [];

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

    await db.execute(sqlUpdate, [
      titulo, descripcion, precio, enlace_ubicacion,
      habitaciones, banos, cochera, pisos, id_ciudad, estado || 1, idCasa
    ]);

    let sqlDeleteImgs = `DELETE FROM ImagenCasa WHERE id_casa = ?`;
    let deleteParams = [idCasa];

    if (imagenesAConservar.length > 0) {
      const placeholders = imagenesAConservar.map(() => '?').join(',');
      sqlDeleteImgs += ` AND url_imagen NOT IN (${placeholders})`;
      deleteParams = deleteParams.concat(imagenesAConservar);
    }

    await db.execute(sqlDeleteImgs, deleteParams);

    if (imagenes && imagenes.length > 0) {
      const sqlInsertImgs = `INSERT INTO ImagenCasa (id_casa, url_imagen) VALUES ?`;
      const valores = imagenes.map(img => [idCasa, `/imagenes/casas/${img.filename}`]);
      await db.query(sqlInsertImgs, [valores]);
      return { message: 'Casa actualizada con imágenes modificadas' };
    } else {
      return { message: 'Casa actualizada (imágenes existentes conservadas)' };
    }
  }
};

const getCiudadDeEmpresaPorUsuario = async (idUsuario) => {
  const sql = `
    SELECT ec.id_ciudad
    FROM Usuario u
    JOIN EmpresaCiudad ec ON u.id_empresa = ec.id_empresa
    WHERE u.id_usuario = ?
    LIMIT 1
  `;
  const [rows] = await db.execute(sql, [idUsuario]);
  return rows.length > 0 ? rows[0].id_ciudad : null;
};

module.exports = Casa;
