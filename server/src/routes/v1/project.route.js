const express = require('express');
const validate = require('../../middlewares/validate');
// const clientValidation = require('../../validations/client.validation');
const projectController = require('../../controllers/project.controller');

const router = express.Router();

router.post('/', projectController.createProject);
router.put('/', projectController.updateProject);
router.get('/:id', projectController.getProjectById);
router.post('/search', projectController.searchProject);
router.post('/searchall', projectController.searchProjectAll);
router.post('/prjectlistByManager', projectController.prjectlistByManager);
router.post('/addTeamMember', projectController.addTeamMember);
router.post('/attachment', projectController.upload, projectController.createProjAttachment);
router.put('/attachment', projectController.updateProjAttachment);
router.get('/attachment/:id', projectController.getAttachment);
router.get('/teamMemberByProject/:id', projectController.teamMemberByProject);
router.post('/composition', projectController.createComposition);
router.put('/composition', projectController.updateComposition);
router.get('/composition/:id', projectController.getComposition);
router.delete('/composition/:id', projectController.deleteComposition);
router.delete('/composition/deleteById/:id', projectController.deleteComposition_ByID);
router.post('/projectweek', projectController.createProjectWeek);
router.put('/projectweek', projectController.updateProjectWeek);
router.get('/projectweek/:id', projectController.getProjectWeekById);
router.post('/projectweekHistory', projectController.getProjectWeekGetByProjectId);
router.post('/projectraid', projectController.createProjectRaid);
router.put('/projectraid', projectController.updateProjectRaid);
router.get('/projectraid/:pid', projectController.getProjectRaidById);
router.delete('/projectraid/:id', projectController.deleteProjectRaid);
router.post('/projectManager', projectController.getProjectManager);
router.post('/projectflag', projectController.projectFlagApplay);
router.post('/getprojectFlag', projectController.getProjectFlag);
router.delete('/attachment/delete/:id', projectController.deleteAttachment);
router.delete('/deleteteammember/:id', projectController.deleteTeamMember);
router.post('/wsr', projectController.getWsr);

module.exports = router;
