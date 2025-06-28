const db = require('../config/db');

const Departamento = {
  getDepartamentosPorEmpresaYCiudad: async (idEmpresa, idCiudad) => {
    const sql = `
      SELECT 
        Departamento.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.nombre AS nombre_ciudad,
        Empresa.id_empresa,
        Empresa.nombre AS nombre_empresa,
        Empresa.descripcion AS descripcion_empresa,
        Empresa.contacto AS telefono_empresa,
        Empresa.correo AS correo_empresa,
        GROUP_CONCAT(ImagenDepartamento.url_imagen) AS imagenes
      FROM Departamento
      JOIN Usuario ON Departamento.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Departamento.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenDepartamento ON Departamento.id_departamento = ImagenDepartamento.id_departamento
      WHERE Usuario.id_empresa = ? AND Departamento.id_ciudad = ? AND Departamento.estado = 1
      GROUP BY Departamento.id_departamento;
    `;
    const [results] = await db.query(sql, [idEmpresa, idCiudad]);
    return results;
  },

  getDepartamentosDeUsuariosIndependientes: async () => {
    const sql = `
      SELECT 
        Departamento.*,
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
        GROUP_CONCAT(ImagenDepartamento.url_imagen) AS imagenes
      FROM Departamento
      JOIN Usuario ON Departamento.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Departamento.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenDepartamento ON Departamento.id_departamento = ImagenDepartamento.id_departamento
      WHERE Usuario.id_empresa IS NULL AND Departamento.estado = 1
      GROUP BY Departamento.id_departamento;
    `;
    const [results] = await db.query(sql);
    return results;
  },

  getDepartamentoPorId: async (id) => {
    const sql = `
      SELECT 
        Departamento.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.id_ciudad,
        Ciudad.nombre AS nombre_ciudad,
        GROUP_CONCAT(ImagenDepartamento.url_imagen) AS imagenes
      FROM Departamento
      JOIN Usuario ON Departamento.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Departamento.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN ImagenDepartamento ON Departamento.id_departamento = ImagenDepartamento.id_departamento
      WHERE Departamento.id_departamento = ? AND Departamento.estado = 1
      GROUP BY Departamento.id_departamento;
    `;
    const [results] = await db.query(sql, [id]);
    return results[0];
  },

  getTodosLosDepartamentos: async () => {
    const sql = `
      SELECT 
        Departamento.*,
        Usuario.nombre_usuario,
        Usuario.correo,
        Usuario.contacto,
        Ciudad.nombre AS nombre_ciudad,
        Empresa.id_empresa,
        Empresa.nombre AS nombre_empresa,
        Empresa.descripcion AS descripcion_empresa,
        Empresa.contacto AS telefono_empresa,
        Empresa.correo AS correo_empresa,
        GROUP_CONCAT(ImagenDepartamento.url_imagen) AS imagenes
      FROM Departamento
      JOIN Usuario ON Departamento.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Departamento.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenDepartamento ON Departamento.id_departamento = ImagenDepartamento.id_departamento
      WHERE Departamento.estado = 1
      GROUP BY Departamento.id_departamento;
    `;
    const [results] = await db.query(sql);
    return results;
  },

  crearDepartamento: async (data, imagenes) => {
    const {
      titulo,
      descripcion,
      precio,
      enlace_ubicacion,
      habitaciones,
      banos,
      piso,
      id_usuario,
      id_ciudad
    } = data;

    const sql = `
      INSERT INTO Departamento (
        titulo, descripcion, precio, fecha_publicacion,
        enlace_ubicacion, habitaciones, banos, piso,
        id_usuario, id_ciudad
      ) VALUES (?, ?, ?, DEFAULT, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      titulo, descripcion, precio,
      enlace_ubicacion, habitaciones, banos, piso,
      id_usuario, id_ciudad
    ]);

    const id_departamento = result.insertId;

    if (!imagenes || imagenes.length === 0) return { id_departamento };

    const sqlImagenes = `
      INSERT INTO ImagenDepartamento (id_departamento, url_imagen)
      VALUES ?
    `;

    const valores = imagenes.map(img => [id_departamento, `/imagenes/departamentos/${img.filename}`]);

    await db.query(sqlImagenes, [valores]);

    return { id_departamento };
  },

  getDepartamentosPorUsuario: async (idUsuario) => {
    const sql = `
      SELECT 
        Departamento.*,
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
        GROUP_CONCAT(ImagenDepartamento.url_imagen) AS imagenes
      FROM Departamento
      JOIN Usuario ON Departamento.id_usuario = Usuario.id_usuario
      LEFT JOIN Ciudad ON Departamento.id_ciudad = Ciudad.id_ciudad
      LEFT JOIN Empresa ON Usuario.id_empresa = Empresa.id_empresa
      LEFT JOIN ImagenDepartamento ON Departamento.id_departamento = ImagenDepartamento.id_departamento
      WHERE Usuario.id_usuario = ? AND Departamento.estado = 1
      GROUP BY Departamento.id_departamento;
    `;

    const [results] = await db.query(sql, [idUsuario]);
    return results;
  },

  desactivarDepartamento: async (id) => {
    const sql = `UPDATE Departamento SET estado = 0 WHERE id_departamento = ?`;
    const [result] = await db.query(sql, [id]);
    return { affectedRows: result.affectedRows };
  },

  actualizarDepartamento: async (idDepartamento, data, imagenes) => {
    const {
      titulo,
      descripcion,
      precio,
      enlace_ubicacion,
      habitaciones,
      banos,
      piso,
      id_ciudad,
      estado
    } = data;

    const sqlUpdate = `
      UPDATE Departamento SET
        titulo = ?,
        descripcion = ?,
        precio = ?,
        enlace_ubicacion = ?,
        habitaciones = ?,
        banos = ?,
        piso = ?,
        id_ciudad = ?,
        estado = ?
      WHERE id_departamento = ?
    `;

    await db.query(sqlUpdate, [
      titulo, descripcion, precio, enlace_ubicacion,
      habitaciones, banos, piso, id_ciudad, estado || 1, idDepartamento
    ]);

    if (!imagenes || imagenes.length === 0) {
      return { message: 'departamento actualizada sin cambiar imágenes' };
    }

    const sqlDeleteImgs = `DELETE FROM ImagenDepartamento WHERE id_departamento = ?`;
    await db.query(sqlDeleteImgs, [idDepartamento]);

    const sqlInsertImgs = `INSERT INTO ImagenDepartamento (id_departamento, url_imagen) VALUES ?`;
    const valores = imagenes.map(img => [idDepartamento, `/imagenes/departamentos/${img.filename}`]);
    await db.query(sqlInsertImgs, [valores]);

    return { message: 'Departamento actualizado con nuevas imágenes' };
  },
};

module.exports = Departamento;
