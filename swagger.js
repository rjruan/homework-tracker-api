const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Homework Tracker API',
      version: '1.0.0',
      description: 'API for tracking homework tasks',
    },
    servers: [
      { url: 'http://localhost:8080', description: 'Local server' },
    ],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJSDoc(options);
