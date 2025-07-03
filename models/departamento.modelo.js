const db = require('../config/db');

const Departamento = {
  async getDepartamentosPorEmpresaYCiudad(idEmpresa, idCiudad) {
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
    const [results] = await db.execute(sql, [idEmpresa, idCiudad]);
    return results;
  },

  async getDepartamentosDeUsuariosIndependientes() {
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
    const [results] = await db.execute(sql);
    return results;
  },

  async getDepartamentoPorId(id) {
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
    const [results] = await db.execute(sql, [id]);
    return results[0];
  },

  async getTodosLosDepartamentos() {
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
    const [results] = await db.execute(sql);
    return results;
  },

  async crearDepartamento(data, imagenes) {
    const {
      titulo,
      descripcion,
      precio,
      enlace_ubicacion,
      habitaciones,
      banos,
      piso,
      id_usuario,
    } = data;
    
    const id_ciudad = await getCiudadDeEmpresaPorUsuario(id_usuario);
    if (!id_ciudad) throw new Error('No se pudo determinar la ciudad de la empresa del usuario.');

    const sql = `
      INSERT INTO Departamento (
        titulo, descripcion, precio, fecha_publicacion,
        enlace_ubicacion, habitaciones, banos, piso,
        id_usuario, id_ciudad
      ) VALUES (?, ?, ?, DEFAULT, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
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

  async getDepartamentosPorUsuario(idUsuario) {
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
    const [results] = await db.execute(sql, [idUsuario]);
    return results;
  },

  async desactivarDepartamento(id) {
    const sql = `UPDATE Departamento SET estado = 0 WHERE id_departamento = ?`;
    const [result] = await db.execute(sql, [id]);
    return { affectedRows: result.affectedRows };
  },

  async actualizarDepartamento(idDepartamento, data, imagenes) {
    const {
      titulo,
      descripcion,
      precio,
      enlace_ubicacion,
      habitaciones,
      banos,
      piso,
      id_ciudad,
      estado,
      imagenes_existentes
    } = data;

    const imagenesAConservar = typeof imagenes_existentes === 'string' 
      ? JSON.parse(imagenes_existentes) 
      : imagenes_existentes || [];

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

    await db.execute(sqlUpdate, [
      titulo, descripcion, precio, enlace_ubicacion,
      habitaciones, banos, piso, id_ciudad, estado || 1, idDepartamento
    ]);

    let sqlDeleteImgs = `DELETE FROM ImagenDepartamento WHERE id_departamento = ?`;
    let deleteParams = [idDepartamento];

    if (imagenesAConservar.length > 0) {
      const placeholders = imagenesAConservar.map(() => '?').join(',');
      sqlDeleteImgs += ` AND url_imagen NOT IN (${placeholders})`;
      deleteParams = deleteParams.concat(imagenesAConservar);
    }

    await db.execute(sqlDeleteImgs, deleteParams);

    if (imagenes && imagenes.length > 0) {
      const sqlInsertImgs = `INSERT INTO ImagenDepartamento (id_departamento, url_imagen) VALUES ?`;
      const valores = imagenes.map(img => [idDepartamento, `/imagenes/departamentos/${img.filename}`]);
      await db.query(sqlInsertImgs, [valores]);
      return { message: 'Departamento actualizado con imágenes modificadas' };
    } else {
      return { message: 'Departamento actualizado (imágenes existentes conservadas)' };
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

module.exports = Departamento;
