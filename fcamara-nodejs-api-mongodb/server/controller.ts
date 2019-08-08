import model from './model';

// iremos criar as açoes/metodos nessa classe de controller, com as regras de negocios
class Controller {

    constructor() {}

    create(req, res) {
        const payload = req.body;

        // realiza try/catch para tratar o resultado do envio dos dados para o mongo
        this.createCrush(payload)
            .then(crush => res.status(200).json({ 'result': crush })) // quando conectou direto no banco, independente se gravou ou não os dados
            .catch( err => console.log(err)) // apenas para erro de conexao com o mongo
    }

    // envia os dados para o Mongo
    createCrush(crush) {
        return model.create(crush);
    }
}

export default Controller;