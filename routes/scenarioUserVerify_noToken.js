/**
 * ScenarioUser module to perform ScenarioUser based operations..
 * @module ScenarioUser 
 * @see {@link UserModel}
 */
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var usermodel = require("../models/usermodel")
var secretKey = require("../config/config")

/**
 * Sends a HTTP POST request to validate user for the specific scenario
 * </br> 
 * @function VerifyScenarioUser
 * @path {POST} path /scenarioUserVerify/VerifyScenarioUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user details to verify the scenario based user.
 * @param {Function}  usermodel.getSingleUser() This function is used to pass
 *  userStore data from users routes to user model 
 * to validate the user.
 * @return {Object} Its return success or failure message and user data.
 */

router.post('/VerifyScenarioUser', function (req, res, next) {
    try {
        var id = req.body.id;
        var vGetUser = usermodel.getSingleUser('users', id)
        vGetUser.then((data) => {
            if (data.message) {
                return res.status(404).send(data)
            }
            return res.status(200).send(data)
        })
        //   const userData = {
        //     username: req.body.username,
        //     password: req.body.password
        //   }
        //   const token = jwt.sign({ userData }, secretKey.secretKey)
        //   const tokenObj = {
        //     token: token
        //   }
        //   res.status(200).send(tokenObj)
    } catch (err) {
        util.writeLog(`${err} -> VerifyScenarioUser`, 'post:/scenario/VerifyScenarioUser');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
});

module.exports = router;
