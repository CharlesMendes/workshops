import * as mongoose from 'mongoose';
import { Int32 } from 'bson';

const CrushSchema = new mongoose.Schema({

    nome: { type: String, required: true },
    interesses: { type: String, required: true },
    idade: { type: Int32, required: true },
    descricao: { type: String, required: true },
    whatsapp: { type: String, required: true },
    foto: { type: String, required: true },
    createAt: { type: Date, default: Date.now }

})

// como não temos classe, iremos exportar o model e definir o seu nome (similar a o nome da tabela em um relacional)
export default mongoose.model('Crushs', CrushSchema);
