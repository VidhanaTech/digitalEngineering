var mysql = require('mysql');
const config = require('../config/config');

var sqlConnect = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: 10000,
    queueLimit: 1000,
    multipleStatements: true
  });

  
  module.exports = sqlConnect;