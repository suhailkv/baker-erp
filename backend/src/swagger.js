// src/swagger.js
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

module.exports = function (app) {
  const spec = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: { title: 'ERPVision API', version: '0.1.0' },
      servers: [{ url: '/api' }],
    },
    apis: ['./src/routes/*.js'],
  });
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(spec));
};
