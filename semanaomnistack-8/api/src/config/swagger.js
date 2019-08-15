const swaggerJSDoc = require('swagger-jsdoc');

const { description, version } = require('../../package');

// Swagger definition - Documentação da API
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md

//const PORT = process.env.PORT || 3000;
const PORT = 3333;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      description,
      version,
      title: 'API Omnistack 8',
    },
    host: `localhost:${PORT}`,
    basePath: '/',
    produces: ['application/json'],
    schemes: [
      'https',
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js', './models/*.js']
};

module.exports = {
  spec() {
    // Initialize swagger-jsdoc -> returns validated swagger spec in json format
    return swaggerJSDoc(swaggerOptions);
  },
};
