const db = require('../config/db');

const Terreno = {
  getTerrenosPorEmpresaYCiudad: async (idEmpresa, idCiudad) => {
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
    const [results] = await db.query(sql, [idEmpresa, idCiudad]);
    return results;
  },

  getTerrenosDeUsuariosIndependientes: async () => {
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
    const [results] = await db.query(sql);
    return results;
  },

  getTerrenoPorId: async (id) => {
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
    const [results] = await db.query(sql, [id]);
    return results[0];
  },

  getTodosLosTerrenos: async () => {
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
    const [results] = await db.query(sql);
    return results;
  },

  crearTerreno: async (data, imagenes) => {
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

    const [result] = await db.query(sql, [
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

  getTerrenosPorUsuario: async (idUsuario) => {
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
    const [results] = await db.query(sql, [idUsuario]);
    return results;
  },

  desactivarTerreno: async (id) => {
    const sql = `UPDATE Terreno SET estado = 0 WHERE id_terreno = ?`;
    const [result] = await db.query(sql, [id]);
    return { affectedRows: result.affectedRows };
  },

  actualizarTerreno: async (idTerreno, data, imagenes) => {
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

    await db.query(sqlUpdate, [
      titulo, descripcion, precio, enlace_ubicacion,
      tamano, servicios_basicos, id_ciudad, estado || 1, idTerreno
    ]);

    if (!imagenes || imagenes.length === 0) {
      return { message: 'Terreno actualizada sin cambiar imágenes' };
    }

    const sqlDeleteImgs = `DELETE FROM ImagenTerreno WHERE id_terreno = ?`;
    await db.query(sqlDeleteImgs, [idTerreno]);

    const sqlInsertImgs = `INSERT INTO ImagenTerreno (id_terreno, url_imagen) VALUES ?`;
    const valores = imagenes.map(img => [idTerreno, `/imagenes/terrenos/${img.filename}`]);
    await db.query(sqlInsertImgs, [valores]);

    return { message: 'Terreno actualizada con nuevas imágenes' };
  },
};

module.exports = Terreno;
