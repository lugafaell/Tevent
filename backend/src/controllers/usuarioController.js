const Usuario = require('../models/Usuario');

const criarUsuario = async (req, res) => {
  try {
    const { nome, senha, cpf, dataNascimento } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { cpf } });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'CPF já cadastrado' });
    }

    const novoUsuario = await Usuario.create({ nome, senha, cpf, dataNascimento });
    res.status(201).json({ mensagem: 'Usuário criado com sucesso', id: novoUsuario.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar usuários' });
  }
};

const buscarUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
};

const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, senhaAntiga, senhaNova, cpf, dataNascimento } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (senhaNova) {
      if (!senhaAntiga || !(await usuario.validarSenha(senhaAntiga))) {
        return res.status(401).json({ erro: 'Senha antiga incorreta' });
      }
      await usuario.update({ nome, senha: senhaNova, cpf, dataNascimento });
    } else {
      await usuario.update({ nome, cpf, dataNascimento });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
};

const excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    await usuario.destroy();
    res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir usuário' });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { cpf, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { cpf } });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const senhaValida = await usuario.validarSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    res.status(200).json({ mensagem: 'Login realizado com sucesso', usuario: usuario.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao realizar login' });
  }
};

const recuperarSenha = async (req, res) => {
  try {
    const { cpf, dataNascimento, novaSenha } = req.body;

    const usuario = await Usuario.findOne({ where: { cpf } });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const dataNascimentoBD = new Date(usuario.dataNascimento).toISOString().split('T')[0];
    const dataNascimentoInformada = new Date(dataNascimento).toISOString().split('T')[0];

    if (dataNascimentoBD !== dataNascimentoInformada) {
      return res.status(401).json({ erro: 'Data de nascimento incorreta' });
    }

    await usuario.update({ senha: novaSenha });

    res.status(200).json({ mensagem: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao recuperar senha' });
  }
};

module.exports = {
  criarUsuario,
  listarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
  loginUsuario,
  recuperarSenha
};