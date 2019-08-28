'use strict';

// function exemplo
/*
module.exports.execute = (request, response) => {
  try {

    const mensagem = {
      statusCode: 200,
      body: {
        success: true,
        message: 'teste gcp function - charlesmendes'
      }
    };

    response.status(200).send(mensagem);

  } catch (error) {

    response.status(500).send(error);

  }
};
*/
// function que acessa api do github
const fetch = require('node-fetch');

function getUrlForUser(username) {
  return `https://api.github.com/users/${username}`
}

// iremos utilizar async/await devido a requisição da api
module.exports.execute = async (request, response) => {

  try {
    //atribui um username default, caso não seja informado na querystring
    const username = request.query.username || 'charlesmendes';
    const responseApi = await fetch(getUrlForUser(username));
    const responseObject = await responseApi.json()
    const avatarUrl = responseObject.avatar_url;

    response.redirect(avatarUrl); //redireciona para a url informada

  } catch (error) {

    const mensagem = {
      statusCode: 500,
      body: {
        result: {
          success: false,
          message: error.message
        }
      }
    };

    response.status(500).send(mensagem);
  }
};
