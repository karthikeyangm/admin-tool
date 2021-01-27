/**
 * Scenario module to perform Scenario based operations.
 * @module Scenario 
 * @see {@link scenariomodel}
 */

var express = require('express');
var router = express.Router();
const scenariomodel = require("../models/scenarioModel")
var util = require("../utils/util");
const { async } = require('q');
var ObjectID = require('mongodb').ObjectID;

var crypto = require('crypto');
const q = require('q');
const webPush = require('web-push');
/**
 * Sends a HTTP GET request to get all scenario
 * </br> 
 * @function getAllScenario
 * @path {GET} path /scenario/getAllScenario
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  scenariomodel.getAllScenario() This function is used to pass collection name 
 * in scenariomodel to get scenario details. 
 * @return {Object} Its return success or failure message and scenario data.
 */

router.get('/getAllScenario', (req, res) => {
  try {
    const vGetAllScenario = scenariomodel.getAllScenario('scenarios', '')
    vGetAllScenario.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> get scenario Error`, 'get:/scenario/getAllScenario');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'scenario not found';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> get scenario Error`, 'get:/scenario/getAllScenario');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})


/**
 * Sends a HTTP POST request to get all scenario based on pagination count.
 * </br> 
 * @function getAllScenario_Limit
 * @path {POST} path /scenario/getAllScenario_Limit
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain senario details like scenario limit.
 * @param {Function}  scenariomodel.getAllScenario_limit() This function is used to pass collection name  and senario details
 * in scenariomodel to get scenario details. 
 * @return {Object} Its return success or failure message and scenario data.
 */

router.post('/getAllScenario_Limit', (req, res) => {
  try {
    const ScenarioLimit = req.body
    const vGetAllScenario = scenariomodel.getAllScenario_limit('scenarios', ScenarioLimit)
    vGetAllScenario.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> getAllScenario_Limit Error`, 'get:/scenario/getAllScenario_Limit');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'scenario not found';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> getAllScenario_Limit Error`, 'get:/scenario/getAllScenario_Limit');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})

/**
 * Sends a HTTP GET request to get specific scenario based on user.
 * </br> 
 * @function getUserScenario
 * @path {GET} path /scenario/getAllScenario_Limit
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.params.id {String} The JSON payload. 
 * @param {Function}  scenariomodel.getUserScenario() This function is used to pass collection name  and senario id details
 * in scenariomodel to get scenario details. 
 * @return {Object} Its return success or failure message and scenario data.
 */

router.get('/getUserScenario/:id', (req, res) => {
  try {
    const vGetAllScenario = scenariomodel.getUserScenario('scenarios', req.params.id)
    vGetAllScenario.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> get scenario Error`, 'get:/scenario/getUserScenario');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'Scenario not found';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> get scenario Error`, 'get:/scenario/getUserScenario');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})

/**
 * Sends a HTTP GET request to get specific scenario based on pagination count and user details.
 * </br> 
 * @function getUserScenario_Limit
 * @path {GET} path /scenario/getAllScenario_Limit
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain senario limit.
 * @param {Function}  scenariomodel.getUserScenario_Limit() This function is used to pass collection name  and senario id details
 * in scenariomodel to get scenario details. 
 * @return {Object} Its return success or failure message and scenario data.
 */


