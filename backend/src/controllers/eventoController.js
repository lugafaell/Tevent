const Evento = require('../models/Evento');
const Usuario = require('../models/Usuario');
const { Op, Sequelize } = require('sequelize');

const criarEvento = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { nome, descricao, dataEvento, horaInicio, horaTermino, isPublic, guests } = req.body;

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const evento = await Evento.create({
      nome,
      descricao,
      dataEvento,
      horaInicio,
      horaTermino,
      isPublic: isPublic ?? false,
      guests: guests || [],
      usuarioId,
    });

    res.status(201).json({ mensagem: 'Evento criado com sucesso', evento });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({ erro: 'Erro ao criar evento' });
  }
};

const listarEventosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const eventos = await Evento.findAll({
      where: {
        [Op.or]: [
          { usuarioId },
          Sequelize.literal(`"${Evento.name}".guests @> ARRAY[${usuarioId}]::integer[]`)
        ]
      },
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }],
    });

    res.status(200).json(eventos);
  } catch (error) {
    console.error('Erro ao listar eventos por usuário:', error);
    res.status(500).json({ erro: 'Erro ao listar eventos' });
  }
};

const participarEvento = async (req, res) => {
  const { eventoId } = req.params;
  const { userId } = req.body;

  try {
    const evento = await Evento.findByPk(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    const dataEvento = evento.dataEvento;

    const eventosDoUsuario = await Evento.findAll({
      where: {
        [Op.and]: [
          { dataEvento },
          {
            [Op.or]: [
              { usuarioId: userId },
              Sequelize.literal(`"${Evento.name}".guests @> ARRAY[${userId}]::integer[]`)
            ],
          },
        ],
      },
    });

    if (eventosDoUsuario.length > 0) {
      return res.status(400).json({ error: 'Você já tem um evento no mesmo dia.' });
    }

    const guests = Array.isArray(evento.guests) ? [...evento.guests] : [];

    if (guests.includes(userId)) {
      return res.status(400).json({ error: 'Usuário já está participando do evento.' });
    }

    guests.push(userId);

    await Evento.update(
      { guests },
      { where: { id: evento.id } }
    );

    res.status(200).json({
      message: 'Usuário adicionado com sucesso ao evento.',
      eventoId,
      guests,
    });
  } catch (error) {
    console.error('Erro ao adicionar usuário ao evento:', error);
    res.status(500).json({ error: 'Erro ao adicionar usuário ao evento.' });
  }
};

const removerParticipacao = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { userId } = req.body;

    const evento = await Evento.findByPk(eventoId);

    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    const updatedGuests = evento.guests?.filter((id) => id !== userId) || [];

    await Evento.update(
      { guests: updatedGuests },
      { where: { id: evento.id } }
    );

    res.status(200).json({ message: 'Participação removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover participação:', error);
    res.status(500).json({ error: 'Erro ao remover participação' });
  }
};

const excluirEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ erro: 'Evento não encontrado' });
    }

    await evento.destroy();
    res.status(200).json({ mensagem: 'Evento excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir evento' });
  }
};

const atualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, dataEvento, horaInicio, horaTermino, isPublic, guests } = req.body;

    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ erro: 'Evento não encontrado' });
    }

    await evento.update({
      nome,
      descricao,
      dataEvento: dataEvento || evento.dataEvento,
      horaInicio: horaInicio || evento.horaInicio,
      horaTermino: horaTermino || evento.horaTermino,
      isPublic: isPublic ?? evento.isPublic,
      guests: guests || evento.guests,
    });

    res.status(200).json({ mensagem: 'Evento atualizado com sucesso', evento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar evento' });
  }
};

const listarEventosPublicos = async (req, res) => {
  try {
    const { usuarioId } = req.params;
 
    const eventos = await Evento.findAll({
      where: {
        [Op.and]: [
          { usuarioId: { [Op.ne]: usuarioId } },
          { isPublic: true },
          Sequelize.literal(`NOT (guests @> ARRAY[${usuarioId}]::integer[])`)
        ]
      },
      include: [
        { 
          model: Usuario, 
          as: 'usuario', 
          attributes: ['id', 'nome'] 
        }
      ],
      order: [['dataEvento', 'ASC']]
    });
 
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Erro ao listar eventos públicos:', error);
    res.status(500).json({ erro: 'Erro ao listar eventos públicos' });
  }
 };

 const listarUsuariosDisponiveis = async (req, res) => {
  try {
    const { usuarioId, eventoId } = req.params;

    const evento = await Evento.findByPk(eventoId);

    if (!evento) {
      return res.status(404).json({ erro: 'Evento não encontrado' });
    }

    const guests = evento.guests || [];

    const usuarios = await Usuario.findAll({
      where: {
        id: {
          [Op.and]: [
            { [Op.ne]: usuarioId },
            { [Op.notIn]: guests },
          ],
        },
      },
      attributes: ['id', 'nome'],
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários disponíveis:', error);
    res.status(500).json({ erro: 'Erro ao listar usuários disponíveis' });
  }
};

module.exports = {
  criarEvento,
  listarEventosPorUsuario,
  excluirEvento,
  atualizarEvento,
  listarEventosPublicos,
  participarEvento,
  removerParticipacao,
  listarUsuariosDisponiveis
};