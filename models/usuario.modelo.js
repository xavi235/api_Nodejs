const db = require('../config/db');
const bcrypt = require('bcrypt');


const Usuario = {
  getTodosLosUsuarios: () => {
    const sql = `
      SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.correo,
        u.estado_usuario,
        u.contacto,
        u.id_rol,
        r.nombre AS nombre_rol,
        u.id_empresa,
        e.nombre AS nombre_empresa
      FROM Usuario u
      LEFT JOIN Rol r ON u.id_rol = r.id_rol
      LEFT JOIN Empresa e ON u.id_empresa = e.id_empresa
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getUsuariosPorCiudadConDetalles: (idCiudad) => {
    const sql = `
      SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.correo,
        u.contraseña,
        u.estado_usuario,
        u.contacto,
        u.id_rol,
        r.nombre AS nombre_rol,
        r.descripcion AS descripcion_rol,
        u.id_empresa,
        e.nombre AS nombre_empresa,
        e.descripcion AS descripcion_empresa,
        e.contacto AS contacto_empresa,
        e.correo AS correo_empresa
      FROM Usuario u
      JOIN Empresa e ON u.id_empresa = e.id_empresa
      JOIN EmpresaCiudad ec ON e.id_empresa = ec.id_empresa
      JOIN Rol r ON u.id_rol = r.id_rol
      WHERE ec.id_ciudad = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [idCiudad], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  crearUsuario: async (data) => {
    const {
      nombre_usuario,
      correo,
      contraseña,
      contacto,
      id_rol,
      id_empresa,
      estado_usuario
    } = data;

    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(contraseña, saltRounds);

      const sql = `
        INSERT INTO Usuario (
          nombre_usuario, correo, contraseña, contacto,
          id_rol, id_empresa, estado_usuario
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      return new Promise((resolve, reject) => {
        db.query(sql, [
          nombre_usuario, correo, hash, contacto,
          id_rol, id_empresa, estado_usuario || 1 // por defecto activo
        ], (err, result) => {
          if (err) reject(err);
          else resolve({ id_usuario: result.insertId });
        });
      });
    } catch (err) {
      throw err;
    }
  },

  loginUsuario: (correo, contraseña) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Usuario WHERE correo = ?`;
      db.query(sql, [correo], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null); // Usuario no encontrado

        const usuario = results[0];

        bcrypt.compare(contraseña, usuario.contraseña, (err, match) => {
          if (err) return reject(err);
          if (!match) return resolve(null);

          delete usuario.contraseña;
          resolve(usuario);
        });
      });
    });
  }
};

module.exports = Usuario;
