const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
var sql = require('../utils/sql-connect');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const getMetadata = async (type, id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_METADATA_BYID(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [type, id], (err, data) => {
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
  })
};

const getAllMetadata = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_METADATA_GET(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
  })
};

const addMetadata = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_METADATA_APPLY(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.metadataId, null, body.name, body.description, body.isActive, body.userId], (err, data) => {
        if (err) {
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          console.log(json[0])
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve("success");
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  })
};
const updateMetadata = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_METADATA_APPLY(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.metadataId, body.id, body.name, body.description, body.isActive, body.userId], (err, data) => {
        if (err) {
          reject(err);
        } else {
          var string = JSON.stringify(data);
          var json = JSON.parse(string);
          console.log(json[0])
          if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
            conn.release();
            resolve("success");
          } else {
            resolve(json[json.length - 1][0].return_message);
          }
        }
      });
    });
  })
};
const deleteMetadata = async (type, id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.LKP_METADATA_DELETE(?,?,1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [type, id], (err, data) => {
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
  })
};

module.exports = {
  getMetadata, addMetadata, updateMetadata, deleteMetadata, getAllMetadata
};
