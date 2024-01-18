const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  console.log(req);
  const user = await userService.createUser(req.body);
  if (user == 'Registered successfully') {
    res.status(httpStatus.CREATED).send({ user });
  } else {
    res.status(httpStatus.OK).send({ error: user });
  }
  // const tokens = await tokenService.generateAuthTokens(user);
});

const login = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    res.send({ user });
  } catch (error) {
    res.send({ error });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const forgotPassword = catchAsync(async (req, res) => {
  let result = await authService.forgotPassword(req.body);
  res.status(httpStatus.OK).send(result);
});

const resetPassword = catchAsync(async (req, res) => {
  let result = await authService.resetPassword(req);
  if (result == 'User not found') res.status(httpStatus.OK).send({ message: result });
  else res.status(httpStatus.OK).send({ message: 'password changed successfully' });
});

module.exports = {
  register,
  login,
  logout,
  resetPassword,
  forgotPassword,
};
