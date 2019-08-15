const express = require('express');
const routes = express.Router();
const DeveloperController = require('./controllers/DeveloperController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');
const GithubController = require('./controllers/GithubController');

routes.get('/', (request, response) => {
    // query string exemplo:
    // http://localhost:3333/?name=Charles
    //return response.send(`Testando servidor API: ${request.query.name}`);
    return response.json({ message: `Olá, testando servidor API: ${request.query.name}` });
  });

/*routes.post('/developers', (request, response) => {
    return response.json({ success: true, payload: request.body });
});*/

routes.get('/developers/', DeveloperController.index);
routes.get('/developers/:developerId', DeveloperController.show);

routes.post('/developers', DeveloperController.store);
routes.post('/developers/:developerId/likes', LikeController.store);
routes.post('/developers/:developerId/dislikes', DislikeController.store);

routes.post('/github', GithubController.show);

module.exports = routes;
