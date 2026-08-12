const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express + PostgreSQL Relational API',
      version: '1.0.0',
      description:
        'A REST API demonstrating Express connected to PostgreSQL with Knex migrations, seed data, and a Users -> Posts (one-to-many) relational schema.'
    },
    servers: [
      {
        url: '/',
        description: 'Current server'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
