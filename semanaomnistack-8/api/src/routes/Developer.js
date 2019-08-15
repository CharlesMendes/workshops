const express = require('express');
const router = express.Router();
const DeveloperController = require('../controllers/DeveloperController');
const LikeController = require('../controllers/LikeController');
const DislikeController = require('../controllers/DislikeController');

/**
 * @swagger
 * /developers:
 *   get:
 *     tags:
 *       - developers
 *     description: Returns all developers
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of developers
 *         schema:
 *           $ref: '#/models/Developer'
 */
router.get('/developers', DeveloperController.index);
router.get('/developers/:developerId', DeveloperController.show);

/**
 * @swagger
 * /:
 *    post:
 *      description: This should return all users
 */
router.post('/developers', DeveloperController.store);
router.post('/developers/:developerId/likes', LikeController.store);
router.post('/developers/:developerId/dislikes', DislikeController.store);

module.exports = router;
