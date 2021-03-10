/**
 * Group module to perform Group based operations..
 * @module Group
 * @see {@link groupingModel}
 */

var express = require('express');
var router = express.Router();
const groupingModel = require("../models/groupingModel")
var util = require("../utils/util");
var ObjectID = require('mongodb').ObjectID;


/**
 * Sends a HTTP POST request to create user based group record.
 * </br> 
 * @function CreateUserScenarioGroup
 * @function
 * @path {POST} path /grouping/CreateUserScenarioGroup
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} It contains Group details based on user details and users scenario list
 * @param {Function}  groupingModel.CreateUserScenarioGroup() This function is used to pass data from grouping routes to groupimg model 
 * to create record in database
 * @return {Object} Its return success or failure message and group info data.
 */

router.post('/CreateUserScenarioGroup', (req, res) => {
  try {
    var data = req.body;
    data[0]['createdAt'] = new Date()
    data[0]['updatedAt'] = new Date()
    data[0]['status'] = 'Active'
    const vCreateUserScenarioGroup = groupingModel.CreateUserScenarioGroup('groupinfo', data[0])
    vCreateUserScenarioGroup.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> createUser Error`, 'post:/groupin/CreateUserScenarioGroup');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'Group not created';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> createUser Error`, 'post:/groupin/CreateUserScenarioGroup');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})


/**
 * Sends a HTTP Get request to get all groups.
 * </br> 
 * @function getAllGroup
 * @function
 * @path {Get} path /grouping/getAllGroup
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  groupingModel.getAllgroupinfo() This function is used to pass data from grouping routes to groupimg model 
 * to get all record in database
 * @return {Object} Its return success or failure message and group info data.
 */

router.get('/getAllGroup', (req, res) => {
  try {
    const vGetAllScenario = groupingModel.getAllgroupinfo('groupinfo', '')
    vGetAllScenario.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> get group Error`, 'get:/groupinfo/getAllgroup');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'group not found';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> get group Error`, 'get:/groupinfo/getAllgroup');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})

/**
 * Sends a HTTP post request to get group records based on pagination.
 * </br> 
 * @function getAllGroup_Limit
 * @function
 * @path {post} path /grouping/getAllGroup_Limit
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user pagination count.
 * @param {Function}  groupingModel.getAllgroupinfo_limit() This function is used to pass data from grouping routes to groupimg model 
 * to get record in database
 * @return {Object} Its return success or failure message and group info data.
 */
router.post('/getAllGroup_Limit', (req, res) => {
  try {
    const groupLimit = req.body
    const vGetAllScenario = groupingModel.getAllgroupinfo_limit('groupinfo', groupLimit)
    vGetAllScenario.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> get group Error`, 'get:/groupinfo/getAllGroup_Limit');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'group not found';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> get group Error`, 'get:/groupinfo/getAllGroup_Limit');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})


/**
 * Sends a HTTP post request to get group records based on user and pagination count.
 * </br> 
 * @function getAllGroup_Limit
 * @function
 * @path {post} path /grouping/getUserGroup_Limit
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user pagination count based on user.
 * @param {Function}  groupingModel.getUsergroupinfo_limit() This function is used to pass data from grouping routes to groupimg model 
 * to get record in database
 * @return {Object} Its return success or failure message and group info data.
 */
router.post('/getUserGroup_Limit', (req, res) => {
  try {
    const groupLimit = req.body
    const vGetAllScenario = groupingModel.getUsergroupinfo_limit('groupinfo', groupLimit)
    vGetAllScenario.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> get group Error`, 'get:/groupinfo/getUserGroup_Limit');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'group not found';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> get group Error`, 'get:/groupinfo/getUserGroup_Limit');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})


/**
 * Sends a HTTP get request to get group details for Edit.
 * </br> 
 * @function getGroupForEdit
 * @function
 * @path {get} path /grouping/getGroupForEdit
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.params.id {String} The JSON payload. Its contain group id for edit.
 * @param {Function}  groupingModel.getSinglegroup() This function is used to pass data from grouping routes to groupimg model 
 * to get record in database for Edit.
 * @return {Object} Its return success or failure message and group info data.
 */
