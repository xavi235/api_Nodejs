const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

const index = async (req, res) => {
    try {
        const usuarios = await Usuario.getUsuarios();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: err });
    }
};

const store = async (req, res) => {
    try {
        const { nombre_usuario, correo, contraseña, contacto, id_rol } = req.body;

        const hash = await bcrypt.hash(contraseña, 10);

        const usuarioId = await Usuario.createUsuario({
            nombre_usuario,
            correo,
            contraseña: hash,
            contacto,
            id_rol
        });

        res.status(201).json({
            mensaje: 'Usuario creado correctamente',
            id_usuario: usuarioId
        });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al crear el usuario', error: err });
    }
};


const show = async (req, res) => {
    try {
        const usuario = await Usuario.getUsuarioById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener el usuario', error: err });
    }
};

const update = async (req, res) => {
    try {
        const usuario = await Usuario.getUsuarioById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        
        const { nombre_usuario, correo, contraseña, contacto, id_rol } = req.body;
        
        await Usuario.updateUsuario(req.params.id, { nombre_usuario, correo, contraseña, contacto, id_rol });
        res.json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: err });
    }
};

const destroy = async (req, res) => {
    try {
        const usuario = await Usuario.getUsuarioById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        await Usuario.deleteUsuario(req.params.id);
        res.status(204).json();
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: err });
    }
};
const login = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        if (!correo || !contraseña) {
            return res.status(400).json({ mensaje: 'Correo y contraseña requeridos.' });
        }

        const usuario = await Usuario.getUsuarioByCorreo(correo);

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        const coincide = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!coincide) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });
        }
        
        return res.json({
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            correo: usuario.correo,
            contacto: usuario.contacto,
            id_rol: usuario.id_rol
        });

    } catch (err) {
        res.status(500).json({ mensaje: 'Error en el login', error: err });
    }
};


module.exports = {
    index,
    store,
    show,
    update,
    destroy,
    login
};
