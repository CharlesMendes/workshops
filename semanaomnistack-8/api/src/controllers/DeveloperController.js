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
    }
}
