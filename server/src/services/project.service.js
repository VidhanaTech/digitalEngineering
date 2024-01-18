const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
var sql = require('../utils/sql-connect');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const createProject = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECT_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.clientId,
          body.name,
          body.managerId,
          body.startDate,
          body.endDate,
          body.capabilityId,
          body.headCount,
          body.leadId,
          body.about,
          body.additionalDetails,
          body.deliveryTypeId,
          body.EngagementTypeId,
          body.projectStatusId,
          body.IndustryId,
          body.ProjectTypeId,
          body.userId,
        ],
        (err, data) => {
          if (err) {
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

const updateProject = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECT_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.clientId,
          body.name,
          body.managerId,
          body.startDate,
          body.endDate,
          body.capabilityId,
          body.headCount,
          body.leadId,
          body.about,
          body.additionalDetails,
          body.deliveryTypeId,
          body.EngagementTypeId,
          body.projectStatusId,
          body.userId,
        ],
        (err, data) => {
          if (err) {
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

const getProjectById = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECT_GET(?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

const searchProject = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECT_SEARCH(?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.clientId,
          body.EngagementTypeId,
          body.domainId,
          body.towerId,
          body.organizationId,
          body.capabilityId,
          body.projectStatusId,
          body.userId,
          body.week,
          body.year,
        ],
        (err, data) => {
          if (err) {
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

const searchProjectAll = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECT_SEARCHALL(?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.clientId,
          body.EngagementTypeId,
          body.domainId,
          body.towerId,
          body.organizationId,
          body.capabilityId,
          body.projectStatusId,
          body.userId,
        ],
        (err, data) => {
          if (err) {
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

const prjectlistByManager = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_MANAGER_PROJECT_LIST(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.userId, body.isAdmin], (err, data) => {
        if (err) {
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

const addTeamMember = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_TEAMMEMBER_APPLY(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.Id, body.ProjectId, body.UserId, body.CreatedBy], (err, data) => {
        if (err) {
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

const createProjAttachment = async (req) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const body = req.body;
      const filePath = req.file.destination + '/' + req.file.filename;
      const filename = req.file.filename;
      const sp = `call digital_experience.PRJ_PROJECTATTACHMENT_APPLY(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.projectId, body.attachmentTypeId, filename, filePath, body.userId], (err, data) => {
        if (err) {
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

const updateProjAttachment = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTATTACHMENT_APPLY(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.id, body.projectId, body.attachmentTypeId, body.fileName, body.filePath, body.userId],
        (err, data) => {
          if (err) {
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
        }
      );
    });
  });
};

const getAttachment = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTATTACHMENT_GET(?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

const teamMemberByProject = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_TEAM_MEMBER_LIST_BY_PROJECT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

const getProjectManager = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.SEC_USERS_GETBY_ROLE(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.userId], (err, data) => {
        if (err) {
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

const getComposition = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTTEAMCOMPOSITION_GET(?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

const createComposition = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTTEAMCOMPOSITION_APPLY(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.projectId,
          body.techStackId,
          body.roleId,
          body.skillId,
          body.beginner,
          body.junior,
          body.senior,
          body.specialist,
          body.userId,
        ],
        (err, data) => {
          if (err) {
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
        }
      );
    });
  });
};

const updateComposition = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTTEAMCOMPOSITION_APPLY(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.projectId,
          body.techStackId,
          body.roleId,
          body.skillId,
          body.beginner,
          body.junior,
          body.senior,
          body.specialist,
          body.userId,
        ],
        (err, data) => {
          if (err) {
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
        }
      );
    });
  });
};

const deleteComposition = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTTEAMCOMPOSITION_DELETE(?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

const deleteComposition_ByID = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTTEAMCOMPOSITION_DELETE_BYID(?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

const createProjectWeek = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTWEEK_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.projectId,
          body.headCount,
          body.openDemand,
          body.date,
          body.week,
          body.year,
          body.month,
          body.ragStatusId,
          body.goGreenPlan,
          body.statusUpdate,
          body.accomplishment,
          body.valueAds,
          body.potentialGrowth,
          body.userId,
        ],
        (err, data) => {
          if (err) {
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

const updateProjectWeek = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTWEEK_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.projectId,
          body.headCount,
          body.openDemand,
          body.date,
          body.week,
          body.year,
          body.month,
          body.ragStatusId,
          body.goGreenPlan,
          body.statusUpdate,
          body.accomplishment,
          body.valueAds,
          body.potentialGrowth,
          body.userId,
        ],
        (err, data) => {
          if (err) {
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

const getProjectWeekById = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTWEEK_GET(?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

const getProjectWeekGetByProjectId = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTWEEK_GET_BY_PROJECTID(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.userId, body.Week, body.Year, body.projectWeek], (err, data) => {
        if (err) {
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
const getProjectRaidById = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTWEEKRAID_GET(?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

const deleteProjectRaid = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTWEEKRAID_DELETE(?,'1',@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

const createProjectRaid = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTWEEKRAID_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.projectId,
          body.projectWeekId,
          body.raidTypeId,
          body.desc,
          body.mitigation,
          body.raidOwnerId,
          body.raidImpactId,
          body.raisedDate,
          body.targetDate,
          body.raidStatusId,
          body.userId,
        ],
        (err, data) => {
          if (err) {
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
        }
      );
    });
  });
};

const updateProjectRaid = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTWEEKRAID_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.projectId,
          body.projectWeekId,
          body.raidTypeId,
          body.desc,
          body.mitigation,
          body.raidOwnerId,
          body.raidImpactId,
          body.raisedDate,
          body.targetDate,
          body.raidStatusId,
          body.userId,
        ],
        (err, data) => {
          if (err) {
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
        }
      );
    });
  });
};

const getWsr = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_PROJECTWEEK_SEARCH(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.week, body.status, body.clientId, body.projectId, body.userId], (err, data) => {
        if (err) {
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

const getProjectFlag = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_FLAG_GET(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.projectId, body.projectWeekId, body.FlagType, body.userId], (err, data) => {
        if (err) {
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

const projectFlagApplay = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_FLAG_APPLY(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.id,
          body.projectId,
          body.projectWeekId,
          body.FlagType,
          body.Date,
          body.clientPoc,
          body.designationId,
          body.recipient,
          body.summary,
          body.userId,
        ],
        (err, data) => {
          if (err) {
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

const deleteAttachment = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_ATTACHMENT_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

const deleteTeamMember = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.PRJ_TEAMMEMBER_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id], (err, data) => {
        if (err) {
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

module.exports = {
  createProject,
  updateProject,
  getProjectById,
  searchProject,
  createProjAttachment,
  updateProjAttachment,
  getAttachment,
  getComposition,
  createComposition,
  updateComposition,
  deleteComposition,
  createProjectWeek,
  updateProjectWeek,
  getProjectWeekById,
  getProjectRaidById,
  deleteProjectRaid,
  searchProjectAll,
  prjectlistByManager,
  addTeamMember,
  createProjectRaid,
  updateProjectRaid,
  getProjectWeekGetByProjectId,
  getWsr,
  getProjectManager,
  teamMemberByProject,
  deleteComposition_ByID,
  getProjectFlag,
  projectFlagApplay,
  deleteAttachment,
  deleteTeamMember,
};
