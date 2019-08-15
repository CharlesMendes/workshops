const Developer = require('../models/Developer');

module.exports = {
    async store(request, response) {
        //qual o desenvolvedor que esta dando o like e recebendo o like
        const { user } = request.headers;
        const { developerId } = request.params;

        const loggedDeveloper = await Developer.findById(user); //usuario que esta logado e realizando o like
        const targetDeveloper = await Developer.findById(developerId); //usuario que foi curtido

        //se esta tentando curtir um usuario que não existe retorna erro 400
        if (!targetDeveloper) {
            return response.status(400).json({ success: false, message: 'Developer not exists' });
        }

        //verifica se deu Match!
        if (targetDeveloper.likes.includes(loggedDeveloper._id)) {
            console.log('DEU MATCH!');
        }

        //apenas grava o like, se ele não for repetido
        if (!loggedDeveloper.likes.includes(targetDeveloper._id)) {
            //se deu tudo certo, pega o dev logado na aplicacao e inclui na listagem dele de likes
            loggedDeveloper.likes.push(targetDeveloper._id);
            await loggedDeveloper.save();
        }


        return response.json({ success: true, loggedDeveloper: loggedDeveloper });
    }
};
