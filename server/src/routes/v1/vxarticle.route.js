const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const vxarticleController = require('../../controllers/vxarticle.controller');
const kmarticalController = require('../../controllers/kmartical.controller');
const router = express.Router();

router.post('/add', vxarticleController.addVXArtical);
router.get('/get_source_title/:id', vxarticleController.getSourceTitle);
router.post('/attachment', kmarticalController.upload, kmarticalController.createArticleAttachment);
router.post('/article_getbyid', vxarticleController.articlegeybyid);

module.exports = router;
