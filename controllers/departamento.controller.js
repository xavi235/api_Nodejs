const Departamento = require('../models/departamento.modelo');

const getDepartamentosPorEmpresaYCiudad = async (req, res) => {
  try {
    const { idEmpresa, idCiudad } = req.params;
    const departamentos = await Departamento.getDepartamentosPorEmpresaYCiudad(idEmpresa, idCiudad);

    const formateados = departamentos.map(dep => ({
      id_departamento: dep.id_departamento,
      titulo: dep.titulo,
      descripcion: dep.descripcion,
      precio: dep.precio,
      estado: dep.estado,
      fecha_publicacion: dep.fecha_publicacion,
      enlace_ubicacion: dep.enlace_ubicacion,
      habitaciones: dep.habitaciones,
      banos: dep.banos,
      cochera: dep.cochera,
      pisos: dep.pisos,
      imagenes: dep.imagenes ? dep.imagenes.split(',') : [],
      usuario: {
        id_usuario: dep.id_usuario,
        nombre_usuario: dep.nombre_usuario,
        correo: dep.correo,
        contacto: dep.contacto
      },
      ciudad: {
        id_ciudad: dep.id_ciudad,
        nombre_ciudad: dep.nombre_ciudad
      },
      empresa: dep.id_empresa ? {
        id_empresa: dep.id_empresa,
        nombre_empresa: dep.nombre_empresa,
        descripcion: dep.descripcion_empresa,
        telefono: dep.telefono_empresa,
        correo: dep.correo_empresa
      } : null
    }));

    res.json(formateados);
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    res.status(500).json({ message: 'Error al obtener departamentos' });
  }
};

const getDepartamentosDeUsuariosIndependientes = async (req, res) => {
  try {
    const departamentos = await Departamento.getDepartamentosDeUsuariosIndependientes();
    const formateados = departamentos.map(item => ({
      id_departamento: item.id_departamento,
      titulo: item.titulo,
      descripcion: item.descripcion,
      precio: item.precio,
      estado: item.estado,
      fecha_publicacion: item.fecha_publicacion,
      enlace_ubicacion: item.enlace_ubicacion,
      ambientes: item.ambientes,
      banos: item.banos,
      pisos: item.pisos,
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
    res.status(500).json({ error: 'Error al obtener departamentos independientes' });
  }
};

const getDepartamentoPorId = async (req, res) => {
  const { id } = req.params;
    try {
      const departamento = await Departamento.getDepartamentoPorId(id);
      if (!departamento) return res.status(404).json({ message: 'Departamento no encontrado' });
      const formateado = {
        id_departamento: departamento.id_departamento,
        titulo: departamento.titulo,
        descripcion: departamento.descripcion,
        precio: departamento.precio,
        estado: departamento.estado,
        fecha_publicacion: departamento.fecha_publicacion,
        enlace_ubicacion: departamento.enlace_ubicacion,
        habitaciones: departamento.habitaciones,
        banos: departamento.banos,
        superficie: departamento.superficie,
        piso: departamento.piso,
        imagenes: departamento.imagenes ? departamento.imagenes.split(',') : [],
        usuario: {
          id_usuario: departamento.id_usuario,
          nombre_usuario: departamento.nombre_usuario,
          correo: departamento.correo,
          contacto: departamento.contacto
        },
        ciudad: {
          id_ciudad: departamento.id_ciudad,
          nombre_ciudad: departamento.nombre_ciudad
        }
      };

      res.json(formateado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getTodosLosDepartamentos = async (req, res) => {
  try {
    const departamentos = await Departamento.getTodosLosDepartamentos();
    const formateadas = departamentos.map(d => ({
      id_departamento: d.id_departamento,
      titulo: d.titulo,
      descripcion: d.descripcion,
      precio: d.precio,
      estado: d.estado,
      fecha_publicacion: d.fecha_publicacion,
      enlace_ubicacion: d.enlace_ubicacion,
      habitaciones: d.habitaciones,
      banos: d.banos,
      imagenes: d.imagenes ? d.imagenes.split(',') : [],
      usuario: {
        id_usuario: d.id_usuario,
        nombre_usuario: d.nombre_usuario,
        correo: d.correo,
        contacto: d.contacto
      },
      ciudad: {
        id_ciudad: d.id_ciudad,
        nombre_ciudad: d.nombre_ciudad
      },
      empresa: d.id_empresa ? {
        id_empresa: d.id_empresa,
        nombre_empresa: d.nombre_empresa,
        descripcion: d.descripcion_empresa,
        telefono: d.telefono_empresa
      } : null
    }));

    res.json(formateadas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearDepartamento = async (req, res) => {
  try {
    const nuevoDepartamento = await Departamento.crearDepartamento(req.body, req.files);
    res.status(201).json({
      message: 'Departamento creado exitosamente',
      id_departamento: nuevoDepartamento.id_departamento
    });
  } catch (error) {
    console.error('Error al crear el Departamento:', error);
    res.status(500).json({ error: 'Error al crear el Departamento' });
  }
};

const getDepartamentosPorUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const departamentos = await Departamento.getDepartamentosPorUsuario(idUsuario);

    const formateados = departamentos.map(dep => ({
      id_departamento: dep.id_departamento,
      titulo: dep.titulo,
      descripcion: dep.descripcion,
      precio: dep.precio,
      estado: dep.estado,
      fecha_publicacion: dep.fecha_publicacion,
      enlace_ubicacion: dep.enlace_ubicacion,
      habitaciones: dep.habitaciones,
      banos: dep.banos,
      piso: dep.piso,
      imagenes: dep.imagenes ? dep.imagenes.split(',') : [],
      usuario: {
        id_usuario: dep.id_usuario,
        nombre_usuario: dep.nombre_usuario,
        correo: dep.correo,
        contacto: dep.contacto
      },
      ciudad: {
        id_ciudad: dep.id_ciudad,
        nombre_ciudad: dep.nombre_ciudad
      },
      empresa: dep.id_empresa ? {
        id_empresa: dep.id_empresa,
        nombre_empresa: dep.nombre_empresa,
        descripcion: dep.descripcion_empresa,
        telefono: dep.telefono_empresa,
        correo: dep.correo_empresa
      } : null
    }));

    res.json(formateados);
  } catch (error) {
    console.error('Error al obtener departamentos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener departamentos del usuario' });
  }
};

const desactivarDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Departamento.desactivarDepartamento(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: 'Departamento no encontrada' });
    }

    res.json({ message: 'Departamento desactivada correctamente' });
  } catch (error) {
    console.error('Error al desactivar departamento:', error);
    res.status(500).json({ message: 'Error al desactivar el departamento' });
  }
};

const actualizarDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const imagenes = req.files;

    const resultado = await Departamento.actualizarDepartamento(id, data, imagenes);
    res.json({ message: resultado.message });
  } catch (error) {
    console.error('Error al actualizar departamento:', error);
    res.status(500).json({ error: 'Error al actualizar Departamento' });
  }
};


module.exports = {
  getDepartamentosPorEmpresaYCiudad ,getDepartamentosDeUsuariosIndependientes,getDepartamentoPorId,getTodosLosDepartamentos,crearDepartamento,getDepartamentosPorUsuario,desactivarDepartamento,actualizarDepartamento
};