// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
/*const sgMail = require('@sendgrid/mail');

API_KEY = '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'
sgMail.setApiKey(API_KEY);
const msg = {
  to: 'polyanovskyyol@gmail.com',
  from: 'polyanovskyyol@gmail.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  
};
sgMail.send(msg);*/

const nodemailer = require('nodemailer')


var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c79e1ed3207e5d",
      pass: "4681c5a9bac573"
    }
  });
  
function mailSend(userName, token){
  const message = {
    from: 'elonmusk@tesla.com', // Sender address
    to: 'to@email.com',         // List of recipients
    subject: 'Design Your Model S | Tesla', // Subject line
    html: `Hello ${userName} have the most fun you can in a car. Get your Tesla today!
    to confirm your password click <a href='http://localhost:3000/users/confirm/${token}'>Confirm email</a>` // Plain text body
  };

  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
}

module.exports = mailSend