const express = require('express');
const routes = express.Router();
const DeveloperController = require('./controllers/DeveloperController');

routes.get('/', (request, response) => {
    // query string exemplo:
    // http://localhost:3333/?name=Charles
    //return response.send(`Testando servidor API: ${request.query.name}`);
    return response.json({ message: `Olá, testando servidor API: ${request.query.name}` });
  });

routes.post('/devs', (request, response) => {
    return response.json({ status: true, payload: request.body });
});

routes.post('/developer', DeveloperController.store);

module.exports = routes;
