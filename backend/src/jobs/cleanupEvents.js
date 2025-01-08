const cron = require('node-cron');
const Evento = require('../models/Evento');
const { Op } = require('sequelize');

const cleanupOldEvents = () => {
    console.log('Iniciando configuração do cronjob');
    
    cron.schedule('0 0 * * *', async () => {
      try {
        const hoje = new Date();
        console.log('Iniciando limpeza. Data atual:', hoje);
        
        const deletedCount = await Evento.destroy({
          where: {
            dataEvento: {
              [Op.lt]: hoje
            }
          }
        });
        
        console.log(`${deletedCount} eventos antigos removidos com sucesso`);
      } catch (error) {
        console.error('Erro detalhado:', error);
        console.error('Stack trace:', error.stack);
      }
    });
};

module.exports = cleanupOldEvents;