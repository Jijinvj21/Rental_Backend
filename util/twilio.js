require("dotenv").config()
const twilio = require('twilio');
const TWILIO_ACCOUNT_SID= process.env.accountSid
const TWILIO_AUTH_TOKEN=process.env.authToken
const TWILIO_SERVICE_ID = process.env.serviceid



const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const sendVerificationToken = (phoneNumber) => {

  return new Promise((resolve) => {
    client.verify
      .v2.services(TWILIO_SERVICE_ID)
      .verifications
      .create({
        to: `+91${phoneNumber}`,
        channel: 'sms'
      }).then((data) => {
        resolve(true);
      }).catch((error) => {
        console.log(error);
        resolve(false);
      });
  });
};

const checkVerificationToken = (otp, phoneNumber) => {



  return new Promise((resolve) => {
    client.verify.v2
      .services(TWILIO_SERVICE_ID)
      .verificationChecks
      .create({
        to: `+91${phoneNumber}`,
        code: otp
      }).then((data) => {
        if (data.valid) {
          resolve(true);

        } else {
          resolve(false);

        }
      }).catch((error) => {
        console.log(error);
        resolve(false);
      });
  });
};

module.exports = {
  sendVerificationToken,
  checkVerificationToken
};


  
