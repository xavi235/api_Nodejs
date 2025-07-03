const db = require('../config/db');

const Alquiler = {
  async getAlquileresPorEmpresaYCiudad(idEmpresa, idCiudad) {
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
    const [results] = await db.execute(sql, [idEmpresa, idCiudad]);
    return results;
  },

  async getAlquileresDeUsuariosIndependientes() {
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
    const [results] = await db.execute(sql);
    return results;
  },

  async getAlquilerPorId(id) {
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
    const [results] = await db.execute(sql, [id]);
    return results[0];
  },

  async getTodosLosAlquileres() {
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
    const [results] = await db.execute(sql);
    return results;
  },

  async crearAlquiler(data, imagenes) {
    const {
      titulo,
      descripcion,
      precio_mensual,
      enlace_ubicacion,
      amoblado,
      tiempo_minimo_meses,
      incluye_servicios,
      id_usuario,
    } = data;

    const id_ciudad = await getCiudadDeEmpresaPorUsuario(id_usuario);
    if (!id_ciudad) throw new Error('No se pudo determinar la ciudad de la empresa del usuario.');

    const sql = `
      INSERT INTO Alquiler (
        titulo, descripcion, precio_mensual, fecha_publicacion,
        enlace_ubicacion, amoblado, tiempo_minimo_meses, incluye_servicios,
        id_usuario, id_ciudad
      ) VALUES (?, ?, ?, DEFAULT, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
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

  async getAlquileresPorUsuario(idUsuario) {
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
    const [results] = await db.execute(sql, [idUsuario]);
    return results;
  },

  async desactivarAlquiler(id) {
    const sql = `UPDATE Alquiler SET estado = 0 WHERE id_alquiler = ?`;
    const [result] = await db.execute(sql, [id]);
    return { affectedRows: result.affectedRows };
  },

  async actualizarAlquiler(idAlquiler, data, imagenes) {
    const {
      titulo,
      descripcion,
      precio_mensual,
      enlace_ubicacion,
      amoblado,
      tiempo_minimo_meses,
      incluye_servicios,
      id_ciudad,
      estado,
      imagenes_existentes
    } = data;

    const imagenesAConservar = typeof imagenes_existentes === 'string' 
      ? JSON.parse(imagenes_existentes) 
      : imagenes_existentes || [];

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

    await db.execute(sqlUpdate, [
      titulo, descripcion, precio_mensual, enlace_ubicacion,
      amoblado, tiempo_minimo_meses, incluye_servicios, id_ciudad, estado || 1, idAlquiler
    ]);

    // Eliminar imágenes no conservadas
    let sqlDeleteImgs = `DELETE FROM ImagenAlquiler WHERE id_alquiler = ?`;
    let deleteParams = [idAlquiler];

    if (imagenesAConservar.length > 0) {
      const placeholders = imagenesAConservar.map(() => '?').join(',');
      sqlDeleteImgs += ` AND url_imagen NOT IN (${placeholders})`;
      deleteParams = deleteParams.concat(imagenesAConservar);
    }

    await db.execute(sqlDeleteImgs, deleteParams);

    // Insertar nuevas imágenes
    if (imagenes && imagenes.length > 0) {
      const sqlInsertImgs = `INSERT INTO ImagenAlquiler (id_alquiler, url_imagen) VALUES ?`;
      const valores = imagenes.map(img => [idAlquiler, `/imagenes/alquileres/${img.filename}`]);
      await db.query(sqlInsertImgs, [valores]);
      return { message: 'Alquiler actualizado con imágenes modificadas' };
    } else {
      return { message: 'Alquiler actualizado (imágenes existentes conservadas)' };
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

module.exports = Alquiler;
