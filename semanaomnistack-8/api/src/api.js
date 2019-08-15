const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const api = express();

mongoose.connect('mongodb+srv://omnistack:1234@cluster-learning-pbleq.gcp.mongodb.net/db-omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

api.use(express.json());
api.use(routes);

api.listen(3333);
