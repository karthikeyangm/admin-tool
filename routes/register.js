/**
 * Token Genration module to perform File based operations.
 * @module Register
 * @see {@link UserModel} * 
 */

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secretKey = require("../config/config")
var usermodel = require("../models/usermodel")
var crypto = require('crypto');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = '789456123';
const UrlTenant = require('../models/TenantModel');
var emailNotification = require('../models/sendEmail')

var util = require("../utils/util");
/**
 * Sends a HTTP POST request to generate registerUser based on user credantial details.
 * </br> 
 * @function registerUser
 * @path {POST} path /register/registerUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user details to create user.
 * @param userStore  {Object} All parsed data is stored in userStore object
 * @param {Function}  usermodel.validateUser() This function is used to pass
 *  userStore data from users routes to user model 
 * to validate credantials and to generate tokens.
 * @return {Object} Its return success or failure message and user data.
 */

router.post('/registerUser', async (req, res) => {
    try {
        var data = req.body;
        var salt = '1234567890'; // default salt
        var hash = crypto.pbkdf2Sync(data.password, salt, 1000, 24, 'sha512');
        var userStore = {};
        userStore = {
            firstname: data.firstname,
            lastname: data.lastname,
            mobile: data.mobile,
            username: data.email,
            email: data.email,
            role: "2",
            password: (Buffer.from(hash).toString('hex')),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'Active',
            superAdmin: false,
            TenantId: (data.tenantdetails[0].tenantId).toString(),
            tenantName: data.tenantdetails[0].tenantname,
            userRegisterd: 1,
            emailVerified: 1,
            firstLogin : 0
        };
        var excelldataResponse = await usermodel.registerUserModel('users', userStore)
        if (excelldataResponse.success) {
            let emailId = [data.email]
            let subject = `${data.tenantdetails[0].tenantname} - User Registration`
            let message = `${data.firstname} registred successfully.`
            let htmlMsg = `Hi<strong>  ${userStore.firstname} ${userStore.lastname} </strong>,<br><br>Recently you had registred in ${userStore.tenantName} .
            So please <a href="${ process.env.baseUrl}#/pages/verifyregister/${excelldataResponse.encrypted}?tendetail=${req.body.tenantEncptdetail}">click here</a> 
            to verify the registraion process.<br/><br>Thanks,<br>${userStore.tenantName} - Admin<br><br>`
            var emailMsg =  emailNotification.sendMailModel(emailId, subject, message, htmlMsg)
            res.status(200).send(excelldataResponse);
        } else {

            let result = {
                success: false,
                status: 403,
                message: "User not register."
            }
            res.status(200).send(excelldataResponse);
        }
    } catch (e) {
        util.writeLog(`${e} -> User register`, 'post:/register/registerUser');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'User count not register';
        res.send(error);
    }
})



router.post('/verifyEmailRegister', async (req, res) => {
    try {
        let vDecprtId = req.body.encptId
        var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
        let decrypted = JSON.parse(decipher.update(vDecprtId, 'hex', 'utf8') + decipher.final('utf8'));
        var verifyEmailRes = await usermodel.verifyUserEmail('users', decrypted[0])
        res.send(verifyEmailRes)
    } catch (e) {
        util.writeLog(`${e} -> User register verification`, 'post:/register/verifyEmailRegister');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'User count not verified';
        res.send(error);
    }
})


module.exports = router;
