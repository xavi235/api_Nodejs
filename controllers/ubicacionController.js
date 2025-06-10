const Ubicacion = require('../models/Ubicacion');

const index = (req, res) => {
    Ubicacion.getUbicaciones()
        .then(ubicaciones => {
            res.status(200).json(ubicaciones);
        })
        .catch(err => {
            res.status(500).json({ mensaje: 'Error al obtener las ubicaciones', error: err });
        });
};

const store = (req, res) => {
    const { direccion_detallada, provincia } = req.body;

    if (!direccion_detallada || !provincia) {
        return res.status(400).json({ mensaje: 'La dirección detallada y la provincia son obligatorias' });
    }

    Ubicacion.createUbicacion({ direccion_detallada, provincia })
        .then((idUbicacion) => {
            res.status(201).json({ id_ubicacion: idUbicacion, direccion_detallada, provincia });
        })
        .catch(err => {
            res.status(500).json({ mensaje: 'Error al crear la ubicación', error: err });
        });
};

const show = (req, res) => {
    const { id } = req.params;

    Ubicacion.getUbicacionById(id)
        .then(ubicacion => {
            if (!ubicacion) {
                return res.status(404).json({ mensaje: 'Ubicación no encontrada' });
            }
            res.status(200).json(ubicacion);
        })
        .catch(err => {
            res.status(500).json({ mensaje: 'Error al obtener la ubicación', error: err });
        });
};

const update = (req, res) => {
    const { id } = req.params;
    const { direccion_detallada, provincia } = req.body;

    if (!direccion_detallada || !provincia) {
        return res.status(400).json({ mensaje: 'La dirección detallada y la provincia son obligatorias' });
    }

    Ubicacion.getUbicacionById(id)
        .then(ubicacion => {
            if (!ubicacion) {
                return res.status(404).json({ mensaje: 'Ubicación no encontrada' });
            }

            ubicacion.direccion_detallada = direccion_detallada || ubicacion.direccion_detallada;
            ubicacion.provincia = provincia || ubicacion.provincia;

            return Ubicacion.updateUbicacion(id, ubicacion);
        })
        .then(updatedUbicacion => {
            res.status(200).json(updatedUbicacion);
        })
        .catch(err => {
            res.status(500).json({ mensaje: 'Error al actualizar la ubicación', error: err });
        });
};

const destroy = (req, res) => {
    const { id } = req.params;

    Ubicacion.getUbicacionById(id)
        .then(ubicacion => {
            if (!ubicacion) {
                return res.status(404).json({ mensaje: 'Ubicación no encontrada' });
            }

            return Ubicacion.deleteUbicacion(id);
        })
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            res.status(500).json({ mensaje: 'Error al eliminar la ubicación', error: err });
        });
};

module.exports = {
    index,
    store,
    show,
    update,
    destroy
};
