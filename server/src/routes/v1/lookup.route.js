const express = require('express');
const validate = require('../../middlewares/validate');
// const clientValidation = require('../../validations/client.validation');
const lookupController = require('../../controllers/lookup.controller');

const router = express.Router();

router.get('/:type/:id', lookupController.getMetadata);
router.get('/', lookupController.getAllMetadata);
router.delete('/:type/:id', lookupController.deleteMetadata);
router.post('/add', lookupController.addMetadata);
router.post('/update', lookupController.updateMetadata);


module.exports = router;
