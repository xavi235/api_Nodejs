const db = require('../config/db');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/imagenes/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });
exports.index = (req, res) => {
  const query = `
    SELECT 
      p.*,
      u.id_usuario, u.nombre_usuario, u.correo, u.contacto, r.nombre AS nombre_rol, r.descripcion AS descripcion_rol,
      i.id_imagen, i.ruta_imagen,
      t.id_tipo, t.nombre AS tipo_nombre,
      ub.id_ubicacion, ub.direccion_detallada, ub.provincia
    FROM propiedads p
    LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
    LEFT JOIN rols r ON u.id_rol = r.id_rol
    LEFT JOIN imagenes i ON p.id_propiedad = i.id_propiedad
    LEFT JOIN tipo_propiedads t ON p.id_tipo = t.id_tipo
    LEFT JOIN ubicacions ub ON p.id_ubicacion = ub.id_ubicacion
    WHERE p.estado = 1
    ORDER BY p.id_propiedad DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const propiedadesMap = new Map();

    results.forEach(row => {
      if (!propiedadesMap.has(row.id_propiedad)) {
        propiedadesMap.set(row.id_propiedad, {
          id_propiedad: row.id_propiedad,
          titulo: row.titulo,
          descripcion: row.descripcion,
          tamano: row.tamano,
          precio_min: row.precio_min,
          precio_max: row.precio_max,
          estado: row.estado,
          Enlace_ubicacion: row.Enlace_ubicacion,
          id_usuario: row.id_usuario,
          id_ubicacion: row.id_ubicacion,
          id_tipo: row.id_tipo,
          created_at: row.created_at,
          updated_at: row.updated_at,
          imagenes: [],
          usuario: {
            nombre_usuario: row.nombre_usuario,
            correo: row.correo,
            contacto: row.contacto,
            rol: {
              nombre: row.nombre_rol,
              descripcion: row.descripcion_rol
            },
          },
          ubicacion: {
            direccion_detallada: row.direccion_detallada,
            provincia: row.provincia
          },
          tipo: {
            nombre: row.tipo_nombre
          }
        });
      }

      if (row.ruta_imagen) {
        propiedadesMap.get(row.id_propiedad).imagenes.push({
          ruta_imagen: row.ruta_imagen
        });
      }
    });

    res.json(Array.from(propiedadesMap.values()));
  });
};

exports.store = [upload.array('imagenes'), (req, res) => {
  const { titulo, descripcion, tamano, precio_min, precio_max,Enlace_ubicacion, id_usuario, id_ubicacion, id_tipo } = req.body;

  if (!titulo || !descripcion || !precio_min || !precio_max || !id_usuario || !id_ubicacion || !id_tipo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const insertPropiedadQuery = `
    INSERT INTO propiedads (titulo, descripcion, tamano, precio_min, precio_max, Enlace_ubicacion, id_usuario, id_ubicacion, id_tipo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertPropiedadQuery, [titulo, descripcion, tamano, precio_min, precio_max, Enlace_ubicacion, id_usuario, id_ubicacion, id_tipo], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const propiedadId = results.insertId;

    if (!req.files || req.files.length === 0) {
      return res.status(201).json({ mensaje: 'Propiedad creada correctamente', propiedadId });
    }

    const insertPromises = req.files.map(file => {
      const ruta_imagen = `${req.protocol}://${req.get('host')}/storage/imagenes/${file.filename}`;
      const insertImageQuery = 'INSERT INTO imagenes (ruta_imagen, id_propiedad) VALUES (?, ?)';
      return new Promise((resolve, reject) => {
        db.query(insertImageQuery, [ruta_imagen, propiedadId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    Promise.all(insertPromises)
      .then(() => {
        res.status(201).json({ mensaje: 'Propiedad creada correctamente', propiedadId });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
}];

exports.obtenerPropiedadPorId = (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT p.*, 
           u.nombre_usuario, u.correo, u.contacto,
           i.ruta_imagen, 
           t.nombre AS tipo, 
           ub.direccion_detallada, ub.provincia
    FROM propiedads p
    LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
    LEFT JOIN imagenes i ON p.id_propiedad = i.id_propiedad
    LEFT JOIN tipo_propiedads t ON p.id_tipo = t.id_tipo
    LEFT JOIN ubicacions ub ON p.id_ubicacion = ub.id_ubicacion
    WHERE p.id_propiedad = ? AND p.estado = 1
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Propiedad no encontrada' });

    const propiedad = {
      id_propiedad: results[0].id_propiedad,
      titulo: results[0].titulo,
      descripcion: results[0].descripcion,
      tamano: results[0].tamano,
      precio_min: results[0].precio_min,
      precio_max: results[0].precio_max,
      estado: results[0].estado,
      Enlace_ubicacion: results[0].Enlace_ubicacion,
      id_usuario: results[0].id_usuario,
      id_ubicacion: results[0].id_ubicacion,
      id_tipo: results[0].id_tipo,
      created_at: results[0].created_at,
      updated_at: results[0].updated_at,
      imagenes: [],
      usuario: {
        nombre_usuario: results[0].nombre_usuario,
        correo: results[0].correo,
        contacto: results[0].contacto
      },
      ubicacion: {
        direccion_detallada: results[0].direccion_detallada,
        provincia: results[0].provincia
      },
      tipo: {
        nombre: results[0].tipo
      }
    };

    results.forEach(row => {
      if (row.ruta_imagen) {
        propiedad.imagenes.push({
          ruta_imagen: row.ruta_imagen
        });
      }
    });

    res.json(propiedad);
  });
};

exports.obtenerPorUsuario = (req, res) => {
  const id_usuario = req.params.id_usuario;

  const query = `
    SELECT 
      p.*,
      u.id_usuario, u.nombre_usuario, u.correo, u.contacto,
      i.id_imagen, i.ruta_imagen,
      t.id_tipo, t.nombre AS tipo_nombre,
      ub.id_ubicacion, ub.direccion_detallada, ub.provincia
    FROM propiedads p
    LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
    LEFT JOIN imagenes i ON p.id_propiedad = i.id_propiedad
    LEFT JOIN tipo_propiedads t ON p.id_tipo = t.id_tipo
    LEFT JOIN ubicacions ub ON p.id_ubicacion = ub.id_ubicacion
    WHERE p.estado = 1 AND p.id_usuario = ?
    ORDER BY p.id_propiedad DESC
  `;

  db.query(query, [id_usuario], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const propiedadesMap = new Map();

    results.forEach(row => {
      if (!propiedadesMap.has(row.id_propiedad)) {
        propiedadesMap.set(row.id_propiedad, {
          id_propiedad: row.id_propiedad,
          titulo: row.titulo,
          descripcion: row.descripcion,
          tamano: row.tamano,
          precio_min: row.precio_min,
          precio_max: row.precio_max,
          estado: row.estado,
          Enlace_ubicacion: row.Enlace_ubicacion,
          id_usuario: row.id_usuario,
          id_ubicacion: row.id_ubicacion,
          id_tipo: row.id_tipo,
          created_at: row.created_at,
          updated_at: row.updated_at,
          imagenes: [],
          usuario: {
            nombre_usuario: row.nombre_usuario,
            correo: row.correo,
            contacto:row.contacto
          },
          ubicacion: {
            direccion_detallada: row.direccion_detallada,
            provincia: row.provincia
          },
          tipo: {
            nombre: row.tipo_nombre
          }
        });
      }

      if (row.ruta_imagen) {
        propiedadesMap.get(row.id_propiedad).imagenes.push({
          ruta_imagen: row.ruta_imagen
        });
      }
    });

    res.json(Array.from(propiedadesMap.values()));
  });
};

exports.obtenerPorTipo = (req, res) => {
  const nombre_tipo = req.params.nombre_tipo;
  const query = `
    SELECT p.*, 
           u.nombre_usuario, u.correo, 
           i.ruta_imagen, 
           t.nombre AS tipo, 
           ub.direccion_detallada, ub.provincia
    FROM propiedads p
    LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
    LEFT JOIN imagenes i ON p.id_propiedad = i.id_propiedad
    LEFT JOIN tipo_propiedads t ON p.id_tipo = t.id_tipo
    LEFT JOIN ubicacions ub ON p.id_ubicacion = ub.id_ubicacion
    WHERE t.nombre = ? AND p.estado = 1
    ORDER BY p.id_propiedad DESC
  `;

  db.query(query, [nombre_tipo], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'No hay propiedades de ese tipo' });

    const propiedadesMap = {};

    results.forEach(row => {
      const id = row.id_propiedad;

      if (!propiedadesMap[id]) {
        propiedadesMap[id] = {
          id_propiedad: row.id_propiedad,
          titulo: row.titulo,
          descripcion: row.descripcion,
          tamano: row.tamano,
          precio_min: row.precio_min,
          precio_max: row.precio_max,
          estado: row.estado,
          Enlace_ubicacion: row.Enlace_ubicacion,
          id_usuario: row.id_usuario,
          id_ubicacion: row.id_ubicacion,
          id_tipo: row.id_tipo,
          created_at: row.created_at,
          updated_at: row.updated_at,
          imagenes: [],
          usuario: {
            nombre_usuario: row.nombre_usuario,
            correo: row.correo,
            contacto: row.contacto
          },
          ubicacion: {
            direccion_detallada: row.direccion_detallada,
            provincia: row.provincia
          },
          tipo: {
            nombre: row.tipo
          }
        };
      }

      if (row.ruta_imagen) {
        propiedadesMap[id].imagenes.push({
          ruta_imagen: row.ruta_imagen
        });
      }
    });

    res.json(Object.values(propiedadesMap));
  });
};

exports.destroy = (req, res) => {
  const id = req.params.id;
  const query = 'UPDATE propiedads SET estado = 0 WHERE id_propiedad = ?';

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Propiedad no encontrada' });

    res.json({ mensaje: 'Propiedad desactivada correctamente' });
  });
};

