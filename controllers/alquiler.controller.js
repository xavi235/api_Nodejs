const Alquiler = require('../models/alquiler.modelo');

const getAlquileresPorEmpresaYCiudad = async (req, res) => {
  try {
    const { idEmpresa, idCiudad } = req.params;
    const alquileres = await Alquiler.getAlquileresPorEmpresaYCiudad(idEmpresa, idCiudad);

    const formateados = alquileres.map(alquiler => ({
      id_alquiler: alquiler.id_alquiler,
      titulo: alquiler.titulo,
      descripcion: alquiler.descripcion,
      precio: alquiler.precio,
      estado: alquiler.estado,
      fecha_publicacion: alquiler.fecha_publicacion,
      enlace_ubicacion: alquiler.enlace_ubicacion,
      habitaciones: alquiler.habitaciones,
      banos: alquiler.banos,
      cochera: alquiler.cochera,
      pisos: alquiler.pisos,
      imagenes: alquiler.imagenes ? alquiler.imagenes.split(',') : [],
      usuario: {
        id_usuario: alquiler.id_usuario,
        nombre_usuario: alquiler.nombre_usuario,
        correo: alquiler.correo,
        contacto: alquiler.contacto
      },
      ciudad: {
        id_ciudad: alquiler.id_ciudad,
        nombre_ciudad: alquiler.nombre_ciudad
      },
      empresa: alquiler.id_empresa ? {
        id_empresa: alquiler.id_empresa,
        nombre_empresa: alquiler.nombre_empresa,
        descripcion: alquiler.descripcion_empresa,
        telefono: alquiler.telefono_empresa,
        correo: alquiler.correo_empresa
      } : null
    }));

    res.json(formateados);
  } catch (error) {
    console.error('Error al obtener alquileres:', error);
    res.status(500).json({ message: 'Error al obtener alquileres' });
  }
};

const getAlquileresDeUsuariosIndependientes = async (req, res) => {
  try {
    const alquileres = await Alquiler.getAlquileresDeUsuariosIndependientes();
    const formateados = alquileres.map(item => ({
      id_alquiler: item.id_alquiler,
      titulo: item.titulo,
      descripcion: item.descripcion,
      precio: item.precio,
      estado: item.estado,
      fecha_publicacion: item.fecha_publicacion,
      enlace_ubicacion: item.enlace_ubicacion,
      ambientes: item.ambientes,
      banos: item.banos,
      imagenes: item.imagenes ? item.imagenes.split(',') : [],
      usuario: {
        id_usuario: item.id_usuario,
        nombre_usuario: item.nombre_usuario,
        correo: item.correo,
        contacto: item.contacto
      },
      ciudad: {
        id_ciudad: item.id_ciudad,
        nombre_ciudad: item.nombre_ciudad
      },
      empresa: item.id_empresa ? {
        id_empresa: item.id_empresa,
        nombre_empresa: item.nombre_empresa,
        descripcion: item.descripcion_empresa,
        telefono: item.telefono_empresa,
        correo: item.correo_empresa
      } : null
    }));
    res.json(formateados);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener alquileres independientes' });
  }
};

const getAlquilerPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const alquiler = await Alquiler.getAlquilerPorId(id);
    if (!alquiler) return res.status(404).json({ message: 'Alquiler no encontrado' });

    const formateado = {
      id_alquiler: alquiler.id_alquiler,
      titulo: alquiler.titulo,
      descripcion: alquiler.descripcion,
      precio_mensual: alquiler.precio_mensual,
      estado: alquiler.estado,
      fecha_publicacion: alquiler.fecha_publicacion,
      enlace_ubicacion: alquiler.enlace_ubicacion,
      amoblado: alquiler.amoblado,
      tiempo_minimo_meses: alquiler.tiempo_minimo_meses,
      incluye_servicios: alquiler.incluye_servicios,
      imagenes: alquiler.imagenes ? alquiler.imagenes.split(',') : [],
      usuario: {
        id_usuario: alquiler.id_usuario,
        nombre_usuario: alquiler.nombre_usuario,
        correo: alquiler.correo,
        contacto: alquiler.contacto
      },
      ciudad: {
        id_ciudad: alquiler.id_ciudad,
        nombre_ciudad: alquiler.nombre_ciudad
      }
    };

    res.json(formateado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTodosLosAlquileres = async (req, res) => {
  try {
    const alquileres = await Alquiler.getTodosLosAlquileres();
    const formateadas = alquileres.map(a => ({
      id_alquiler: a.id_alquiler,
      titulo: a.titulo,
      descripcion: a.descripcion,
      precio: a.precio,
      estado: a.estado,
      precio_mensual: a.precio_mensual,
      amoblado : a.amoblado,
      tiempo_minimo_meses: a.tiempo_minimo_meses,
      incluye_servicios: a.incluye_servicios,
      fecha_publicacion: a.fecha_publicacion,
      enlace_ubicacion: a.enlace_ubicacion,
      ambientes: a.ambientes,
      imagenes: a.imagenes ? a.imagenes.split(',') : [],
      usuario: {
        id_usuario: a.id_usuario,
        nombre_usuario: a.nombre_usuario,
        correo: a.correo,
        contacto: a.contacto
      },
      ciudad: {
        id_ciudad: a.id_ciudad,
        nombre_ciudad: a.nombre_ciudad
      },
      empresa: a.id_empresa ? {
        id_empresa: a.id_empresa,
        nombre_empresa: a.nombre_empresa,
        descripcion: a.descripcion_empresa,
        telefono: a.telefono_empresa
      } : null
    }));

    res.json(formateadas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearAlquiler = async (req, res) => {
  try {
    const nuevoAlquiler = await Alquiler.crearAlquiler(req.body, req.files);
    res.status(201).json({
      message: 'Alquiler creado exitosamente',
      id_alquiler: nuevoAlquiler.id_alquiler
    });
  } catch (error) {
    console.error('Error al crear el alquiler:', error);
    res.status(500).json({ error: 'Error al crear el alquiler' });
  }
};

const getAlquileresPorUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const alquileres = await Alquiler.getAlquileresPorUsuario(idUsuario);

    const formateados = alquileres.map(a => ({
      id_alquiler: a.id_alquiler,
      titulo: a.titulo,
      descripcion: a.descripcion,
      precio_mensual: a.precio_mensual,
      estado: a.estado,
      fecha_publicacion: a.fecha_publicacion,
      enlace_ubicacion: a.enlace_ubicacion,
      amoblado: a.amoblado,
      tiempo_minimo_meses: a.tiempo_minimo_meses,
      incluye_servicios: a.incluye_servicios,
      imagenes: a.imagenes ? a.imagenes.split(',') : [],
      usuario: {
        id_usuario: a.id_usuario,
        nombre_usuario: a.nombre_usuario,
        correo: a.correo,
        contacto: a.contacto
      },
      ciudad: {
        id_ciudad: a.id_ciudad,
        nombre_ciudad: a.nombre_ciudad
      },
      empresa: a.id_empresa ? {
        id_empresa: a.id_empresa,
        nombre_empresa: a.nombre_empresa,
        descripcion: a.descripcion_empresa,
        telefono: a.telefono_empresa,
        correo: a.correo_empresa
      } : null
    }));

    res.json(formateados);
  } catch (error) {
    console.error('Error al obtener alquileres por usuario:', error);
    res.status(500).json({ message: 'Error al obtener alquileres del usuario' });
  }
};

const desactivarAlquiler = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Alquiler.desactivarAlquiler(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Alquiler no encontrada' });
    }

    res.json({ message: 'Alquiler desactivada correctamente' });
  } catch (error) {
    console.error('Error al desactivar alquiler:', error);
    res.status(500).json({ message: 'Error al desactivar el alquiler' });
  }
};

const actualizarAlquiler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const imagenes = req.files;

    const resultado = await Alquiler.actualizarAlquiler(id, data, imagenes);
    res.json({ message: resultado.message });
  } catch (error) {
    console.error('Error al actualizar Alquiler:', error);
    res.status(500).json({ error: 'Error al actualizar Alquiler' });
  }
};


module.exports = {
  getAlquileresPorEmpresaYCiudad,getAlquileresDeUsuariosIndependientes,getAlquilerPorId,getTodosLosAlquileres,crearAlquiler,getAlquileresPorUsuario,desactivarAlquiler,actualizarAlquiler
};

