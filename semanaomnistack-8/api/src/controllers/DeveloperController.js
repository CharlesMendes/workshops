const axios = require('axios');

module.exports = {
    async store(request, response) {
        const { username } = request.body;

        const responseGithub = await axios.get(`https://api.github.com/users/${username}`);

        //return response.json({ status: true, username: username });
        return response.json(responseGithub.data);
    }
}
