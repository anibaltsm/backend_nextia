// routes/invitationRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Middleware de autenticación para verificar el JWT
const authenticateUser = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    const idToken = authorization.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(401).json({ error: 'Acceso no autorizado' });
    }
};

// Endpoint para obtener todas las invitaciones del usuario autenticado
router.get('/invitations', authenticateUser, async (req, res) => {
    try {
        // Obtener el UID del usuario autenticado
        const uid = req.user.uid;

        // Aquí deberías consultar la base de datos para obtener las invitaciones del usuario
        // Implementa la lógica necesaria para paginar, buscar, etc.
        // Ejemplo: const invitations = await Invitations.find({ userId: uid });

        // Devolver las invitaciones encontradas
        return res.json({ invitations: [] }); // Reemplaza [] con las invitaciones reales
    } catch (error) {
        console.error('Error al obtener invitaciones:', error);
        return res.status(500).json({ error: 'Error al obtener invitaciones' });
    }
});

// Endpoint para crear una nueva invitación
router.post('/invitations', authenticateUser, async (req, res) => {
    try {
        const { guestName, entryDateTime, expirationDate } = req.body;
        const uid = req.user.uid;

        // Aquí deberías guardar la nueva invitación en la base de datos
        // Implementa la lógica necesaria para validar y almacenar la invitación
        // Ejemplo: const newInvitation = await Invitations.create({ userId: uid, guestName, entryDateTime, expirationDate });

        // Devolver la nueva invitación creada
        return res.status(201).json({ message: 'Invitación creada exitosamente', invitation: {} }); // Reemplaza {} con la nueva invitación real
    } catch (error) {
        console.error('Error al crear invitación:', error);
        return res.status(500).json({ error: 'Error al crear invitación' });
    }
});

// Endpoint para obtener los detalles de una invitación por ID
router.get('/invitations/:id', authenticateUser, async (req, res) => {
    try {
        const invitationId = req.params.id;

        // Aquí deberías consultar la base de datos para obtener los detalles de la invitación por ID
        // Implementa la lógica necesaria
        // Ejemplo: const invitationDetails = await Invitations.findById(invitationId);

        // Devolver los detalles de la invitación encontrada
        return res.json({ invitationDetails: {} }); // Reemplaza {} con los detalles reales de la invitación
    } catch (error) {
        console.error('Error al obtener detalles de la invitación:', error);
        return res.status(500).json({ error: 'Error al obtener detalles de la invitación' });
    }
});

// Endpoint para eliminar una invitación por ID
router.delete('/invitations/:id', authenticateUser, async (req, res) => {
    try {
        const invitationId = req.params.id;

        // Aquí deberías eliminar la invitación de la base de datos por ID
        // Implementa la lógica necesaria
        // Ejemplo: await Invitations.findByIdAndDelete(invitationId);

        return res.json({ message: 'Invitación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar invitación:', error);
        return res.status(500).json({ error: 'Error al eliminar invitación' });
    }
});

// Endpoint para actualizar una invitación por ID
router.put('/invitations/:id', authenticateUser, async (req, res) => {
    try {
        const invitationId = req.params.id;
        const { guestName, entryDateTime, expirationDate } = req.body;

        // Aquí deberías actualizar la invitación en la base de datos por ID
        // Implementa la lógica necesaria
        // Ejemplo: const updatedInvitation = await Invitations.findByIdAndUpdate(invitationId, { guestName, entryDateTime, expirationDate }, { new: true });

        // Devolver la invitación actualizada
        return res.json({ message: 'Invitación actualizada exitosamente', invitation: {} }); // Reemplaza {} con la invitación actualizada real
    } catch (error) {
        console.error('Error al actualizar invitación:', error);
        return res.status(500).json({ error: 'Error al actualizar invitación' });
    }
});

module.exports = router;
