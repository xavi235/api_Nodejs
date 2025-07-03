const db = require('../config/db');

const Terreno = {
  async getTerrenosPorEmpresaYCiudad(idEmpresa, idCiudad) {
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
    const [results] = await db.execute(sql, [idEmpresa, idCiudad]);
    return results;
  },

  async getTerrenosDeUsuariosIndependientes() {
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
    const [results] = await db.execute(sql);
    return results;
  },

  async getTerrenoPorId(id) {
    const sql = `
      SELECT 
        Terreno.id_terreno,
        Terreno.titulo,
        Terreno.descripcion,
        Terreno.precio,
        Terreno.estado,
        Terreno.tamano,
        Terreno.servicios_basicos,
        Terreno.fecha_publicacion,
        Terreno.enlace_ubicacion,
        Terreno.id_usuario,
        Ciudad.id_ciudad,
        Ciudad.nombre AS nombre_ciudad,
        Usuario.nombre_usuario AS nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        GROUP_CONCAT(ImagenTerreno.url_imagen) AS imagenes
      FROM Terreno
      JOIN Usuario ON Terreno.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Terreno.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN ImagenTerreno ON Terreno.id_terreno = ImagenTerreno.id_terreno
      WHERE Terreno.id_terreno = ? AND Terreno.estado = 1
      GROUP BY Terreno.id_terreno;
    `;
    const [results] = await db.execute(sql, [id]);
    return results[0];
  },

  async getTodosLosTerrenos() {
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
    const [results] = await db.execute(sql);
    return results;
  },

  async crearTerreno(data, imagenes) {
    const {
      titulo,
      descripcion,
      precio,
      enlace_ubicacion,
      tamano,
      servicios_basicos,
      id_usuario,
    } = data;

    const id_ciudad = await getCiudadDeEmpresaPorUsuario(id_usuario);
    if (!id_ciudad) throw new Error('No se pudo determinar la ciudad de la empresa del usuario.');

    const sql = `
      INSERT INTO Terreno (
        titulo, descripcion, precio, fecha_publicacion,
        enlace_ubicacion, tamano, servicios_basicos,
        id_usuario, id_ciudad
      ) VALUES (?, ?, ?, DEFAULT, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      titulo, descripcion, precio,
      enlace_ubicacion, tamano, servicios_basicos,
      id_usuario, id_ciudad
    ]);

    const id_terreno = result.insertId;

    if (!imagenes || imagenes.length === 0) return { id_terreno };

    const sqlImagenes = `
      INSERT INTO ImagenTerreno (id_terreno, url_imagen)
      VALUES ?
    `;

    const valores = imagenes.map(img => [id_terreno, `/imagenes/terrenos/${img.filename}`]);

    await db.query(sqlImagenes, [valores]);

    return { id_terreno };
  },

  async getTerrenosPorUsuario(idUsuario) {
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
    const [results] = await db.execute(sql, [idUsuario]);
    return results;
  },

  async desactivarTerreno(id) {
    const sql = `UPDATE Terreno SET estado = 0 WHERE id_terreno = ?`;
    const [result] = await db.execute(sql, [id]);
    return { affectedRows: result.affectedRows };
  },

  async actualizarTerreno(idTerreno, data, imagenes) {
    const {
      titulo,
      descripcion,
      precio,
      enlace_ubicacion,
      tamano,
      servicios_basicos,
      id_ciudad,
      estado,
      imagenes_existentes
    } = data;

    const imagenesAConservar = typeof imagenes_existentes === 'string'
      ? JSON.parse(imagenes_existentes)
      : imagenes_existentes || [];

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

    await db.execute(sqlUpdate, [
      titulo, descripcion, precio, enlace_ubicacion,
      tamano, servicios_basicos, id_ciudad, estado || 1, idTerreno
    ]);

    let sqlDeleteImgs = `DELETE FROM ImagenTerreno WHERE id_terreno = ?`;
    let deleteParams = [idTerreno];

    if (imagenesAConservar.length > 0) {
      const placeholders = imagenesAConservar.map(() => '?').join(',');
      sqlDeleteImgs += ` AND url_imagen NOT IN (${placeholders})`;
      deleteParams = deleteParams.concat(imagenesAConservar);
    }

    await db.execute(sqlDeleteImgs, deleteParams);

    if (imagenes && imagenes.length > 0) {
      const sqlInsertImgs = `INSERT INTO ImagenTerreno (id_terreno, url_imagen) VALUES ?`;
      const valores = imagenes.map(img => [idTerreno, `/imagenes/terrenos/${img.filename}`]);
      await db.query(sqlInsertImgs, [valores]);
      return { message: 'Terreno actualizada con nuevas imágenes' };
    } else {
      return { message: 'Terreno actualizado (imagenes existentes conservados)' };
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
module.exports = Terreno;
