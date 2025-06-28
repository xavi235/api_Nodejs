const db = require('../config/db');
const bcrypt = require('bcrypt');

const Usuario = {
  getTodosLosUsuarios: async () => {
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
    const [rows] = await db.query(sql);
    return rows;
  },

  getUsuariosPorCiudadConDetalles: async (idCiudad) => {
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
    const [rows] = await db.query(sql, [idCiudad]);
    return rows;
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

    const saltRounds = 10;
    const hash = await bcrypt.hash(contraseña, saltRounds);

    const sql = `
      INSERT INTO Usuario (
        nombre_usuario, correo, contraseña, contacto,
        id_rol, id_empresa, estado_usuario
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      nombre_usuario, correo, hash, contacto,
      id_rol, id_empresa, estado_usuario || 1
    ]);

    return { id_usuario: result.insertId };
  },

  loginUsuario: async (correo, contraseña) => {
    const sql = `SELECT * FROM Usuario WHERE correo = ?`;
    const [results] = await db.query(sql, [correo]);

    if (results.length === 0) return null; // Usuario no encontrado

    const usuario = results[0];
    const match = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!match) return null;

    delete usuario.contraseña;
    return usuario;
  }
};

module.exports = Usuario;
