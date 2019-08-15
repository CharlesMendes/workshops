const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const routesDeveloper = require('./routes/Developer');
const routesGithub = require('./routes/Github');
const routesIndex = require('./routes/Index');
const routesUser = require('./routes/User');

const api = express();

//const PORT = process.env.PORT || 3000;
const PORT = 3333;

mongoose.connect('mongodb+srv://omnistack:1234@cluster-learning-pbleq.gcp.mongodb.net/db-omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

api.use(cors());

// Swagger definition - Documentação da API
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
    info: {
      // API informations (required)
      title: 'API Omnistack 8', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'Projeto de estudos sobre nodeJS, ReactJS e ReactNative', // Description (optional)
    },
    host: `localhost:${PORT}`, // Host (optional)
    basePath: '/', // Base path (optional)
  };

// Options for the swagger docs
const swaggerOptions = {
    // Import swaggerDefinitions
    swaggerDefinition,
    // Path to the API docs
    // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
    apis: ['routes.js', './models/*', './controllers/*'],
    url: 'http://petstore.swagger.io/v2/swagger.json',
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(swaggerOptions);

var options = {
    swaggerOptions: {
      url: 'http://petstore.swagger.io/v2/swagger.json'
    }
  }

// Serve swagger docs the way you like (Recommendation: swagger-tools)
api.get('/docs.json', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(swaggerSpec);
});

const swaggerSpecOptions = {
    explorer: true,
};


api.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerSpecOptions)); //http://editor.swagger.io/
api.use(express.json());

api.use(routesDeveloper);
api.use(routesGithub);
api.use(routesIndex);
api.use(routesUser);

//api.listen(PORT);

// Start the server
const server = api.listen(PORT, () => {
    const host = server.address().address;
    const { port } = server.address();

    console.log('api listening at http://%s:%s', host, port);
});
