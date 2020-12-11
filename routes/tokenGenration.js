/**
 * Token Genration module to perform File based operations.
 * @module TokenGenration
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

var util = require("../utils/util");
var nodemailer = require('nodemailer');
const randtoken = require('rand-token');


const refreshTokens = {};
/**
 * Sends a HTTP POST request to generate token based on user credantial details.
 * </br> 
 * @function token
 * @path {POST} path /token/token
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user details to create tokens.
 * @param userStore  {Object} All parsed data is stored in userStore object
 * @param {Function}  usermodel.validateUser() This function is used to pass
 *  userStore data from users routes to user model 
 * to validate credantials and to generate tokens.
 * @return {Object} Its return success or failure message and user data.
 */


router.post('/token', function (req, res, next) {
  var data = req.body;
  if (!data.username || !data.password) {
    util.writeLog('Invalid Data! username and password both are required', 'post:/routes/tokenGenration');
    var error = new Error();
    error.success = false;
    error.status = 400;
    error.message = 'Invalid Data! username and password both are required';
    return res.send(error);
  }
  var TenantDetail = ""
  if (req.query.tendetail == undefined) {
    TenantDetail = req.headers.tendetail
  } else {
    TenantDetail = req.query.tendetail
  }
  var salt = '1234567890'; // default salt
  var hash = crypto.pbkdf2Sync(data.password, salt, 1000, 24, 'sha512');
  var userStore = {};
  userStore = {
    username: data.username,
    superAdmin: data.superAdmin,
    password: (new Buffer(hash).toString('hex')),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const vCreateUser = usermodel.validateUser('users', userStore)
  vCreateUser.then((data) => {
    if (data.response.length > 0) {
      if (data.success) {
        const id = { id: data.response[0]._id }
        const token = jwt.sign(id, secretKey.secretKey,{ expiresIn: '10h' })
        const refreshToken = randtoken.uid(256);
        refreshTokens[refreshToken] = data.response[0]._id
        const tokenObj = {
          token: token,
          refreshToken: refreshToken
        }
        return res.send({ ...tokenObj, ...data })
      }
    }
    else {
      let tokenObj = {
        success: false,
        status: 403,
        message: 'Incorrect usename and password'
      }
      return res.send(tokenObj)
    }
  })
});


router.post('/shortUrl', async (req, res) => {
  try {
    const url = await UrlTenant.findOne({ urlCode: req.body.shortId });

    if (url) {
      let result = {
        status: 200,
        message: 'success',
        data: url
      }
      // return res.redirect(url.Tenant_Url);
      return res.json(result)
    } else {
      let result = {
        status: 400,
        message: 'Not Found'
      }
      return res.json(result)
    }
  } catch (err) {
    res.status(500).json('Server error');
  }



})

/**
 * Sends a HTTP POST request to get tenant details.
 * </br> 
 * @function GetTenantDetailsInEncryption
 * @path {POST} path /token/GetTenantDetailsInEncryption
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain tenant encrypt details to decrypt data.
 * @return {Object} Its return decrypted data
 */

router.post('/GetTenantDetailsInEncryption', (req, res) => {
  try {
    let TenantDetail = req.body.tenantDeatails
    let decipher = crypto.createDecipher(algorithm, key);
    decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));
    res.json(decrypted)
  } catch (e) {
    util.writeLog(`${e} -> get tenant decryption`, 'post:/token/GetTenantDetailsInEncryption');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'decryption unsuccessful';
    res.send(error);
  }
})


router.post('/refresh', function (req, res) {
  const refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens) {
    const user = {
      'id': refreshTokens[refreshToken],
    }
    const token = jwt.sign(user, secretKey.secretKey, { expiresIn: '7d' });
    res.json({jwt: token})
  }
  else {
    res.sendStatus(401);
  }
});

router.post('/logout', function (req, res) { 
  const refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens) { 
    delete refreshTokens[refreshToken];
  } 
  res.sendStatus(204); 
});

module.exports = router;
