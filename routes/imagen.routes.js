const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const carpetasValidas = ['casas', 'alquileres', 'departamentos', 'terrenos'];

router.delete('/:tipo/:nombreArchivo', (req, res) => {
  const { tipo, nombreArchivo } = req.params;

  if (!carpetasValidas.includes(tipo)) {
    return res.status(400).json({ mensaje: 'Carpeta no válida' });
  }

  const ruta = path.join(__dirname, '..', 'public', 'imagenes', tipo, nombreArchivo);

  fs.access(ruta, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ mensaje: 'Imagen no encontrada' });
    }

    fs.unlink(ruta, (err) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al eliminar la imagen' });
      }

      res.status(200).json({ mensaje: 'Imagen eliminada correctamente' });
    });
  });
});

module.exports = router;
