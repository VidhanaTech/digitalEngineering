const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.post('/profile/update', validate(userValidation.user), userController.updateUser);
router.get('/:id', userController.getUser);

// USER SSCREEN
router.post('/addrewards', userController.addUserReward);
router.get('/reward/rewardpointslist', userController.userRewardPointsList);
router.post('/reward/updateReward', userController.updateRewardPoints);
router.get('/:id', userController.approveUser);
router.post('/search', userController.searchUser);
router.post('/update', userController.updateUser);
router.get('/register/list', userController.userRigisterList);
router.post('/role', userController.addUserRole);
router.delete('/role', userController.deleteUserRole);
router.post('/role/role', userController.deleteRole);
router.delete('/:id', userController.deleteUser);
router.post('/user_approve', userController.userApproved);

// roles screen
router.get('/roles/role', userController.getRoles);
router.get('/roles/role/:id', userController.getRoleById);
router.put('/roles', userController.updateRole);
router.post('/roles', userController.addRole);
router.delete('/roles/module', userController.deleteRoleModule);
router.post('/roles/module', userController.addRoleModule);
router.get('/role/:role', userController.getUsersByRole);
router.get('/role/module/list', userController.getModules);
router.get('/modules/:module', userController.getModulesByRole);
router.get('/roles/:id', userController.getUserIdByRole);

module.exports = router;
