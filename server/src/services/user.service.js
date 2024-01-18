const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const dbConfig = require('../models/dbConfig');
const logger = require('../config/logger');
var sql = require('../utils/sql-connect');
var bcrypt = require('bcryptjs');
const { NULL } = require('sass');
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const pwd = bcrypt.hashSync(userBody.password, '$2a$12$WbpWQ1YHInpRFTrovAZKM.anQEG9NREE0ZpT8Q4aVXvDf8TpAoF02');
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          null,
          userBody.email,
          pwd,
          userBody.firstName,
          userBody.lastName,
          userBody.phoneNum,
          0,
          body.departmentId,
          1,
          0,
          1,
          '',
        ],
        (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            var string = JSON.stringify(data);
            var json = JSON.parse(string);
            if (json[1][0]?.return_code == null || json[1][0]?.return_code == 0) {
              conn.release();
              resolve('Registered successfully');
            } else if (json[json.length - 1][0]?.return_code == null || json[json.length - 1][0]?.return_code == 0) {
              conn.release();
              resolve('Registered successfully');
            } else {
              resolve(json[1][0].return_message);
            }
          }
        }
      );
    });
  });
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
// const getUserById = async (id) => {
//   return User.findById(id);
// };

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email, password) => {
  // return pool
  //     .query(`SELECT * from Sec_Users`)
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp =
        'CALL digital_experience.Sp_User_Login_Validate(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
      conn.query(sp, [email, password], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve({ error: json[json.length - 1][0].return_message });
          }
        }
      });
    });
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `CALL digital_experience.SEC_USERS_GET(?,'',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

/**
 * Update user by password
 * @param {string} userId
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {Promise<User>}
 */
const updateUserPassword = async (userId, newPassword) => {
  const newPwd = bcrypt.hashSync(newPassword, '$2a$12$WbpWQ1YHInpRFTrovAZKM.anQEG9NREE0ZpT8Q4aVXvDf8TpAoF02');
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_CHANGEPASSWORD(?,?,1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [userId, newPwd], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const forgotPassword = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_FORGET_PASSWORD(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.EmailId], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const getUserDetailsById = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_GETBYID(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};
const updateUserProfile = async (userDetails) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_UPDATEPROFILE(?,?,?,?,1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [userDetails.id, userDetails.firstName, userDetails.lastName, userDetails.phoneNum], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const userApproved = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USER_APPROVED(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.Id, body.isActive, body.isLocked, body.userId], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};
const approveUser = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_APPROVE(?,1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve('success');
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const addUserReward = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_REWARDPOINTS_ADD(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.rewardId, body.points, body.userId, body.logUserId, body.articleId], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve('success');
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const userRewardPointsList = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.REWARDS_BY_CATEGORY(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const updateRewardPoints = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.REWARD_POINTS_UPDATE(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.points, body.userId], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};
const searchUser = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_SEARCH(?,?,?,?,?,?,'',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.firstName, body.lastName, body.emailId, body.isApproved, body.isLocked, body.isActive, body.userId],
        (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            var string = JSON.stringify(data);
            var json = JSON.parse(string);
            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
              conn.release();
              resolve(json[0]);
            } else {
              resolve(json[json.length - 1][0].return_message);
            }
          }
        }
      );
    });
  });
};

const updateUser = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_APPLY(?,?,?,?,?,?,?,?,?,?,?,'',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.emailId,
          body.password,
          body.firstName,
          body.lastName,
          body.phoneNo,
          body.defaultlPageId,
          body.departmentId,
          body.isActive,
          body.isLocked,
          body.loginType,
          body.userId,
        ],
        (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            var string = JSON.stringify(data);
            var json = JSON.parse(string);
            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
              conn.release();
              resolve(json[0]);
            } else {
              resolve(json[json.length - 1][0].return_message);
            }
          }
        }
      );
    });
  });
};

const userRigisterList = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_REGISTER_LIST(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const addUserRole = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERROLEMAP_APPLY(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.userId, body.roleId, 'I', body.userId], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve('success');
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const deleteUserRole = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERROLEMAP_APPLY(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.userId, body.roleId, 'D', body.userId], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve('success');
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const deleteRole = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_ROLES_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.roleId], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};
const deleteUser = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        conn.release();
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_DELETE(?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
          conn.release();
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve('success');
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

// ROLES

const getRoles = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_ROLES_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, ['1'], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const getRoleById = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_ROLES_GET(?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const getUserIdByRole = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_ROLEBY_USERID(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const getApproveStatus = async (roleId) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.ARTIFACT_APPROVE_PERMISSION_CHECK(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [roleId.join(', ')], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};
const getDefaultlPage = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_DEFAULT_PAGE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};
const updateRole = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_ROLES_APPLY(?,?,?,?,?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.id, body.roleName, body.roleDescription, body.defaultlPage, body.isActive, body.userId],
        (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            var string = JSON.stringify(data);
            var json = JSON.parse(string);
            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
              conn.release();
              resolve(json[0]);
            } else {
              resolve(json[json.length - 1][0].return_message);
            }
          }
        }
      );
    });
  });
};

const addRole = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_ROLES_APPLY(?,?,?,?,?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [null, body.roleName, body.roleDescription, body.defaultlPage, body.isActive, body.userId],
        (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            var string = JSON.stringify(data);
            var json = JSON.parse(string);
            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
              conn.release();
              resolve(json[0]);
            } else {
              resolve(json[json.length - 1][0].return_message);
            }
          }
        }
      );
    });
  });
};

const deleteRoleModule = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_ROLEMODULEMAP_APPLY(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.roleId, body.moduleId, 'D', body.userId], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve('success');
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const addRoleModule = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_ROLEMODULEMAP_APPLY(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.roleId, body.moduleId, 'I', body.userId], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve('success');
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const getUsersByRole = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_GETBY_ROLE(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id, '1'], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const getModules = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_MODULE_GET(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, ['1'], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};

const getModulesByRole = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_MODULE_GETBY_ROLE(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body, '1'], (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve(json[0]);
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  });
};
module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
  updateUserProfile,
  approveUser,
  addUserReward,
  userRewardPointsList,
  searchUser,
  updateUser,
  addUserRole,
  deleteUserRole,
  deleteUser,
  getUserIdByRole,
  getRoleById,
  getRoles,
  updateRole,
  addRole,
  deleteRoleModule,
  deleteRole,
  userApproved,
  userRigisterList,
  addRoleModule,
  getUsersByRole,
  getModules,
  getModulesByRole,
  forgotPassword,
  getUserDetailsById,
  getDefaultlPage,
  updateRewardPoints,
  getApproveStatus,
};
