/**
 * forgotPwd module to perform forgotPwd operations..
 * @module forgotPwd
 * @see {@link forgotPwd}
 */

var express = require('express');
var router = express.Router();
var util = require("../utils/util");
var ObjectID = require('mongodb').ObjectID;
var forgotPwdModel = require('../models/forgotModel')
var emailNotification = require('../models/sendEmail')
var crypto = require('crypto');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = '789456123';
var jwt = require('jsonwebtoken');
/**
 * Sends a HTTP post request for forgot password.
 * </br>
 * @function forgotPassword
 * 
 * @path {post} path /forgotPwd/forgotPassword
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  forgotPwdModel.forgotPassword() This function is used to pass data from forgotPwdModel 
 * routes to forgotPassword model to send link in mail.
 * @return {Object} Its retrun success or failure message.
 */

router.post('/forgotPassword', (req, res) => {
    try {

        const vSendForgotPwd = forgotPwdModel.createEncryptUrl('users', req.body.email)

        vSendForgotPwd.then((data) => {

            if (data.success) {
                let emailId = [data.data[0].email]
                let subject = `${req.body.tenantName}- forgot password request.`
                let message = ``
                let htmlMsg = 'Hello<strong> ' + data.data[0].firstname + ' ' + data.data[0].lastname + `</strong>,<br><br>Recently you had submitted a 
             request you to reset your password.
             If you did so, <a href="${process.env.baseUrl}#/pages/passwordredirect/${data.encryptDataValue}?tendetail=${req.body.tenantDeatails}">click here</a> 
             to proceed with resetting your password.<br/><br>Thanks,<br>${req.body.tenantName} - Admin<br><br>`
                var emailMsg = emailNotification.sendMailModel(emailId, subject, message, htmlMsg)
                let dataSuccess = {
                    success: true,
                    status: 200,
                    message: 'Mail sent successfully.'
                }
                res.status(200).send(dataSuccess)

            } else {
                res.status(200).send(data)
            }
        }).catch(err => {
            util.writeLog(`${err} -> post forgotPassword Error`, 'post:/forgotPwd/forgotPassword');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'User email not found';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> post forgotPassword catch Error`, 'post:/forgotPwd/forgotPassword');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'User email not found';
        res.send(error);
    }
})


router.post('/validateId', (req, res) => {
    try {
        const validateValue = forgotPwdModel.validateId('users', req.body)
        validateValue.then((data) => {
            res.send(data)
        }).catch(err => {
            util.writeLog(`${err} -> post validateId Error`, 'post:/forgotPwd/validateId');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Link Not Valid';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> post validateId Error`, 'post:/forgotPwd/validateId');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

router.post('/updatePassword', (req, res) => {
    try {
        var salt = '1234567890'; // default salt
        var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 24, 'sha512');
        let parmsdata = {
            password: (Buffer.from(hash).toString('hex')),
            email: req.body.email
        }
        const updatePasswordValue = forgotPwdModel.updatePassword('users', parmsdata)

        updatePasswordValue.then((data) => {
            res.send(data)
        }).catch(err => {
            util.writeLog(`${err} -> post updatePassword Error`, 'post:/forgotPwd/updatePassword');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Link Not Valid';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> post updatePassword Error`, 'post:/forgotPwd/updatePassword');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

router.post('/changePasswordFirstLogin', (req, res) => {
    try {
        var salt = '1234567890'; // default salt
        var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 24, 'sha512');
        let parmsdata = {
            password: (Buffer.from(hash).toString('hex')),
            email: req.body.email
        }
        const updatePasswordValue = forgotPwdModel.changePasswordFirstLogin('users', parmsdata)

        updatePasswordValue.then((data) => {
            res.send(data)
        }).catch(err => {
            util.writeLog(`${err} -> post changePasswordFirstLogin Error`, 'post:/forgotPwd/changePasswordFirstLogin');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Link Not Valid';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> post changePasswordFirstLogin Error`, 'post:/forgotPwd/changePasswordFirstLogin');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

router.post('/ProfilePasswordUpdate', (req, res) => {
    try {
        var salt = '1234567890'; // default salt
        var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 24, 'sha512');
        let parmsdata = {
            password: (Buffer.from(hash).toString('hex')),
            email: req.body.email
        }
        const updatePasswordValue = forgotPwdModel.profilePasswordUpdate('users', parmsdata)

        updatePasswordValue.then((data) => {
            res.send(data)
        }).catch(err => {
            util.writeLog(`${err} -> post ProfilePasswordUpdate Error`, 'post:/forgotPwd/ProfilePasswordUpdate');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Link Not Valid';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> post ProfilePasswordUpdate Error`, 'post:/forgotPwd/ProfilePasswordUpdate');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})


module.exports = router