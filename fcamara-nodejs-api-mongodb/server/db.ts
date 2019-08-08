import * as mongoose from 'mongoose';

class DataBase {

    // realiza a conexao com o servidor
    private url = 'mongodb://u-fcamara-nodejs:senha123@ds143181.mlab.com:43181/fcamara-nodejs';
    private connection = mongoose.connection;

    constructor() { }

    createConnection() {
        mongoose.connect(this.url);    
        this.connection.on('connected', () => console.log("mongoose esta conectado, chupaaaa!"));    
    }

    closeConnection() {
        this.connection.close(() => console.log('Mongoose foi desconectado'))
    }
}

export default DataBase;