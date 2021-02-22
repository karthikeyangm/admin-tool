
/**
 * sendEmail module to perform email operations.
 * @module sendEmail Model
 * @see {@link sendEmail}
 */

var ObjectID = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');

module.exports = {
    /**
    * * In sendMailModel method to send email.<br>
    * @param  {string} toAddress Its contains toaddress of receivers.
    * @param  {string} subject Its contains subject.
    * @param  {string} message Its contains message.
    * @param  {string} htmlMsg Its contains html message.
    * @return {Object} Its return success or failure message.
    */
    sendMailModel: (maillist, subject, message,htmlMsg) => {
        return new Promise((resolve, reject) => {

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'pradepb2@gmail.com',
                    pass: 'pradep1995'
                }
            });

            maillist.forEach(function (to, i, array) {
                var mailOptions = {
                    from: 'pradepb2@gmail.com',
                    // to: toAddress,
                    subject: subject,
                    text: message,
                    html:htmlMsg
                };
                mailOptions.to = to
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        reject(error)
                    } else {
                        if (i === maillist.length - 1) {
                            resolve(info.response)
                        }
                        // resolve(info.response)
                    }
                });
            })
        })
    }

}