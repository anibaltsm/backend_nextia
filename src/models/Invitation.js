// models/Invitation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Invitation = sequelize.define('Invitation', {
  nombreInvitado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaHoraEntrada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fechaCaducidad: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
    timestamps: true,
});

module.exports = Invitation;
