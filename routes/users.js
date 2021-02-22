
/**
 * User module to perform user based operations..
 * @module User 
 * @see {@link UserModel}
 */

var express = require('express');
var router = express.Router();
var usermodel = require("../models/usermodel")
var ObjectID = require('mongodb').ObjectID;
var crypto = require('crypto');
var util = require("../utils/util");
var secretKey = require("../config/config")
var jwt = require('jsonwebtoken');

// var crypto = require('crypto');
const q = require('q');
const webPush = require('web-push');
const { async } = require('q');
var emailNotification = require('../models/sendEmail')
/**
 * Sends a HTTP POST request to create user record based on tenant Login.
 * </br> 
 * @function createUser
 * @function
 * @path {POST} path /users/createUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user details to store in  userStore.
 * @param userStore  {Object} All parsed data is stored in userStore object
 * @param {Function}  usermodel.createUser() This function is used to pass userStore data from users routes to user model 
 * to create record in database
 * @return {Object} Its return success or failure message based on data insertion.
 */

router.post('/createUser', (req, res) => {
  var data = req.body;
  if (!data.email || !data.password) {
    util.writeLog('Invalid Data! username and password both are required', 'post:/user/createUser');
    var error = new Error();
    error.success = false;
    error.status = 400;
    error.message = 'Invalid Data! username and password both are required';
    res.send(error);
  }
  if (data.SelectedGroup != undefined) {
    for (var i = 0; i < data.SelectedGroup.length; i++) {
      data.SelectedGroup[i] = ObjectID(data.SelectedGroup[i]);
    }
  }
  var salt = '1234567890'; // default salt
  var hash = crypto.pbkdf2Sync(data.password, salt, 1000, 24, 'sha512');
  var userStore = {};
  userStore = {
    firstname: data.firstname,
    lastname: data.lastname,
    mobile: data.mobile,
    username: data.email,
    email: data.email,
    role: data.role,
    password: (Buffer.from(hash).toString('hex')),
    createdAt: new Date(),
    updatedAt: new Date(),
    status: data.status,
    createdBy: ObjectID(data.createdBy),
    SelectedGroup: data.SelectedGroup || [],
    superAdmin: false,
    TenantId: data.TenantId,
    tenantName: data.tenantName,
    userRegisterd: 0,
    emailVerified: 0,
    firstLogin: 1,
    pwd: data.password
  };

  const vCreateUser = usermodel.createUser('users', userStore)
  vCreateUser.then((data) => {
    if (data.status == 200) {
      let vUsername = (userStore.email).split('@')
      let emailId = [userStore.email]
      let subject = `User created in ${userStore.tenantName}`
      let message = `${data.firstname} ${data.lastname} user created in ${data.tenantName}.`
      let htmlMsg = `<!DOCTYPE html>
      <html>
      <head>
      <style>
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
      }
      </style>
      </head>
      <body>      
      <h2>${userStore.tenantName}</h2>
      <p>${userStore.firstname} ${userStore.lastname} added in ${userStore.tenantName}. And your credentials are mentioned in below. Please 
      
      <a href="${ process.env.baseUrl}#/pages/login?tendetail=${req.body.tenantEncptdetail}">click here</a> 

      to access the application.
      </p>      
      <table style="width:100%">
        <tr>
          <th>Username</th>
          <th>Password</th> 
        </tr>
        <tr>
          <td>${vUsername[0]}</td>
          <td>${userStore.pwd}</td>
        </tr>
      </table>      
      </body>
      </html>
      `
      var emailMsg = emailNotification.sendMailModel(emailId, subject, message, htmlMsg)
      res.status(200).send(data)
    } else {
      res.status(200).send(data)
    }
  }).catch(err => {
    util.writeLog(`${err} -> createUser Error`, 'post:/users/createUser');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'User not created';
    res.send(error);
  })

})


/**
 * Sends a HTTP PUT request to update user record based on tenant Login.
 * </br>
 * @function updateUser
 * 
 * @function
 * @path {PUT} path /users/updateUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user details to store in  userStore.
 * @param :id {string} Id is used to update specific user. it represent _id.
 * @param userStore  {Object} All parsed data is stored in userStore object
 * @param {Function}  usermodel.updateUser() This function is used to pass userStore data from users 
 * routes to user model to update record in database
 * @return {Object} Its return success or failure message based on data updation.
 */
