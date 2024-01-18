const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, kmarticalService } = require('../services');

const updateUserProfile = catchAsync(async (req, res) => {
  const user = await userService.updateUserProfile(req.body);
  res.status(httpStatus.OK).send({ user });
});

const userApproved = catchAsync(async (req, res) => {
  const user = await userService.userApproved(req.body);
  res.status(httpStatus.OK).send({ user });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  const defaultPage = await userService.getDefaultlPage(req.params.id);
  const role = await userService.getUserIdByRole(user[0].Id);
  const level = await kmarticalService.kmarticledashboard({ UserId: user[0].Id });
  const Points = await userService.userRewardPointsList();
  const roleId = role.map((val) => val.RoleId);
  let ApproveStatus = false;
  if (roleId.length > 0) {
    const result = await userService.getApproveStatus(roleId);
    if (result[0].RoleStatus) ApproveStatus = true;
    else ApproveStatus = false;
  }
  let pagePath = '';
  if (defaultPage.length > 0) pagePath = defaultPage[0].Path;
  let data = {
    user: user,
    defaultPage: pagePath,
    rolelist: role,
    level: level,
    rewards: Points,
    reviewApprove: ApproveStatus,
  };
  res.status(httpStatus.OK).send({ data });
});

const approveUser = catchAsync(async (req, res) => {
  const user = await userService.approveUser(req.params.id);
  res.status(httpStatus.OK).send({ user });
});

const addUserReward = catchAsync(async (req, res) => {
  const user = await userService.addUserReward(req.body);
  res.status(httpStatus.OK).send({ user });
});

const userRewardPointsList = catchAsync(async (req, res) => {
  const user = await userService.userRewardPointsList();
  res.status(httpStatus.OK).send({ user });
});

const updateRewardPoints = catchAsync(async (req, res) => {
  const user = await userService.updateRewardPoints(req.body);
  res.status(httpStatus.OK).send(user);
});

const searchUser = catchAsync(async (req, res) => {
  const user = await userService.searchUser(req.body);
  res.status(httpStatus.OK).send({ user });
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.body);
  res.status(httpStatus.OK).send({ user });
});

const userRigisterList = catchAsync(async (req, res) => {
  const user = await userService.userRigisterList(req.body);
  res.status(httpStatus.OK).send({ user });
});

const addUserRole = catchAsync(async (req, res) => {
  const user = await userService.addUserRole(req.body);
  if (user == 'success') {
    res.send({ user: 'User Role added successfully' });
  } else {
    res.send({ error: user });
  }
});

const deleteUserRole = catchAsync(async (req, res) => {
  const user = await userService.deleteUserRole(req.body);
  if (user == 'success') {
    res.send({ user: 'User Role deleted successfully' });
  } else {
    res.send({ error: user });
  }
});

const deleteRole = catchAsync(async (req, res) => {
  const user = await userService.deleteRole(req.body);
  if (user == 'Already User Assigned') {
    res.send({ error: 'Already User Assigned' });
  } else {
    res.send({ user: user });
  }
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteUser(req.params.id);
  if (user == 'success') {
    res.send({ user: 'User deleted successfully' });
  } else {
    res.send({ error: user });
  }
});

const getRoles = catchAsync(async (req, res) => {
  const user = await userService.getRoles();
  res.status(httpStatus.OK).send({ user });
});

const getRoleById = catchAsync(async (req, res) => {
  const user = await userService.getRoleById(req.params.id);
  res.status(httpStatus.OK).send({ user });
});

const getUserIdByRole = catchAsync(async (req, res) => {
  const user = await userService.getUserIdByRole(req.params.id);
  res.status(httpStatus.OK).send({ user });
});

const updateRole = catchAsync(async (req, res) => {
  const user = await userService.updateRole(req.body);
  res.status(httpStatus.OK).send({ user });
});

const addRole = catchAsync(async (req, res) => {
  const user = await userService.addRole(req.body);
  res.status(httpStatus.OK).send({ user });
});

const deleteRoleModule = catchAsync(async (req, res) => {
  const user = await userService.deleteRoleModule(req.body);
  if (user == 'success') {
    res.send({ user: 'Role Module deleted successfully' });
  } else {
    res.send({ error: user });
  }
});

const addRoleModule = catchAsync(async (req, res) => {
  const user = await userService.addRoleModule(req.body);
  if (user == 'success') {
    res.send({ user: 'Role Module Added successfully' });
  } else {
    res.send({ error: user });
  }
});

const getUsersByRole = catchAsync(async (req, res) => {
  const user = await userService.getUsersByRole(req.params.role);
  res.status(httpStatus.OK).send({ user });
});

const getModules = catchAsync(async (req, res) => {
  const user = await userService.getModules();
  res.status(httpStatus.OK).send({ user });
});

const getModulesByRole = catchAsync(async (req, res) => {
  const user = await userService.getModulesByRole(req.params.module);
  res.status(httpStatus.OK).send({ user });
});

module.exports = {
  updateUserProfile,
  getUser,
  userApproved,
  approveUser,
  addUserReward,
  userRewardPointsList,
  searchUser,
  updateUser,
  addUserRole,
  deleteUserRole,
  deleteUser,
  getRoles,
  getRoleById,
  updateRole,
  userRigisterList,
  addRole,
  deleteRoleModule,
  deleteRole,
  addRoleModule,
  getUsersByRole,
  getModules,
  getModulesByRole,
  getUserIdByRole,
  updateRewardPoints,
};
