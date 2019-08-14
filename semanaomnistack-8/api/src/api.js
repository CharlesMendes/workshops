const express = require('express');
const api = express();

api.get('/', (request, response) => {
  // query string exemplo:
  // http://localhost:3333/?name=Charles
  //return response.send(`Testando servidor API: ${request.query.name}`);
  return response.json({ message: `Olá, testando servidor API: ${request.query.name}` });
});

api.listen(3333);
