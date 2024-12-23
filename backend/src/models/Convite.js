const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Substitua isso pelo seu arquivo de configuração, se houver
const Usuario = require('./Usuario');
const Evento = require('./Evento');

const Convite = sequelize.define('Convite', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('pendente', 'aceito', 'recusado'),
    defaultValue: 'pendente',
    allowNull: false,
  },
  eventoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Evento, key: 'id' },
  },
  convidadoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Usuario, key: 'id' },
  },
  remetenteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Usuario, key: 'id' },
  },
}, {
  tableName: 'convites',
  timestamps: true,
});

// Relacionamentos
Convite.belongsTo(Usuario, { foreignKey: 'remetenteId', as: 'remetente' });
Convite.belongsTo(Evento, { foreignKey: 'eventoId', as: 'evento' });
Convite.belongsTo(Usuario, { foreignKey: 'convidadoId', as: 'convidado' });

Evento.hasMany(Convite, { foreignKey: 'eventoId', as: 'convites' });
Usuario.hasMany(Convite, { foreignKey: 'convidadoId', as: 'convitesRecebidos' });
Usuario.hasMany(Convite, { foreignKey: 'remetenteId', as: 'convitesEnviados' });

module.exports = Convite;
