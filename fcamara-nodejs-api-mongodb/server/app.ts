// importamos a lib express e guardamos ela na variavel de mesmo nome
import * as express from 'express';
import database from './db';

class App {

    // toda variável tem que ser tipada, abaixo, será do tipo Application
    public app: express.Application;
    
    // vamos criar a variavel que representa a conexao com o banco de dados
    public database: database;

    constructor() {

        this.app = express();
        this.database = new database(); // instancia conexao com o BD
        this.database.createConnection(); // abre conexao com o BD

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