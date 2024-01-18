const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
var sql = require('../utils/sql-connect');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const addKMArtical = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_APPLY(?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.Id,
          body.type,
          body.title,
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

const addKMEvent = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_EVENT_APPLY(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [
          body.Id,
          body.title,
          body.speaker,
          body.date,
          body.endDate,
          body.start_time,
          body.end_time,
          body.location,
          body.description,
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

const KMEventList = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_EVENT_GET(1,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
};

const createArticleAttachment = async (req) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const body = req.body;
      let filePath = req.file.destination + '/' + req.file.filename;
      filePath = filePath.substring(1);
      const filename = req.file.originalname;
      const sp = `call digital_experience.KM_ARTICLEATTACHMENT_APPLY(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.articleId, filename, filePath, body.userId], (err, data) => {
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

const uploadArticleAttachment = async (req) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const body = req.body;
      const sp = `call digital_experience.KM_ARTICLEATTACHMENT_APPLY(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.articleId, body.filename, body.filePath, body.userId], (err, data) => {
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

const createEventAttachment = async (req) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const body = req.body;
      let filePath = req.file.destination + '/' + req.file.filename;
      filePath = filePath.substring(1);
      const filename = req.file.originalname;
      const sp = `call digital_experience.KM_EVENT_ATTACHMENT_APPLY(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.eventId, body.type, filename, filePath, body.userId], (err, data) => {
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

const searchKMArtical = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICAL_SEARCH(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.projectid, body.articalby, body.categoryid, body.statusid, body.UserId], (err, data) => {
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

const addLikeByArtical = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICAL_LIKES_ADD(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.articalId, body.likedBy, body.UserId], (err, data) => {
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

const addCommentByArtical = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICAL_COMMENTS_ADD(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.articalId, body.commentId, body.comments, body.commentby, body.UserId], (err, data) => {
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

const disLikeArtical = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICAL_DISLIKE(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.articalId, body.likedBy], (err, data) => {
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

const deleteArticalComment = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICAL_DELETE_COMMENT(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.articalId, body.id, body.parentCmd], (err, data) => {
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

const topContributors = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICAL_TOP_CONTRIBUTORS(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
};

const latestArtical = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_LATEST_ARTICAL(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.UserId, body.categoryId, body.des, body.year, body.month, body.sort, body.limit], (err, data) => {
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

const leadingRegionCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.NEW_DASHBOARD_LOCATION_COUNT(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [ body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId], (err, data) => {
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

const artifactConsumptionCount = async (body, rewardId = null) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.NEW_DASHBOARD_ARTICLE_CONSUMPTION(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [rewardId, body.year, body.month], (err, data) => {
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

const EventsData = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_EVENT_COUNTS(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [ body.year, body.month], (err, data) => {
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

const UpvotesCount = async (body, rewardId = null) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_ARTICLE_UPVOTES_COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year], (err, data) => {
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

const knowledgeCreditCount = async (body, rewardId = null) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.NEW_DASHBOARD_KNOWLEDGE_CREDITS(?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [rewardId, body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const badgesCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_BADGES_LEVEL_GET(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [ body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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


const eventgetById = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_EVENT_GETBYID(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const eventattachById = async (id, type) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_EVENT_ATTACHMENT_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [id, type], (err, data) => {
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

const latestArticalnew = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_LATEST_ARTICAL_NEW(?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.UserId, body.des, body.sort, body.year, body.month, body.start, body.limit, body.articleId],
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

const articleCategorywiseCount = async (param) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_CATEGORYWISE_COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [param], (err, data) => {
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

const eventRegisterForList = async (userId) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_EVENT_List(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [userId], (err, data) => {
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

const getPopularArticleList = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_POPULAR_ARTICLE_BY_LIKE(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
};

const reviewApproveList = async () => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.ARTIFACT_APPROVE_ACCESS_LIST(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
};
const articleList = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICAL_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.UserId], (err, data) => {
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

const myarticle = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_MY_ARTICAL(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.UserId, body.limit], (err, data) => {
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

const kmarticledashboard = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_DASHBOARD_COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.UserId], (err, data) => {
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

const ArtifactsPublishedCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.ARTIFACTS_DASHBOARD_COUNT(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const kmdashboard = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year], (err, data) => {
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

const kmdashboardArticleCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_ARTICLE_CATEGORY_COUNT(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const kmdashboardClientwiseArticleCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_ARTICLE_CLIENTWISE_COUNT(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const kmdashboardRegionwiseArticleCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_MONTHWISE_REGION(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const kmdashboardMonthwiseArticleCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_ARTICLE_MONTHWISE_ARTICLE_COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year], (err, data) => {
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

const kmdashboardVxMonthwiseCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_VX_MONTHWISE__COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year], (err, data) => {
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

const kmdashboardMonthwiseCaseStudyCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_ARTICLE_MONTHWISE_CASESTUDY_COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year], (err, data) => {
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

const kmdashboardMonthwiseSearchCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_SEARCH_CHART_DATA(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year], (err, data) => {
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

const kmdashboardMonthwiseKnowledgeCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_ARTICLE_MONTHWISE_KNOWLEDGE_COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year], (err, data) => {
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

const kmdashboard_teamcontribution = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_TEAM_CONTRIBUTION_SUMMARY(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const articlecomments = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_COMMENTS_BYARTICLEID(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const articlesubcomments = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_SUBCOMMENTS_BYARTICLEID(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const kmarticleunpublished = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_UNPUBLISHED_ARTICLE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.UserId], (err, data) => {
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

const kmarticleMyReviewList = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_REVIEW_MY_REVIEW_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.UserId], (err, data) => {
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

const kmdashboardtotalarticle = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_TOTAL_ARTICLE(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const searchCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_ARTICLE_MONTHWISE_SEARCH_COUNT(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.userId, body.question, body.type],
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

const GetsearchCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_ARTICLE_GET_SEARCH_COUNT(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.month, body.year], (err, data) => {
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

const searchSuccCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_ARTICLE_SUCCESSFUL_SEARCH_COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year], (err, data) => {
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

const GetSearchSuccCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_ARTICLE_GET_SUCCESS_SEARCH_COUNT(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
};


const GetUsersDataBarChart = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_USERS_CHART_DATA(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp,[body.year], (err, data) => {
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

const TotalRegisteredUsersCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_TOTAL_REG_USERS_COUNT(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
};

const kmdashtotaltotalusers = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_TOTAL_USERS(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
};
const kmdashtotalactivetotalusers = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_ACTIVE_USER(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId], (err, data) => {
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
const kmdashboardstarproject = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_STARTPROJECT(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const RevisionArticlesGetByUserId = async (UserId) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.GET_REVISION_ARTICLES_BY_USERID(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [UserId], (err, data) => {
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

const kmdashboardtotalcaststudies = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_TOTAL_CASESTUDIES(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const kmdashboardtotalbestpractices = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_TOTAL_BESTPRACTICES(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const kmdashboardstarofmonth = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_DASHBOARD_STARTOFMONTH(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const articlegeybyid = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_GET(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const getArticleAttachement = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_ATTACHEMENT_GET(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const article_approve = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_APPROVE(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.userid, body.status, body.viewstatus], (err, data) => {
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

const articleRevisionApply = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_REVISION_APPLY(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.articleId, body.comment, body.userId], (err, data) => {
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

const articleRevisionGet = async (articleId) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_REVISION_GETBY_ARTICLEID(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [articleId], (err, data) => {
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

const articleRevisionSet = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_SET_REVIEW(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.status, body.userId], (err, data) => {
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

const cancelEvent = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_EVENT_CANCEL(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
const eventRegisterListById = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_EVENT_REGISTERLIST_GET(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const eventRegister = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_EVENT_REGISTER(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.eventId, body.userId], (err, data) => {
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
const deleteAttachment = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_ARTICLE_ATTACHMENT_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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

const reviewApproveApply = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.ARTIFACT_APPROVE_ACCESS_APPLY(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.id, body.roleId, body.userId], (err, data) => {
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

const articleUPandDownVoteApply = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_ARTICLE_VOTES_COUNT(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.userId, body.articleId, body.type], (err, data) => {
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

const articleUPandDownVoteRevert = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_REVERT_ARTICLE_VOTE(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.userId, body.articleId, body.type], (err, data) => {
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

const getUpandDownVotes = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_ARTICLE_GET_VOTES_COUNT(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.type, body.month, body.year ], (err, data) => {
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

const knowledgeCreditsContriConsumption = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KNOWLEDGE_CREDITS_CONSUMPTION_CONTRIBUTION(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year, body.month], (err, data) => {
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

const EventDashboardCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.EVENT_DASHBOARD_COUNT(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year, body.month], (err, data) => {
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

const CADashboardCount = async (body) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.CUSTOMER_ACCOLADES_DASHBOARD_COUNT(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(
        sp,
        [body.year, body.month, body.projectId, body.CategoryId, body.ClientId, body.domainId, body.regionId],
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

const deleteEventAttachment = async (id) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.KM_EVENT_ATTACHMENT_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
const DownvotesCount = async (body, rewardId = null) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_ARTICLE_DOWNVOTES_COUNT(?,@return_code,@return_message); select @return_code return_code,@return_message return_message`;
      conn.query(sp, [body.year], (err, data) => {
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
const GetDownvotesCount = async (body, rewardId = null) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_ARTICLE_GET_DOWNVOTES_COUNT(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
const GetUpvotesCount = async (body, rewardId = null) => {
  return new Promise((resolve, reject) => {
    sql.getConnection((err, conn) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const sp = `call digital_experience.DASHBOARD_ARTICLE_GET_UPVOTES_COUNT(@return_code,@return_message); select @return_code return_code,@return_message return_message`;
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
  addKMArtical,
  addKMEvent,
  KMEventList,
  searchKMArtical,
  addLikeByArtical,
  addCommentByArtical,
  disLikeArtical,
  kmdashboardtotalarticle,
  kmdashtotaltotalusers,
  kmdashboardtotalcaststudies,
  kmdashboardstarofmonth,
  kmdashboardtotalbestpractices,
  kmdashboardstarproject,
  deleteArticalComment,
  topContributors,
  latestArtical,
  leadingRegionCount,
  artifactConsumptionCount,
  knowledgeCreditCount,
  latestArticalnew,
  articleCategorywiseCount,
  myarticle,
  kmarticledashboard,
  kmdashboard,
  articlecomments,
  articlesubcomments,
  articleList,
  createArticleAttachment,
  createEventAttachment,
  kmdashboardArticleCount,
  kmdashboardClientwiseArticleCount,
  kmdashboardMonthwiseArticleCount,
  kmdashboardMonthwiseCaseStudyCount,
  kmdashboardMonthwiseKnowledgeCount,
  kmdashboard_teamcontribution,
  kmarticleunpublished,
  articlegeybyid,
  article_approve,
  getArticleAttachement,
  deleteAttachment,
  articleRevisionApply,
  articleRevisionGet,
  kmdashtotalactivetotalusers,
  kmdashboardVxMonthwiseCount,
  articleRevisionSet,
  eventgetById,
  eventattachById,
  cancelEvent,
  eventRegister,
  eventRegisterForList,
  kmarticleMyReviewList,
  eventRegisterListById,
  uploadArticleAttachment,
  getPopularArticleList,
  deleteEventAttachment,
  EventDashboardCount,
  CADashboardCount,
  badgesCount,
  reviewApproveApply,
  reviewApproveList,
  ArtifactsPublishedCount,
  searchCount,
  GetsearchCount,
  TotalRegisteredUsersCount,
  UpvotesCount,
  GetUpvotesCount,
  DownvotesCount,
  GetDownvotesCount,
  RevisionArticlesGetByUserId,
  kmdashboardRegionwiseArticleCount,
  GetSearchSuccCount,
  searchSuccCount,
  articleUPandDownVoteApply,
  getUpandDownVotes,
  knowledgeCreditsContriConsumption,
  GetUsersDataBarChart,
  kmdashboardMonthwiseSearchCount,
  EventsData,
  articleUPandDownVoteRevert,
};
