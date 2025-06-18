const multer = require('multer');
const path = require('path');

const getUploadMiddleware = (tipo) => {
  const carpetasPermitidas = ['casas', 'departamentos', 'terrenos', 'alquileres'];

  if (!carpetasPermitidas.includes(tipo)) {
    throw new Error('Tipo de carpeta no permitido');
  }

  const carpetaDestino = path.join(__dirname, '..', 'public', 'imagenes', tipo);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, carpetaDestino);
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueName + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage });


  return upload.array('imagenes', 3);
};

module.exports = getUploadMiddleware;
