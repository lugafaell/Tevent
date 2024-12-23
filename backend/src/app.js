const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    await sequelize.sync({ alter: true });
    console.log('Sincronização do banco de dados concluída.');
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error);
  }
})();

module.exports = app;