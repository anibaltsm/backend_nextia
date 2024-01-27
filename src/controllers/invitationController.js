// controllers/invitationController.js
const Invitation = require('../models/Invitation');
const UserInvitation = require('../models/User');

// Endpoint para obtener todas las invitaciones del usuario autenticado
exports.getInvitations = async (req, res) => {
    const uid = req.user.uid;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    try {
        const { rows: invitations, count } = await UserInvitation.findAndCountAll({
            where: { usuario_id: uid, '$Invitation.nombreInvitado$': { [Op.like]: `%${search}%` } },
            include: [{ model: Invitation }],
            limit: limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
        });

        return res.json({ invitations, count, page, limit });
    } catch (error) {
        console.error('Error al obtener invitaciones:', error);
        return res.status(500).json({ error: 'Error al obtener invitaciones' });
    }
};


// Endpoint para crear una nueva invitación
exports.createInvitation = async (req, res) => {
    try {
        const { nombreInvitado, fechaHoraEntrada, fechaCaducidad } = req.body;
        const uid = req.user.uid;

        const invitation = await Invitation.create({
            nombreInvitado,
            fechaHoraEntrada,
            fechaCaducidad,
        });

        await UserInvitation.create({ usuario_id: uid, invitacion_id: invitation.id });

        return res.status(201).json({ message: 'Invitación creada exitosamente', invitation });
    } catch (error) {
        console.error('Error al crear invitación:', error);
        return res.status(500).json({ error: 'Error al crear invitación' });
    }
};

// Endpoint para obtener los detalles de una invitación por ID
exports.getInvitationDetails = async (req, res) => {
    try {
        const invitationId = req.params.id;

        const invitationDetails = await Invitation.findByPk(invitationId);

        return res.json({ invitationDetails });
    } catch (error) {
        console.error('Error al obtener detalles de la invitación:', error);
        return res.status(500).json({ error: 'Error al obtener detalles de la invitación' });
    }
};

// Endpoint para eliminar una invitación por ID
exports.deleteInvitation = async (req, res) => {
    try {
        const invitationId = req.params.id;

        await UserInvitation.destroy({ where: { invitacion_id: invitationId } });
        await Invitation.destroy({ where: { id: invitationId } });

        return res.json({ message: 'Invitación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar invitación:', error);
        return res.status(500).json({ error: 'Error al eliminar invitación' });
    }
};

// Endpoint para actualizar una invitación por ID
exports.updateInvitation = async (req, res) => {
    try {
        const invitationId = req.params.id;
        const { nombreInvitado, fechaHoraEntrada, fechaCaducidad } = req.body;

        await Invitation.update(
            { nombreInvitado, fechaHoraEntrada, fechaCaducidad },
            { where: { id: invitationId } }
        );

        const updatedInvitation = await Invitation.findByPk(invitationId);

        return res.json({ message: 'Invitación actualizada exitosamente', invitation: updatedInvitation });
    } catch (error) {
        console.error('Error al actualizar invitación:', error);
        return res.status(500).json({ error: 'Error al actualizar invitación' });
    }
};