exports.update = [upload.array('imagenes'), (req, res) => {
  const id = req.params.id;
  const {
    titulo, descripcion, tamano, precio_min, precio_max, 
    Enlace_ubicacion, id_usuario, id_ubicacion, id_tipo
  } = req.body;

  const updateQuery = `
    UPDATE propiedads
    SET titulo = ?, descripcion = ?, tamano = ?, precio_min = ?, precio_max = ?, 
    Enlace_ubicacion = ?, id_usuario = ?, id_ubicacion = ?, id_tipo = ?
    WHERE id_propiedad = ?
  `;

  db.query(updateQuery, [
    titulo, descripcion, tamano, precio_min, precio_max, 
    Enlace_ubicacion, id_usuario, id_ubicacion, id_tipo, id
  ], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!req.files || req.files.length === 0) {
      return res.json({ mensaje: 'Propiedad actualizada correctamente' });
    }

    const getOldImagesQuery = 'SELECT ruta_imagen FROM imagenes WHERE id_propiedad = ?';
    db.query(getOldImagesQuery, [id], (err, oldImages) => {
      if (err) return res.status(500).json({ error: err.message });

      const fs = require('fs');
      oldImages.forEach(img => {
        const filePath = path.join(__dirname, '..', 'storage', 'imagenes', path.basename(img.ruta_imagen));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

      const deleteOldImagesQuery = 'DELETE FROM imagenes WHERE id_propiedad = ?';
      db.query(deleteOldImagesQuery, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        const insertPromises = req.files.map(file => {
          const ruta_imagen = `${req.protocol}://${req.get('host')}/storage/imagenes/${file.filename}`;
          const insertImageQuery = 'INSERT INTO imagenes (ruta_imagen, id_propiedad) VALUES (?, ?)';
          return new Promise((resolve, reject) => {
            db.query(insertImageQuery, [ruta_imagen, id], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        });

        Promise.all(insertPromises)
          .then(() => {
            res.json({ mensaje: 'Propiedad e imágenes actualizadas correctamente' });
          })
          .catch(err => {
            res.status(500).json({ error: err.message });
          });
      });
    });
  });
}];








