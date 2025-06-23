const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const router = express.Router();

router.delete('/imagencasa/:nombreArchivo', (req, res) => {
  const nombreArchivo = req.params.nombreArchivo;
const subdirectorio = 'casas';

const rutaCompleta = `/imagenes/${subdirectorio}/${nombreArchivo}`;
const sql = 'DELETE FROM ImagenCasa WHERE url_imagen = ?';

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

});

module.exports = router;
