const Usuario = require('../models/usuario.modelo');

const getTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.getTodosLosUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};


const getUsuariosPorCiudadConDetalles = async (req, res) => {
  const { idCiudad } = req.params;

  try {
    const usuariosRaw = await Usuario.getUsuariosPorCiudadConDetalles(idCiudad);

    const usuariosOrdenados = usuariosRaw.map(u => ({
      id_usuario: u.id_usuario,
      nombre_usuario: u.nombre_usuario,
      correo: u.correo,
      contraseña: u.contraseña,
      estado_usuario: u.estado_usuario,
      contacto: u.contacto,
      id_rol: u.id_rol,
      nombre_rol: u.nombre_rol,
      descripcion_rol: u.descripcion_rol,
      id_empresa: u.id_empresa,
      nombre_empresa: u.nombre_empresa,
      descripcion_empresa: u.descripcion_empresa,
      contacto_empresa: u.contacto_empresa,
      correo_empresa: u.correo_empresa
    }));

    res.json(usuariosOrdenados);
  } catch (error) {
    console.error('Error al obtener usuarios con detalles por ciudad:', error);
    res.status(500).json({ error: 'Error al obtener usuarios con detalles por ciudad' });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.crearUsuario(req.body);
    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      id_usuario: nuevoUsuario.id_usuario
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

const iniciarSesion = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.loginUsuario(correo, contraseña);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    res.json({ mensaje: 'Inicio de sesión exitoso', usuario });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};


module.exports = {
  getTodosLosUsuarios,getUsuariosPorCiudadConDetalles,crearUsuario,iniciarSesion
};
