
const dbConfig = {
  server: "20.74.144.0",
  port: 58974,
  user:  "client",
  password: "Client@!*@&#^$%",
  database: "ILT20Audra",
  // pool: {
  //   max: 10,
  //   min: 0,
  //   idleTimeoutMillis: 30000
  // },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true,
    trustedConnection: true
  }
}

module.exports = dbConfig;