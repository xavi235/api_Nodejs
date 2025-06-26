const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const router = express.Router();

router.delete('/imagencasa/:nombreArchivo', (req, res) => {
  eliminarImagen(req, res, 'casas', 'ImagenCasa');
});

router.delete('/imagenalquiler/:nombreArchivo', (req, res) => {
  eliminarImagen(req, res, 'alquileres', 'ImagenAlquiler');
});

router.delete('/imagendepartamento/:nombreArchivo', (req, res) => {
  eliminarImagen(req, res, 'departamentos', 'ImagenDepartamento');
});

router.delete('/imagenterreno/:nombreArchivo', (req, res) => {
  eliminarImagen(req, res, 'terrenos', 'ImagenTerreno');
});

function eliminarImagen(req, res, subdirectorio, tabla) {
  const nombreArchivo = req.params.nombreArchivo;
  const rutaCompleta = `/imagenes/${subdirectorio}/${nombreArchivo}`;
  const sql = `DELETE FROM ${tabla} WHERE url_imagen = ?`;

  db.query(sql, [rutaCompleta], (err, resultado) => {
    if (err) {
      console.error('Error al eliminar de la base de datos:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar de la base de datos', error: err });
    }

    if (resultado.affectedRows === 0) {
      return res.json({ mensaje: 'Imagen eliminada del servidor, pero no estaba registrada en la base de datos' });
    }

    return res.json({ mensaje: 'Imagen eliminada correctamente' });
  });
}

module.exports = router;
