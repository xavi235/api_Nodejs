const Terreno = require('../models/terreno.modelo');

const getTerrenosPorEmpresaYCiudad = async (req, res) => {
  try {
    const { idEmpresa, idCiudad } = req.params;
    const terrenos = await Terreno.getTerrenosPorEmpresaYCiudad(idEmpresa, idCiudad);

    const formateados = terrenos.map(terreno => ({
      id_terreno: terreno.id_terreno,
      titulo: terreno.titulo,
      descripcion: terreno.descripcion,
      precio: terreno.precio,
      estado: terreno.estado,
      fecha_publicacion: terreno.fecha_publicacion,
      enlace_ubicacion: terreno.enlace_ubicacion,
      imagenes: terreno.imagenes ? terreno.imagenes.split(',') : [],
      usuario: {
        id_usuario: terreno.id_usuario,
        nombre_usuario: terreno.nombre_usuario,
        correo: terreno.correo,
        contacto: terreno.contacto
      },
      ciudad: {
        id_ciudad: terreno.id_ciudad,
        nombre_ciudad: terreno.nombre_ciudad
      },
      empresa: terreno.id_empresa ? {
        id_empresa: terreno.id_empresa,
        nombre_empresa: terreno.nombre_empresa,
        descripcion: terreno.descripcion_empresa,
        telefono: terreno.telefono_empresa,
        correo: terreno.correo_empresa
      } : null
    }));

    res.json(formateados);
  } catch (error) {
    console.error('Error al obtener terrenos:', error);
    res.status(500).json({ message: 'Error al obtener terrenos' });
  }
};

const getTerrenosDeUsuariosIndependientes = async (req, res) => {
  try {
    const terrenos = await Terreno.getTerrenosDeUsuariosIndependientes();
    const formateados = terrenos.map(item => ({
      id_terreno: item.id_terreno,
      titulo: item.titulo,
      descripcion: item.descripcion,
      precio: item.precio,
      estado: item.estado,
      fecha_publicacion: item.fecha_publicacion,
      enlace_ubicacion: item.enlace_ubicacion,
      superficie: item.superficie,
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
    res.status(500).json({ error: 'Error al obtener terrenos independientes' });
  }
};

const getTerrenoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const terreno = await Terreno.getTerrenoPorId(id);
    if (!terreno) return res.status(404).json({ message: 'Terreno no encontrado' });

    const formateado = {
      id_terreno: terreno.id_terreno,
      titulo: terreno.titulo,
      descripcion: terreno.descripcion,
      precio: terreno.precio,
      estado: terreno.estado,
      fecha_publicacion: terreno.fecha_publicacion,
      enlace_ubicacion: terreno.enlace_ubicacion,
      superficie: terreno.superficie,
      imagenes: terreno.imagenes ? terreno.imagenes.split(',') : [],
      usuario: {
        id_usuario: terreno.id_usuario,
        nombre_usuario: terreno.nombre_usuario,
        correo: terreno.correo,
        contacto: terreno.contacto
      },
      ciudad: {
        id_ciudad: terreno.id_ciudad,
        nombre_ciudad: terreno.nombre_ciudad
      }
    };

    res.json(formateado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTodosLosTerrenos = async (req, res) => {
  try {
    const terrenos = await Terreno.getTodosLosTerrenos();
    const formateadas = terrenos.map(t => ({
      id_terreno: t.id_terreno,
      titulo: t.titulo,
      descripcion: t.descripcion,
      precio: t.precio,
      estado: t.estado,
      fecha_publicacion: t.fecha_publicacion,
      enlace_ubicacion: t.enlace_ubicacion,
      superficie: t.superficie,
      imagenes: t.imagenes ? t.imagenes.split(',') : [],
      usuario: {
        id_usuario: t.id_usuario,
        nombre_usuario: t.nombre_usuario,
        correo: t.correo,
        contacto: t.contacto
      },
      ciudad: {
        id_ciudad: t.id_ciudad,
        nombre_ciudad: t.nombre_ciudad
      },
      empresa: t.id_empresa ? {
        id_empresa: t.id_empresa,
        nombre_empresa: t.nombre_empresa,
        descripcion: t.descripcion_empresa,
        telefono: t.telefono_empresa
      } : null
    }));

    res.json(formateadas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearTerreno = async (req, res) => {
  try {
    const nuevoTerreno = await Terreno.crearTerreno(req.body, req.files);
    res.status(201).json({
      message: 'Terreno creado exitosamente',
      id_terreno: nuevoTerreno.id_terreno
    });
  } catch (error) {
    console.error('Error al crear el terreno:', error);
    res.status(500).json({ error: 'Error al crear el terreno' });
  }
};

module.exports = {
  getTerrenosPorEmpresaYCiudad, getTerrenosDeUsuariosIndependientes,getTerrenoPorId,getTodosLosTerrenos,crearTerreno
};

