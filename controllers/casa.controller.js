const Casa = require('../models/casa.modelo');

const getCasasPorEmpresaYCiudad = async (req, res) => {
  try {
    const { idEmpresa, idCiudad } = req.params;
    const casas = await Casa.getCasasPorEmpresaYCiudad(idEmpresa, idCiudad);

    const formateadas = casas.map(casa => ({
      id_casa: casa.id_casa,
      titulo: casa.titulo,
      descripcion: casa.descripcion,
      precio: casa.precio,
      estado: casa.estado,
      fecha_publicacion: casa.fecha_publicacion,
      enlace_ubicacion: casa.enlace_ubicacion,
      habitaciones: casa.habitaciones,
      banos: casa.banos,
      cochera: casa.cochera,
      pisos: casa.pisos,
      imagenes: casa.imagenes ? casa.imagenes.split(',') : [],
      usuario: {
        id_usuario: casa.id_usuario,
        nombre_usuario: casa.nombre_usuario,
        correo: casa.correo,
        contacto: casa.contacto
      },
      ciudad: {
        id_ciudad: casa.id_ciudad,
        nombre_ciudad: casa.nombre_ciudad || null
      },
      empresa: casa.id_empresa ? {
        id_empresa: casa.id_empresa,
        nombre_empresa: casa.nombre_empresa,
        descripcion: casa.descripcion_empresa,
        telefono: casa.telefono_empresa,
        correo: casa.correo_empresa
      } : null
    }));

    res.json(formateadas);
  } catch (error) {
    console.error('Error al obtener casas:', error);
    res.status(500).json({ message: 'Error al obtener casas' });
  }
};


const getCasasDeUsuariosIndependientes = async (req, res) => {
  try {
    const casas = await Casa.getCasasDeUsuariosIndependientes();

    const formateadas = casas.map(casa => ({
      id_casa: casa.id_casa,
      titulo: casa.titulo,
      descripcion: casa.descripcion,
      precio: casa.precio,
      estado: casa.estado,
      fecha_publicacion: casa.fecha_publicacion,
      enlace_ubicacion: casa.enlace_ubicacion,
      habitaciones: casa.habitaciones,
      banos: casa.banos,
      cochera: casa.cochera,
      pisos: casa.pisos,
      imagenes: casa.imagenes ? casa.imagenes.split(',') : [],
      usuario: {
        id_usuario: casa.id_usuario,
        nombre_usuario: casa.nombre_usuario,
        correo: casa.correo,
        contacto: casa.contacto
      },
      ciudad: {
        id_ciudad: casa.id_ciudad || null,
        nombre_ciudad: casa.nombre_ciudad || null
      },
      empresa: null
    }));

    res.json(formateadas);
  } catch (err) {
    console.error('Error al obtener casas independientes:', err);
    res.status(500).json({ error: 'Error al obtener casas independientes' });
  }
};

const getCasaPorId = async (req, res) => {
  const { id } = req.params;
    try {
      const casa = await Casa.getCasaPorId(id);
      if (!casa) return res.status(404).json({ message: 'Casa no encontrada' });

      const formateada = {
        id_casa: casa.id_casa,
        titulo: casa.titulo,
        descripcion: casa.descripcion,
        precio: casa.precio,
        estado: casa.estado,
        fecha_publicacion: casa.fecha_publicacion,
        enlace_ubicacion: casa.enlace_ubicacion,
        habitaciones: casa.habitaciones,
        banos: casa.banos,
        cochera: casa.cochera,
        pisos: casa.pisos,
        imagenes: casa.imagenes ? casa.imagenes.split(',') : [],
        usuario: {
          id_usuario: casa.id_usuario,
          nombre_usuario: casa.nombre_usuario,
          correo: casa.correo,
          contacto: casa.contacto
        },
        ciudad: {
          id_ciudad: casa.id_ciudad,
          nombre_ciudad: casa.nombre_ciudad
        }
      };

      res.json(formateada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getTodasLasCasas = async (req, res) => {
  try {
    const casas = await Casa.getTodasLasCasas();
    const formateadas = casas.map(casa => ({
      id_casa: casa.id_casa,
      titulo: casa.titulo,
      descripcion: casa.descripcion,
      precio: casa.precio,
      estado: casa.estado,
      fecha_publicacion: casa.fecha_publicacion,
      enlace_ubicacion: casa.enlace_ubicacion,
      habitaciones: casa.habitaciones,
      banos: casa.banos,
      cochera: casa.cochera,
      pisos: casa.pisos,
      imagenes: casa.imagenes ? casa.imagenes.split(',') : [],
      usuario: {
        id_usuario: casa.id_usuario,
        nombre_usuario: casa.nombre_usuario,
        correo: casa.correo,
        contacto: casa.contacto
      },
      ciudad: {
        id_ciudad: casa.id_ciudad,
        nombre_ciudad: casa.nombre_ciudad
      },
      empresa: casa.id_empresa ? {
        id_empresa: casa.id_empresa,
        nombre_empresa: casa.nombre_empresa,
        descripcion: casa.descripcion_empresa,
        telefono: casa.telefono_empresa
      } : null
    }));

    res.json(formateadas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const crearCasa = async (req, res) => {
  try {
    const nuevaCasa = await Casa.crearCasa(req.body, req.files);
    res.status(201).json({
      message: 'Casa creada exitosamente',
      id_casa: nuevaCasa.id_casa
    });
  } catch (error) {
    console.error('Error al crear la casa:', error);
    res.status(500).json({ error: 'Error al crear la casa' });
  }
};

const getCasasPorUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const casas = await Casa.getCasasPorUsuario(idUsuario);

    const formateadas = casas.map(casa => ({
      id_casa: casa.id_casa,
      titulo: casa.titulo,
      descripcion: casa.descripcion,
      precio: casa.precio,
      estado: casa.estado,
      fecha_publicacion: casa.fecha_publicacion,
      enlace_ubicacion: casa.enlace_ubicacion,
      habitaciones: casa.habitaciones,
      banos: casa.banos,
      cochera: casa.cochera,
      pisos: casa.pisos,
      imagenes: casa.imagenes ? casa.imagenes.split(',') : [],
      usuario: {
        id_usuario: casa.id_usuario,
        nombre_usuario: casa.nombre_usuario,
        correo: casa.correo,
        contacto: casa.contacto
      },
      ciudad: {
        id_ciudad: casa.id_ciudad || null,
        nombre_ciudad: casa.nombre_ciudad || null
      },
      empresa: casa.id_empresa ? {
        id_empresa: casa.id_empresa,
        nombre_empresa: casa.nombre_empresa,
        descripcion: casa.descripcion_empresa,
        telefono: casa.telefono_empresa,
        correo: casa.correo_empresa
      } : null
    }));

    res.json(formateadas);
  } catch (error) {
    console.error('Error al obtener casas por usuario:', error);
    res.status(500).json({ message: 'Error al obtener casas por usuario' });
  }
};


module.exports = {
  getCasasPorEmpresaYCiudad,getCasasDeUsuariosIndependientes,getCasaPorId,getTodasLasCasas,crearCasa,getCasasPorUsuario
};
