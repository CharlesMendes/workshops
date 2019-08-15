const express = require('express');
const router = express.Router();
const GithubController = require('../controllers/GithubController');

router.post('/github', GithubController.show);

module.exports = router;
