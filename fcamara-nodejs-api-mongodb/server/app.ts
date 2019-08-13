// importamos a lib express e guardamos ela na variavel de mesmo nome
import * as express from 'express';
import * as bodyparser from 'body-parser'; //para realizar o parser do json

import database from './db';
import controller from './controller';

class App {

    public app: express.Application; // toda variável tem que ser tipada, abaixo, será do tipo Application
    private database: database; // vamos criar a variavel que representa a conexao com o banco de dados
    private controller: controller; // cria o controller para ser usado no app

    constructor() {

        this.app = express();
        this.database = new database(); // instancia conexao com o BD
        this.database.createConnection(); // abre conexao com o BD
        this.controller = new controller(); //instancia do controller
        this.middleware();

        this.route();

    }

    // fica no meio de qualquer entrada ou saida nas requisições da API
    middleware() {
        this.app.use(bodyparser.json());
        this.app.use(bodyparser.urlencoded({ extended: true }));
    }

    route() {
        // assim que acessarmos a url principal, irá acessar essa rota default
        this.app.route('/').get(
            (req, res) => res.status(200).json({ "result": "Vai Corinthians" })
        );

        // rotas de manipulacao ao BD Mongo
        this.app.route('/api/crush').post(
            (req, res) => this.controller.create(req, res)
        )
    }

}

export default new App();
