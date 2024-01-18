const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const dbConn = require('../models/dbConfig');
var bcrypt = require('bcryptjs');
var sql = require('../utils/sql-connect');
const { Console } = require('winston/lib/winston/transports');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const getProjectList = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.ADM_DASHBOARD(?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.organizationid,
          body.countryid,
          body.capability,
          body.industryid,
          body.clientid,
          body.projecttypeid,
          body.statusid,
          body.projectend,
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

const getEngagementCount = async (body, type) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.ADM_DASHBOARD_ENGAGEMENT_COUNT(?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.organizationid,
          body.countryid,
          body.capability,
          body.industryid,
          body.clientid,
          body.projecttypeid,
          body.statusid,
          body.projectend,
          type,
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

const getFlagCount = async (body, type) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.ADM_DASHBOARD_FLAG_COUNT(?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.organizationid,
          body.countryid,
          body.capability,
          body.industryid,
          body.clientid,
          body.projecttypeid,
          body.statusid,
          body.projectend,
          type,
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

const getRiskIssue = async (body, type) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.ADM_DASHBOARD_RISK_ISSUE_COUNT(?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.organizationid,
          body.countryid,
          body.capability,
          body.industryid,
          body.clientid,
          body.projecttypeid,
          body.statusid,
          body.projectend,
          type,
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

const getCountbyArticleType = async (body, type) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.ADM_DASHBOARD_COUNTBY_ARTICLE_TYPE(?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.organizationid,
          body.countryid,
          body.capability,
          body.industryid,
          body.clientid,
          body.projecttypeid,
          body.statusid,
          body.projectend,
          type,
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

const getOrganization = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_ORGANIZATION_GET(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const getCountry = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_COUNTRY_GET(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const getCapabilty = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_CAPABILITY_GET(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const getIndustry = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_INDUSTRY_GET(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const getClient = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CLI_CLIENT_GET_ALL(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const getProjectType = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_PROJECTTYPE_GET(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const getProjectStatus = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_PROJECTSTATUS_GET(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const getDeliveryType = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_DELIVERYTYPE_GET(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const getEngagementType = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_ENGAGEMENT_GET(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

module.exports = {
  getProjectList,
  getFlagCount,
  getCountry,
  getOrganization,
  getCapabilty,
  getIndustry,
  getClient,
  getProjectType,
  getProjectStatus,
  getDeliveryType,
  getRiskIssue,
  getEngagementCount,
  getEngagementType,
  getCountbyArticleType,
};
