const express = require('express');
const router = express.Router();
const controller = require('./controller');
const middelware = require('./../../../middleware/jwt-auth');

router.post('/add', controller.addCategory);
router.get('/all', controller.listCategories);

module.exports = router;