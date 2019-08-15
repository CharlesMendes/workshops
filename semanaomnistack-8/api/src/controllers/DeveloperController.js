const axios = require('axios');
const Developer = require('../models/Developer');

module.exports = {
    async store(request, response) {
        const { username } = request.body;
        const userExists = await Developer.findOne({ user: username });

        //verifica se o usuario ja existe no BD, e retorna caso já exista
        if (userExists) {
            return response.json(userExists);
        }

        const responseGithub = await axios.get(`https://api.github.com/users/${username}`);
        const { name, bio, avatar_url: avatar } = responseGithub.data;

        //cria usuario no MongoDB
        const developer = await Developer.create({
            name,
            user: username,
            bio,
            avatar
        })
        //return response.json({ status: true, username: username });
        return response.json(developer);
    },

    async show(request, response) {
        const { developerId } = request.params;
        const findDeveloper = await Developer.findById(developerId); //usuario que foi curtido

        //se esta tentando curtir um usuario que não existe retorna erro 400
        if (!findDeveloper) {
            return response.status(400).json({ success: false, message: 'Developer not exists' });
        }

        return response.json({ success: true, developer: findDeveloper });
    },

    async index(request, response) {
        const { user } = request.headers;

        //buscar o usuario logado, a instancia no BD
        const loggedDeveloper = await Developer.findById(user);

        //se o usuario logado nao existe mais retorna um erro
        if (!loggedDeveloper) {
            return response.status(400).json({ success: false, message: 'Developer not exists' });
        }

        //busca todos os usuarios existentes no BD, filtrando por usuarios que
        //nao sao usuario q esta logado, nem usuarios que foi dado like nem
        //usuario que deu dislike
        const users = await Developer.find({
            $and: [
                { _id: { $ne: user } }, //ignora o usuario que ja esta logado
                { _id: { $nin: loggedDeveloper.likes } }, //ignora os usuarios que foram marcados como likes
                { _id: { $nin: loggedDeveloper.dislikes } } //ignora usuarios que foram marcados com dislikes
            ]
        });

        return response.json({ success: true, developers: users });
    }
}
