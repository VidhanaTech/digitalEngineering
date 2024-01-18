const express = require('express');
const validate = require('../../middlewares/validate');
// const clientValidation = require('../../validations/client.validation');
const clientController = require('../../controllers/client.controller');

const router = express.Router();

router.get('/:id', clientController.getClientById);
router.post('/search', clientController.getClientsSearch);
router.post('/add', clientController.addClient);
router.post('/update', clientController.updateClient);
router.post('/location/add', clientController.clientLocationApply);
router.post('/location/get', clientController.getClientLocation);
router.post('/location/delete', clientController.deleteClientLocation);
router.get('/attachment/:id', clientController.getAttachment);
router.post('/attachment/add', clientController.upload, clientController.addAttachment);
router.post('/attachment/update', clientController.updateAttachment);
router.get('/engagement/:id', clientController.getEngagement);
router.post('/engagement/add', clientController.addEngagement);
router.post('/engagement/update', clientController.updateEngagement);
router.delete('/attachment/delete/:id', clientController.deleteAttachment);

module.exports = router;