router.put('/updateUser/:id', (req, res) => {
  let useData = req.body
  let userStore = {
    firstname: useData.firstname,
    lastname: useData.lastname,
    mobile: useData.mobile,
    username: useData.email,
    email: useData.email,
    role: useData.role,
    updatedAt: new Date(),
    status: useData.status,
    updatedBy: ObjectID(useData.updatedBy),
  };

  if ('password' in useData) {
    var salt = '1234567890'; // default salt
    var hash = crypto.pbkdf2Sync(useData.password, salt, 1000, 24, 'sha512');
    userStore['password'] = (Buffer.from(hash).toString('hex'))
  }
  if (useData.SelectedGroup != undefined) {
    for (var i = 0; i < useData.SelectedGroup.length; i++) {
      useData.SelectedGroup[i] = ObjectID(useData.SelectedGroup[i]);
    }
    userStore['SelectedGroup'] = useData.SelectedGroup
  }
  const vUpdateUser = usermodel.updateUser('users', userStore, req.params.id)
  vUpdateUser.then((data) => {
    res.status(200).send(data)
  })
})


/**
 * Sends a HTTP GET request to get user record in users collection.
 * </br>
 * @function getSingleUser
 * 
 * @function
 * @path {get} path /users/getUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param :id {string} Id is used to get specific user. it represent _id.
 * @param {Function}  usermodel.getSingleUser() This function is used call getSingleUser() from users 
 * routes to user model to get specific record in database
 * @return {Object} Its return success or failure message with data.
 */
router.get('/getUser/:id', (req, res) => {
  if (req.params.id) {
    var id = req.params.id;
    var vGetUser = usermodel.getSingleUser('users', id)
    vGetUser.then((data) => {
      if (data.message) {
        res.status(404).send(data)
      }
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> getUser Error`, 'get:/users/getUser/:id');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'User not found ';
      res.send(error);
    })
  } else {
    util.writeLog('getUser Error', 'get:/users/getUser/:id');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'Userid not found ';
    res.send(error);
  }

})

/**
 * Sends a HTTP DELETE request to delete user record in users collection.
 * </br>
 * @function deleteUser
 * 
 * @function
 * @path {delete} path /users/deleteUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param  {string}   id/:TenantId/:tenantName /deleteUser/ 
 * @param {Function}  usermodel.deleteUser() This function is used call deleteUser() from users 
 * routes to user model to delete specific record in database
 * @return {Object} Its return success or failure message.
 */

router.delete('/deleteUser/:id/:TenantId/:tenantName', (req, res) => {
  if (req.params.id != undefined || req.params.id != 'undefined' || req.params.id != null) {
    let dataval = req.params;
    var vDeleteUser = usermodel.deleteUser('users', dataval)
    vDeleteUser.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> delete Error`, 'delete:/users/deleteUser');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'User not found ';
      res.send(error);
    })
  } else {
    util.writeLog('delete Error', 'delete:/users/deleteUser/:id');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'User id not found ';
    res.send(error);
  }
})

/**
 * Sends a HTTP GET request to get user record in users collection.
 * </br>
 * @function getAllUser
 * 
 * @function
 * @path {get} path /users/getAllUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  usermodel.retrieveAllUsers() This function is used call retrieveAllUsers() from users 
 * routes to user model to get all record in database
 * @return {Object} Its return success or failure message with all user data.
 */

router.get('/getAllUser', (req, res, next) => {
  const userLimit = req.body
  var vUserModel = usermodel.retrieveAllUsers('users', '')
  vUserModel.then(function (data) {
    if (data.length > 0) {
      let result = {
        success: true,
        data: data
      }
      res.status(200).send(result);
    } else {
      let result = {
        success: false,
        data: ''
      }
      res.status(200).send(result);
    }
  }).catch(err => {
    util.writeLog(`${err} -> get Error`, 'get:/users/getAllUser');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'Users not found ';
    res.send(error);
  })
});