router.get('/getGroupForEdit/:id', (req, res) => {
  try {
    if (req.params.id) {
      var id = req.params.id;
      var vGetUser = groupingModel.getSinglegroup('groupinfo', id)
      vGetUser.then((data) => {
        if (data.message) {
          res.status(404).send(data)
        }
        res.status(200).send(data)
      }).catch(err => {

        util.writeLog(`${err} -> getGroupForEdit Error`, 'get:/groupinfo/getGroupForEdit/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'Group not found ';
        res.send(error);
      })
    } else {
      util.writeLog('getGroupForEdit Error', 'get:/groupinfo/getGroupForEdit/:id');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'Groupid not found ';
      res.send(error);
    }
  } catch (err) {
    util.writeLog('getGroupForEdit Error', 'get:/groupinfo/getGroupForEdit/:id');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})


/**
 * Sends a HTTP get request to get group details for update.
 * </br> 
 * @function getGroupForEdit
 * @function
 * @path {get} path /grouping/getGroupForEdit
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.params.id {String} The JSON payload. Its contain group id for update.
 * @param req.body {Object} The JSON payload. Its contain group details for update.
 * @param {Function}  groupingModel.updategroupInfo() This function is used to pass data from grouping routes to groupimg model 
 * to get record in database for update.
 * @return {Object} Its return success or failure message and group info data.
 */
router.put('/updateGroup/:id', (req, res) => {
  try {
    let useData = req.body
    const vUpdateUser = groupingModel.updategroupInfo('groupinfo', useData[0], req.params.id)
    vUpdateUser.then((data) => {
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> put group Error`, 'put:/groupinfo/updateGroup/:id');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'group not found';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> put group Error`, 'put:/groupinfo/updateGroup/:id');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})
/**
 * Sends a HTTP DELETE request to delete group record.
 * </br>
 * @function deleteUser
 * 
 * @function
 * @path {delete} path /grouping/deleteGroup
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param  {string}   id for refer the delete record.
 * @param {Function}  groupingModel.deleteGroup() This function is used to pass data from grouping routes to groupimg model 
 * to delete record in database.
 * @return {Object} Its return success or failure message.
 */
router.delete('/deleteGroup/:id', (req, res) => {
  try {
    if (req.params.id != undefined || req.params.id != 'undefined' || req.params.id != null) {
      let id = req.params.id;

      var vDeleteUser = groupingModel.deleteGroup('groupinfo', id)
      vDeleteUser.then((data) => {
        res.status(200).send(data)
      }).catch(err => {
        util.writeLog(`${err} -> delete Error`, 'delete:/groupinfo/deleteGroup/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'Group not found ';
        res.send(error);
      })
    } else {
      util.writeLog('delete Error', 'delete:/groupinfo/deleteGroup/:id');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'Group id not found ';
      res.send(error);
    }
  } catch (err) {
    util.writeLog(`${err} -> delete Error`, 'delete:/groupinfo/deleteGroup/:id');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})





/**
 * Sends a HTTP Get request to get all groups.
 * </br> 
 * @function getDeletedScenarioCount
 * @function
 * @path {Get} path /grouping/getDeletedScenarioCount
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  groupingModel.getDeletedScenarioCount() This function is used to get deleted scenario count
 * @return {Object} Its return success or failure message and get deleted scenario count
 */

router.get('/getDeletedScenarioCount', (req, res) => {
  try {
    const vGetAllScenario = groupingModel.getDeletedScenarioCount('scenarios')
    vGetAllScenario.then((data) => {
      console.log(data)
      res.status(200).send(data)
    }).catch(err => {
      util.writeLog(`${err} -> get DeletedScenarioCount Error`, 'get:/groupinfo/getDeletedScenarioCount');
      var error = new Error();
      error.success = false;
      error.status = 404;
      error.message = 'Scenario not found';
      res.send(error);
    })
  } catch (err) {
    util.writeLog(`${err} -> get DeletedScenarioCount Error`, 'get:/groupinfo/getDeletedScenarioCount');
    var error = new Error();
    error.success = false;
    error.status = 404;
    error.message = 'An internal error occurred. Please try again later';
    res.send(error);
  }
})


module.exports = router