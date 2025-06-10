const Empresa = require('../models/empresa.modelo');

const getEmpresasPorCiudad = async (req, res) => {
  const { idCiudad } = req.params;

  try {
    const empresas = await Empresa.getEmpresasPorCiudad(idCiudad);
    res.json(empresas);
  } catch (error) {
    console.error('Error al obtener empresas por ciudad:', error);
    res.status(500).json({ error: 'Error al obtener empresas por ciudad' });
  }
};

module.exports = {
  getEmpresasPorCiudad,
};
