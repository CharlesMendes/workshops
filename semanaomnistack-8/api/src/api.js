const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger').spec();
const routesDeveloper = require('./routes/Developer');
const routesGithub = require('./routes/Github');
const routesIndex = require('./routes/Index');
const routesUser = require('./routes/User');

const api = express();

//const PORT = process.env.PORT || 3000;
const PORT = 3333;
const versionNumberAPI = '/api/v1';

// >>>> Mongoose start here
mongoose.connect('mongodb+srv://omnistack:1234@cluster-learning-pbleq.gcp.mongodb.net/db-omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true
});
// <<<< Mongoose end here

api.use(cors());

// >>>> Swagger start here
api.get('/docs.json', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(swaggerSpec);
});
api.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec)); //http://editor.swagger.io/
// <<<< Swagger end here

api.use(express.json());

// >>>> Routes start here
api.use(versionNumberAPI, routesDeveloper);
api.use(versionNumberAPI, routesGithub);
api.use(versionNumberAPI, routesIndex);
api.use(versionNumberAPI, routesUser);
// <<<< Routes end here

// Start the server
const server = api.listen(PORT, () => {
    const host = server.address().address;
    const { port } = server.address();

    console.log('api listening at http://%s:%s', host, port);
});
