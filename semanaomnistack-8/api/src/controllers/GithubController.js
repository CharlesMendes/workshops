const axios = require('axios');

//index (lista), show (detalhe), store (criar), update, delete
module.exports = {
    async show(request, response) {
        console.log(request.body);
        const { username } = request.body;
        const responseGithub = await axios.get(`https://api.github.com/users/${username}`);

        return response.json(responseGithub.data);
    }
};
