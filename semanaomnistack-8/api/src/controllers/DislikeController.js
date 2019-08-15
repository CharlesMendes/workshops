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

        //apenas grava o dislike, se ele não for repetido
        if (!loggedDeveloper.dislikes.includes(targetDeveloper._id)) {
            //se deu tudo certo, pega o dev logado na aplicacao e inclui na listagem dele de likes
            loggedDeveloper.dislikes.push(targetDeveloper._id);
            await loggedDeveloper.save();
        }


        return response.json({ success: true, loggedDeveloper: loggedDeveloper });
    }
};
