const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const dbConn = require('../models/dbConfig');
var bcrypt = require('bcryptjs');
var sql = require('../utils/sql-connect');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const getClientById = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENT_GET(?,1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const getClients = async (body) => {
  if (body.clientId == 0) {
    return new Promise((resolve, reject) => {
      sql.getConnection((err, conn) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        const sp = `call digital_experience.CLI_CLIENT_SEARCH(null,null,null,null,1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
        conn.query(sp, (err, data) => {
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
  } else {
    return new Promise((resolve, reject) => {
      sql.getConnection((err, conn) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        const sp = `call digital_experience.CLI_CLIENT_SEARCH(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
        conn.query(sp, [body.clientId, body.domainId, body.towerId, body.organizationId, body.userId], (err, data) => {
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
  }
};
const addClient = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENT_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          null,
          body.clientName,
          body.organizationId,
          body.code,
          body.about,
          body.effectiveDt,
          body.status,
          body.endDt,
          body.poc,
          body.designationId,
          body.engagementLead,
          body.engagementEmail,
          body.domainId,
          body.clientType,
          body.globalClient,
          body.towerId,
          body.serviceTypeId,
          body.poLocId,
          body.penaltyClauseApplicable,
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

const clientLocationApply = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENTDELIVERYLOCATION_APPLY(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.clientId, body.locationId, body.userId], (err, data) => {
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

const getClientLocation = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENTDELIVERYLOCATION_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.clientId, body.userId], (err, data) => {
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
const updateClient = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENT_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.clientId,
          body.clientName,
          body.organizationId,
          body.code,
          body.about,
          body.effectiveDt,
          body.status,
          body.endDt,
          body.poc,
          body.designationId,
          body.engagementLead,
          body.engagementEmail,
          body.domainId,
          body.clientType,
          body.globalClient,
          body.towerId,
          body.serviceTypeId,
          body.poLocId,
          body.penaltyClauseApplicable,
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

const deleteClientLocation = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENTDELIVERYLOCATION_DELETE(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.clientId, body.locationId], (err, data) => {
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
const addAttachment = async (req) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const body = req.body;
      let filePath = req.file.destination + '/' + req.file.filename;
      filePath = filePath.substring(1);
      const sp = `call digital_experience.CLI_CLIENTATTACHMENT_APPLY(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [null, body.clientId, body.attachmentTypeId, filePath, body.userId], (err, data) => {
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
const getAttachment = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENTATTACHMENT_GET(?,1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
const updateAttachment = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENTATTACHMENT_APPLY(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.attachmentId, body.clientId, body.attachmentTypeId, body.filePath, body.userId], (err, data) => {
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
const getEngagement = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENTENGAGEMENT_GET(?,1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
const addEngagement = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENTENGAGEMENT_APPLY(?,?,?,1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [null, body.clientId, body.engagementId], (err, data) => {
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
const updateEngagement = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENTENGAGEMENT_APPLY(?,?,?,1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.clientId, body.engagementId], (err, data) => {
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

const deleteAttachment = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_ATTACHMENT_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
  getClientById,
  clientLocationApply,
  getClientLocation,
  getClients,
  addClient,
  updateClient,
  addAttachment,
  getAttachment,
  updateAttachment,
  getEngagement,
  addEngagement,
  updateEngagement,
  deleteAttachment,
  deleteClientLocation,
};
