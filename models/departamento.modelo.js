const db = require('../config/db');

const Departamento = {
  getDepartamentosPorEmpresaYCiudad: (idEmpresa, idCiudad) => {
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
    return new Promise((resolve, reject) => {
      db.query(sql, [idEmpresa, idCiudad], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getDepartamentosDeUsuariosIndependientes: () => {
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
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getDepartamentoPorId: (id) => {
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
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  getTodosLosDepartamentos: () => {
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
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
},

crearDepartamento: (data, imagenes) => {
    return new Promise((resolve, reject) => {
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

      db.query(sql, [
        titulo, descripcion, precio,
        enlace_ubicacion, habitaciones, banos, piso,
        id_usuario, id_ciudad
      ], (err, result) => {
        if (err) return reject(err);

        const id_departamento = result.insertId;

        if (!imagenes || imagenes.length === 0) return resolve({ id_departamento });

        const sqlImagenes = `
          INSERT INTO ImagenDepartamento (id_departamento, url_imagen)
          VALUES ?
        `;

        const valores = imagenes.map(img => [id_departamento, `/imagenes/departamentos/${img.filename}`]);

        db.query(sqlImagenes, [valores], (err) => {
          if (err) return reject(err);
          resolve({ id_departamento });
        });
      });
    });
  },
  getDepartamentosPorUsuario: (idUsuario) => {
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

  return new Promise((resolve, reject) => {
    db.query(sql, [idUsuario], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
},
desactivarDepartamento: (id) => {
  const sql = `UPDATE Departamento SET estado = 0 WHERE id_departamento = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve({ affectedRows: result.affectedRows });
    });
  });
}

};

module.exports = Departamento;
