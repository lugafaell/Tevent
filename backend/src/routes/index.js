const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const eventoController = require('../controllers/eventoController');
const ConviteController = require('../controllers/conviteController');

const router = express.Router();

router.post('/usuarios', usuarioController.criarUsuario);
router.get('/usuarios', usuarioController.listarUsuarios);
router.get('/usuarios/:id', usuarioController.buscarUsuarioPorId);
router.put('/usuarios/:id', usuarioController.atualizarUsuario);
router.delete('/usuarios/:id', usuarioController.excluirUsuario);
router.post('/usuarios/login', usuarioController.loginUsuario);
router.post('/usuarios/recuperar', usuarioController.recuperarSenha);

router.post('/usuarios/:usuarioId/eventos', eventoController.criarEvento);
router.get('/usuarios/:usuarioId/eventos', eventoController.listarEventosPorUsuario);
router.delete('/eventos/:id', eventoController.excluirEvento);
router.put('/eventos/:id', eventoController.atualizarEvento);
router.get('/eventos/publicos/:usuarioId', eventoController.listarEventosPublicos);
router.post('/eventos/:eventoId/participar', eventoController.participarEvento);
router.post('/eventos/:eventoId/remover-participacao', eventoController.removerParticipacao);
router.get('/eventos/:eventoId/usuarios-disponiveis/:usuarioId', eventoController.listarUsuariosDisponiveis);

router.get('/usuarios/buscar', ConviteController.buscarUsuarios);
router.post('/enviar', ConviteController.enviarConvite);
router.post('/responder', ConviteController.responderConvite);
router.get('/recebidos', ConviteController.listarConvitesRecebidos);

module.exports = router;