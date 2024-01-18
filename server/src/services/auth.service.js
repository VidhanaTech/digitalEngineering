const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const dbConn = require('../models/dbConfig');
var bcrypt = require('bcryptjs');
const userService = require('./user.service');
const EmailSend = require('./mail.service').EmailSend;

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(
    email,
    bcrypt.hashSync(password, '$2a$12$WbpWQ1YHInpRFTrovAZKM.anQEG9NREE0ZpT8Q4aVXvDf8TpAoF02')
  );
  if (!user) {
    // TODO Add condition to check password as well
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  } else {
    return user;
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (req) => {
  try {
    const res = await userService.updateUserPassword(req.body.id, req.body.newPassword);
    return res;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const forgotPassword = async (req) => {
  try {
    let res = await userService.forgotPassword(req);
    if (res !== 'User NoUser Not Found') {
      let info = {
        to: req.EmailId, // list of receivers
        subject: 'Forget Password', // Subject line
        text: '', // plain text body
        html:
          `Dear ` +
          req.EmailId +
          `
        <br>
        <br>
        Your Password is changeme
        <br>`, // html body
      };
      let dd = await EmailSend(info);
    }
    return res;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User Not Found');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  resetPassword,
  forgotPassword,
};
