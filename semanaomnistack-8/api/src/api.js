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

mongoose.connect('mongodb+srv://omnistack:1234@cluster-learning-pbleq.gcp.mongodb.net/db-omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

api.use(cors());

//console.log(swaggerOptions);

const swaggerSpecOptions = {
    explorer: true,
};

api.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, swaggerSpecOptions)); //http://editor.swagger.io/

// Serve swagger docs the way you like (Recommendation: swagger-tools)
api.get('/docs.json', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(swaggerSpec);
});

api.use(express.json());

api.use(routesDeveloper);
api.use(routesGithub);
api.use(routesIndex);
api.use(routesUser);

// Start the server
const server = api.listen(PORT, () => {
    const host = server.address().address;
    const { port } = server.address();

    console.log('api listening at http://%s:%s', host, port);
});