/**
 * Sends a HTTP GET request to get user record based on pagination count in users collection.
 * </br>
 * @function getAllUser_Limit
 * 
 * @function
 * @path {get} path /users/getAllUser_Limit
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain data count based on pagination.
 * @param {Function}  usermodel.retrieveAllUsers_Limit() This function is used call retrieveAllUsers_Limit() from users 
 * routes to user model to get user data based on pagination.
 * @return {Object} Its return success or failure message with specific count of user data.
 */

router.post('/getAllUser_Limit', (req, res, next) => {
  const userLimit = req.body
  var vUserModel = usermodel.retrieveAllUsers_Limit('users', userLimit)
  vUserModel.then(function (data) {
    if (data.length > 0) {
      let result = {
        success: true,
        status: 200,
        data: data
      }
      res.status(200).send(result);
    } else {
      let result = {
        success: false,
        data: '',
        status: 403,
        message: "User not found."
      }
      res.status(200).send(result);
    }
  }).catch(err => {
    util.writeLog(`${err} -> getAllUser_Limit Error`, 'get:/users/getAllUser_Limit');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'Users not found ';
    res.send(error);
  })
});

/**
 * Sends a HTTP POST request check user have the acces for the specific senarios.
 * </br>
 * @function checkScenarioForUser
 * 
 * @function
 * @path {post} path /users/VerifyTokenDetails
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body.tokenValue {string} It represet the token value used to verify the signed user is expired or not.
 * @param secretKey {string} secretKey user to encrypt the token value.
 * @param {Function}  usermodel.CheckScenarioForUser() This function is used call CheckScenarioForUser() from users 
 * routes to user model to verify the user session.
 * @return {Object} Its return success or failure message.
 */

router.post('/VerifyTokenDetails', async (req, res) => {
  if (req.body.tokenValue) {
    jwt.verify(req.body.tokenValue, secretKey.secretKey, function (err, decoded) {
      if (err) {
        let result = {
          status: false
        }
        res.status(200).send(result);
      } else {
        const Scenariovalue = {
          userid: ObjectID(decoded.id),
          ScenarioId: ObjectID(req.body.ScenarioId)
        }
        if (req.body.role !== '1') {
          var ScenarioData = usermodel.CheckScenarioForUser('groupinfo', Scenariovalue)
          ScenarioData.then(function (data) {
            if (data.length > 0) {
              let result = {
                success: true,
                data: data,
                message: 'Success'
              }
              res.status(200).send(result);
            } else {
              let result = {
                success: false,
                data: '',
                message: "User doesn't habe the access to the scenario"
              }
              res.status(200).send(result);
            }

          }).catch(err => {
            util.writeLog(`${err} -> get VerifyTokenDetails Error`, 'get:/users/VerifyTokenDetails');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Users not found ';
            res.send(error);
          })
        } else {
          let result = {
            success: false,
            data: '',
            message: "User doesn't habe the access to the scenario"
          }
          res.status(200).send(result);
        }
      }
    })
  } else {
    util.writeLog('TokenValue not found', 'post:/users/VerifyTokenDetails');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'TokenValue not found';
    res.send(error);
  }
})



/**
 * Sends a HTTP POST request check user have the acces for the specific senarios.
 * </br>
 * @function bulkUserUploadJson
 * 
 * @function
 * @path {post} path /users/bulkUserUploadJson
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body.excelldata {Object} It represet the excell data.
 * @param {Function}  usermodel.excellUploadValidation() This function is used call excellUploadValidation() from users 
 * routes to user model to verify the user session.
 * @return {Object} Its return success or failure message.
 */


router.post('/bulkUserUploadJson', async (req, res) => {
  try {
    var excelldataResponse = await usermodel.excellUploadValidation('users', req.body, req)
    if (excelldataResponse.success) {

      let result = {
        success: true,
        status: 200,
        message: "User Uploaded successfully"
      }
      res.status(200).send(result);

    } else {
      if (excelldataResponse.message == 'User limit exits.') {
        let result = {
          success: false,
          status: 403,
          message: "User limit exceed."
        }
        res.status(200).send(result);

      } else {
        let result = {
          success: false,
          status: 403,
          message: "Import unsuccessful. Please check for invalid characters in excel"
        }
        res.status(200).send(result);
      }

    }

  } catch (e) {
    util.writeLog(`${e} -> User Bulk Upload`, 'post:/users/bulkUserUploadJson');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'Import unsuccessful. Please check for invalid characters in excel';
    res.send(error);
  }



})



