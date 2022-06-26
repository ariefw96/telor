const express = require('express');
const router = express.Router();
const controller = require('./controller');
const middelware = require('./../../../middleware/jwt-auth');

router.post('/add', controller.add_product );
router.get('/all', controller.all_product);
router.get('/get', controller.get_single_product);
router.patch('/update',  controller.update_product);
router.delete('/delete',  controller.delete_product);

module.exports = router;