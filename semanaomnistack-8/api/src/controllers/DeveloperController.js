module.exports = {
    store(request, response) {
        return response.json({ status: true, payload: request.body });
    }
}