router.post('/getUserScenario_Limit', (req, res) => {
  try {
    const ScenarioLimit = req.body
    const vGetAllScenario = scenariomodel.getUserScenario_limit('scenarios', ScenarioLimit)
    vGetAllScenario.then((data) => {
      console.log(data)
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> get scenario getUserScenario_Limit Error`, 'get:/scenario/getUserScenario_Limit');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'Scenario not found';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> get scenario getUserScenario_Limit Error`, 'get:/scenario/getUserScenario_Limit');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})

/**
 * Sends a HTTP Delete request to get specific scenario based on pagination count and user details.
 * </br> 
 * @function deletescenario
 * @path { Delete } path /scenario/deletescenario
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.params.id {String} The JSON payload. Its contain senario id to delete the specific scenario.
 * @param {Function}  scenariomodel.deleteScenario() This function is used to pass collection name  and senario id details
 * in scenariomodel to delete specific scenario details. 
 * @return {Object} Its return success or failure message.
 */

// Delete User
router.delete('/deletescenario/:id', (req, res) => {
  try {
    if (req.params.id != undefined || req.params.id != 'undefined' || req.params.id != null) {
      let id = req.params.id;

      var vDeleteUser = scenariomodel.deleteScenario('scenarios', id)
      vDeleteUser.then((data) => {
        res.status(200).send(data)
      }).catch(err => {
        util.writeLog(`${err} -> delete Error`, 'delete:/scenario/deletescenario/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'Scenario not found ';
        res.send(error);
      })
    } else {
      util.writeLog('delete Error', 'delete:/scenario/deletescenario/:id');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'Scenario id not found ';
      res.send(error);
    }
  } catch (err) {
    util.writeLog(`${err} -> delete Error`, 'delete:/scenario/deletescenario/:id');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})

/**
 * Sends a HTTP post request to create scenario based on user details.
 * </br> 
 * @function createScenario
 * @path { post } path /scenario/createScenario
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {String} The JSON payload. Its contain senario details the specific scenario.
 * @param {Function}  scenariomodel.CreateScenario() This function is used to pass collection name  and senario id details
 * in scenariomodel to create specific scenario details. 
 * @return {Object} Its return success or failure message.
 */

router.post('/createScenario', (req, res) => {
  try {
    var data = req.body;

    if (data.SelectedGroup != undefined) {
      for (var i = 0; i < data.SelectedGroup.length; i++) {
        data.SelectedGroup[i] = ObjectID(data.SelectedGroup[i]);
      }
    }

    var userStore = {};

    userStore = {
      // Title: 'data.Title',
      // Information: 'data.Information',

      Title: data.Title,
      Information: data.Information,
      createdAt: new Date(),
      createdBy: ObjectID(data.createdBy),
      SelectedGroup: data.SelectedGroup || []
      // SelectedGroup: [ObjectID('5e5cb4df88e672ff4c61a9fd')]
    };
    const CreateScenario = scenariomodel.CreateScenario('scenarios', userStore)
    CreateScenario.then((datasuccessorfailure) => {
      res.status(200).send(datasuccessorfailure)
    }).catch(err => {
      var error = new Error();
      util.writeLog(`${err} -> create Scenario Error`, 'post:/scenario/createScenario');
      error.success = false;
      error.status = 404;
      error.message = 'Scenario not created';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> create Scenario Error`, 'post:/scenario/createScenario');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})


/**
 * Sends a HTTP post request to update specific scenario based user details.
 * </br> 
 * @function updatescenario
 * @path { post } path /scenario/updatescenario
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.param.id {String} The JSON payload. Its contain specific scenario id t update.
 * @param {Function}  scenariomodel.updatescenarios() This function is used to pass collection name  and senario id details
 * in scenariomodel to update specific scenario details. 
 * @return {Object} Its return success or failure message.
 */


// User Update
router.put('/updatescenario/:id', (req, res) => {
  try {
    let useData = req.body
    let userStore = {
      Title: useData.Title,
      Information: useData.Information,
      updatedAt: new Date(),
      updatedBy: ObjectID(useData.updatedBy),
      // usrid:ObjectID(useData._id)
    };

    if (useData.SelectedGroup != undefined) {
      for (var i = 0; i < useData.SelectedGroup.length; i++) {
        useData.SelectedGroup[i] = ObjectID(useData.SelectedGroup[i]);
      }
      userStore['SelectedGroup'] = useData.SelectedGroup
    }
    const vUpdatescenarios = scenariomodel.updatescenarios('scenarios', userStore, req.params.id)
    vUpdatescenarios.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      var error = new Error();
      util.writeLog(`${err} -> Update Scenario Error`, 'put:/scenario/UpdateScenario');
      error.success = false;
      error.status = 404;
      error.message = 'Scenario not Update';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> Update Scenario Error`, 'put:/scenario/UpdateScenario');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})


module.exports = router