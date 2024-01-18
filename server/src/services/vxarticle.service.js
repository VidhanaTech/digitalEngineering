const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
var sql = require('../utils/sql-connect');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const addVXArtical = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.VX_ARTICLE_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.Id,
          4,
          body.title,
          body.clientId,
          body.sourceId,
          body.sourceTitle,
          body.revenue,
          body.revenueClient,
          body.revenueInternal,
          body.cost,
          body.costClient,
          body.costInternal,
          body.personDays,
          body.description,
          body.Keywords,
          body.articalby,
          body.projectid,
          body.categoryid,
          body.statusid,
          body.viewstatus,
          body.UserId,
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
const getSourceTitle = async (categoryid) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.VX_ARTICLE_SOURCE_TITLE_GET(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [categoryid], (err, data) => {
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

const articlegeybyid = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_VXARTICLE_GET(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id], (err, data) => {
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

module.exports = {
  addVXArtical,
  getSourceTitle,
  articlegeybyid,
};
