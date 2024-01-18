const nodemailer = require('nodemailer');

function SMTPConfig() {
  let transporter = nodemailer.createTransport({
    host: 'txpro15.fcomet.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'mailaccount@neuralschemait.com', // generated ethereal user
      pass: 'Mail#Nsit@#0815', // generated ethereal password
    },
  });
  return transporter;
}

async function EmailSend(info) {
  info.from = '"Portray 360" <mailaccount@neuralschemait.com>';
  let emailConfig = SMTPConfig();
  return await emailConfig
    .sendMail(info)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
module.exports.SMTPConfig = SMTPConfig;
module.exports.EmailSend = EmailSend;
