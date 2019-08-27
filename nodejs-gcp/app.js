'use strict';

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