/**
 * getcountOfuser method to get count of users
 * @path {post} path /users/getcountOfuser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  usermodel.getcountOfuser() This function is used call getcountOfuser() from users 
 * routes to user model to get the count.
 * @return {Object} Its return success or failure message with count. 
 */
router.get("/getcountOfuser", async (req, res) => {
  try {
    var vgetcountOfuser = await usermodel.getcountOfuser('users')
    if (vgetcountOfuser.success) {
      res.status(200).send(vgetcountOfuser);
    } else {
      let result = {
        success: false,
        status: 403,
        message: "data not found"
      }
      res.status(200).send(result);
    }
  } catch (e) {
    util.writeLog(`${e} -> User count`, 'post:/users/getcountOfuser');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'User count not calculate';
    res.send(error);
  }

})

router.post("/pushnotification", async (req, res) => {
  var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
  var key = '789456123';

  let pushstore = req.body
  let tenantId = null
  let tenantName = null
  if (pushstore.tenantDeatails) {
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = JSON.parse(decipher.update(pushstore.tenantDeatails, 'hex', 'utf8') + decipher.final('utf8'));
    tenantId = decrypted[0].tenantId
    tenantName = decrypted[0].tenantname
  }
  let pushvalue = {
    endpoint: pushstore.subvalue.endpoint,
    keys: pushstore.subvalue.keys,
    userId: ObjectID(pushstore.userdata._id),
    firstname: pushstore.userdata.firstname,
    lastname: pushstore.userdata.lastname,
    email: pushstore.userdata.email,
    role: pushstore.userdata.role,
    tenantId: tenantId,
    tenantName: tenantName
  }
  var vSubscribers = await usermodel.setsubscriberinDb('subscribers', pushvalue)
  if (vSubscribers.success) {
    res.status(200).send(vSubscribers);
  } else {
    let result = {
      success: false,
      status: 403,
      message: "Notification subscription failed"
    }
    res.status(200).send(result);
  }

})

router.post('/popupmsg', (req, res) => {
  let db = global.db;
  const payload = {
    title: 'sample',
    message: "req.body.message",
    url: req.body.url,
    ttl: req.body.ttl,
    icon: req.body.icon,
    image: req.body.image,
    badge: req.body.badge,
    tag: req.body.tag
  };

  db.collection('subscribers').find().toArray((err, subscriptions) => {
    // Subscription.find({}, (err, subscriptions) => {
    if (err) {
      res.status(500).json({
        error: 'Technical error occurred'
      });
    } else {
      const publicKey = 'BLiitVkHUy61i-6UcR27kz789NSojb9OljZX6flUAzhvmcMEtq8XtyBhOt7SsFut7XpJ0EtATR7g2hGQZgiHF7g'
      const privateKey = 'zUlG4ma94p0SC-4QAqMnFVBAa2RCE8BmkRyFBZPll9s'
      let parallelSubscriptionCalls = subscriptions.map((subscription) => {
        return new Promise((resolve, reject) => {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.keys.p256dh,
              auth: subscription.keys.auth
            }
          };

          const pushPayload = JSON.stringify(payload);
          const pushOptions = {
            vapidDetails: {
              subject: 'http://example.com',
              privateKey: privateKey,
              publicKey: publicKey
            },
            TTL: 36000,
            headers: {}
          };
          webPush.sendNotification(
            pushSubscription,
            pushPayload,
            pushOptions
          ).then((value) => {
            resolve({
              status: true,
              endpoint: subscription.endpoint,
              data: value
            });
          }).catch((err) => {
            reject({
              status: false,
              endpoint: subscription.endpoint,
              data: err
            });
          });
        });
      });
      q.allSettled(parallelSubscriptionCalls).then((pushResults) => {
      });
      res.json({
        data: 'Push triggered'
      });
    }
  });
});


module.exports = router;