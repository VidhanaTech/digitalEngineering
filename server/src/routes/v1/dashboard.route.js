const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const dashboardController = require('../../controllers/dashboard.controller');

const router = express.Router();

router.post('/', dashboardController.index);
router.post('/getfilter', dashboardController.getfilter);

module.exports = router;
