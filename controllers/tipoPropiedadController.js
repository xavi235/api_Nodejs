const TipoPropiedad = require('../models/TipoPropiedad');

const index = (req, res) => {
    TipoPropiedad.getTipoPropiedades()
        .then(tipoPropiedades => {
            res.status(200).json(tipoPropiedades);
        })
        .catch(err => {
            res.status(500).json({ mensaje: 'Error al obtener los tipos de propiedad', error: err });
        });
};

const store = (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }

    TipoPropiedad.createTipoPropiedad({ nombre })
        .then((idTipoPropiedad) => {
            res.status(201).json({ id_tipo: idTipoPropiedad, nombre });
        })
        .catch(err => {
            res.status(500).json({ mensaje: 'Error al crear el tipo de propiedad', error: err });
        });
};

const show = (req, res) => {
    const { id } = req.params;

    TipoPropiedad.getTipoPropiedadById(id)
        .then(tipoPropiedad => {
            if (!tipoPropiedad) {
                return res.status(404).json({ mensaje: 'Tipo de propiedad no encontrado' });
            }
            res.status(200).json(tipoPropiedad);
        })
        .catch(err => {
            res.status(500).json({ mensaje: 'Error al obtener el tipo de propiedad', error: err });
        });
};

const update = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }

    TipoPropiedad.getTipoPropiedadById(id)
        .then(tipoPropiedad => {
            if (!tipoPropiedad) {
                return res.status(404).json({ mensaje: 'Tipo de propiedad no encontrado' });
            }

            tipoPropiedad.nombre = nombre || tipoPropiedad.nombre;

            return TipoPropiedad.updateTipoPropiedad(id, tipoPropiedad);
        })
        .then(updatedTipoPropiedad => {
            res.status(200).json(updatedTipoPropiedad);
        })
        .catch(err => {
            res.status(500).json({ mensaje: 'Error al actualizar el tipo de propiedad', error: err });
        });
};

const destroy = (req, res) => {
    const { id } = req.params;

    TipoPropiedad.getTipoPropiedadById(id)
        .then(tipoPropiedad => {
            if (!tipoPropiedad) {
                return res.status(404).json({ mensaje: 'Tipo de propiedad no encontrado' });
            }

            return TipoPropiedad.deleteTipoPropiedad(id);
        })
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            res.status(500).json({ mensaje: 'Error al eliminar el tipo de propiedad', error: err });
        });
};

module.exports = {
    index,
    store,
    show,
    update,
    destroy
};
