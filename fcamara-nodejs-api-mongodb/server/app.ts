// importamos a lib express e guardamos ela na variavel de mesmo nome
import * as express from 'express';

class App {

    // toda variável tem que ser tipada, abaixo, será do tipo Application
    public app: express.Application;

    constructor() {

        this.app = express();
        this.route();

    }

    route() {
        // assim que acessarmos a url principal, irá acessar essa rota default
        this.app.route('/').get( 
            (req, res) => res.status(200).json({ "result":"Vai Corinthians" }) 
        );
    }

}

export default new App();