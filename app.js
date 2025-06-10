const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use('/imagenes', express.static(path.join(__dirname, 'public', 'imagenes')));

const ciudadRoutes = require('./routes/ciudad.routes');
const empresaRoutes = require('./routes/empresa.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const casaRoutes = require('./routes/casa.routes');
const alquilerRoutes = require('./routes/alquiler.routes');
const departamentoRoutes = require('./routes/departamento.routes');
const terrenoRoutes = require('./routes/terreno.routes');

app.use(express.json());

app.use('/api/ciudades', ciudadRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/casas', casaRoutes);
app.use('/api/alquileres', alquilerRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/terrenos', terrenoRoutes);

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
