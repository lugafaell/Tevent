const { Op } = require('sequelize');
const Convite = require('../models/Convite');
const Usuario = require('../models/Usuario');
const Evento = require('../models/Evento');

class ConviteController {
  async buscarUsuarios(req, res) {
    const { termo } = req.query;
    try {
      const usuarios = await Usuario.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.iLike]: `%${termo}%` } },
            { cpf: { [Op.iLike]: `%${termo}%` } }
          ]
        },
        attributes: ['id', 'nome', 'cpf']
      });
      return res.json(usuarios);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  async enviarConvite(req, res) {
    const { eventoId, convidadoId, remetenteId } = req.body;
    try {
      const evento = await Evento.findByPk(eventoId);
      if (!evento) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      const usuario = await Usuario.findByPk(convidadoId);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const remetente = await Usuario.findByPk(remetenteId);
      if (!remetente) {
        return res.status(404).json({ error: 'Remetente não encontrado' });
      }

      const conviteExistente = await Convite.findOne({
        where: { eventoId, convidadoId }
      });

      if (conviteExistente) {
        return res.status(400).json({ error: 'Convite já enviado' });
      }

      const convite = await Convite.create({
        eventoId,
        convidadoId,
        remetenteId,
        status: 'pendente'
      });

      return res.json(convite);
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      return res.status(500).json({ error: 'Erro ao enviar convite' });
    }
  }

  async responderConvite(req, res) {
    const { conviteId, resposta } = req.body;
    try {
      const convite = await Convite.findOne({
        where: { id: conviteId }
      });

      if (!convite) {
        return res.status(404).json({ error: 'Convite não encontrado' });
      }

      const evento = await Evento.findByPk(convite.eventoId);
      if (!evento) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      if (resposta === 'aceitar') {
        const guests = Array.isArray(evento.guests) ? [...evento.guests] : [];

        if (!guests.includes(convite.convidadoId)) {
          guests.push(convite.convidadoId);

          await Evento.update(
            { guests },
            { where: { id: evento.id } }
          );
        }
      }

      await convite.destroy();

      return res.json({
        message: 'Convite processado com sucesso',
        status: resposta
      });
    } catch (error) {
      console.error('Erro ao responder convite:', error);
      return res.status(500).json({ error: 'Erro ao responder convite' });
    }
  }

  async listarConvitesRecebidos(req, res) {
    const { usuarioId } = req.query;
    if (!usuarioId) {
      return res.status(400).json({ error: 'ID do usuário é necessário' });
    }

    try {
      const convites = await Convite.findAll({
        where: {
          convidadoId: usuarioId,
          status: 'pendente'
        },
        include: [
          {
            model: Evento,
            as: 'evento',
            include: [{
              model: Usuario,
              as: 'usuario',
              attributes: ['id', 'nome']
            }]
          },
          {
            model: Usuario,
            as: 'remetente',
            attributes: ['id', 'nome']
          }
        ]
      });

      return res.json(convites);
    } catch (error) {
      console.error('Erro ao listar convites:', error);
      return res.status(500).json({ error: 'Erro ao listar convites' });
    }
  }
}

module.exports = new ConviteController();