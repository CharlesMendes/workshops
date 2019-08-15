const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Index
 *   description: All about /
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Index
 *     description: It will return 'index' results
 *     tags: [Index]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: hello world
 */
router.get('/', function(req, res, next) {
  res.json({results: 'index'});
});

/**
 * @swagger
 * /2:
 *    get:
 *      description: This should return all users
 */
router.get('/2', (request, response) => {
    // query string exemplo:
    // http://localhost:3333/?name=Charles
    //return response.send(`Testando servidor API: ${request.query.name}`);
    return response.json({ message: `Olá, testando servidor API: ${request.query.name}` });
});

module.exports = router;

