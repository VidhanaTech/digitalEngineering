const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const masterController = require('../../controllers/master.controller');

const router = express.Router();

router.post('/getAddProjectFilter', masterController.getAddProjectFilter);

module.exports = router;
