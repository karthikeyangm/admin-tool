/**
 * Report module to perform Report based operations.
 * @module Report 
 * @see {@link reportmodel}
 */

const express = require('express');
const router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var reportmodel = require('../models/reportModel')
var util = require("../utils/util");

/**
 * Sends a HTTP post request to add report data in collection
 * </br> 
 * @function getReportData
 * @path {post} path /report/getReportData
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain report data.
 * @param {Function}  reportmodel.getReportDatafrombundel() This function is used to pass collection name  and data
 * in reportmodel to store datain collection. 
 * @return {Object} Its return success or failure message based on data insertion.
 */


router.post('/getReportData', (req, res) => {
    let data = {
        scenarioName: "AFF A320 Systems",
        userName: "testuser@netapp.com",
        pieSliceValues: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
        isPieTransistion: true,
        timeAllocatedValue: 50,
        timeTakenValue: 20,
        isBarTransition: true,
        totalAttemptsCount: 10,
        beginnerRange: { min: 16, max: 0 },
        intermediateRange: { min: 8, max: 15 },
        expertRange: { min: 0, max: 7 },
        isSkillMeterTransition: true,
        attmeptsData:
        {
            configCount: 20,
            timeTakenList: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
            attemptsCountList: [2, 0, 5, 2, 1, 2, 0, 5, 2, 1, 2, 0, 5, 2, 1, 2, 0, 5, 2, 1],
            extraSteps: [10, 5, 0, 0, 0, 0, 0]
        },
        isAttemptsPanelTransition: true
    };
    const getReportDatafrombundel = reportmodel.getReportDatafrombundel('reports', data)
    getReportDatafrombundel.then((data) => {
        res.status(200).send(data)
    }).catch(err => {
        util.writeLog(`${err} -> get scenario Error`, 'post:/report/getReportData');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'scenario not found';
        res.send(error);
    })
})


/**
 * Sends a HTTP post request to get user based scenario list
 * </br> 
 * @function getUserBasedScenarioList
 * @path {post} path /report/getUserBasedScenarioList
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user based scenario list.
 * @param {Function}  reportmodel.getUserbasedScenarioList() This function is used to pass collection name  and data
 * in reportmodel to retrive scenario list. 
 * @return {Object} Its return success or failure message and scenario list.
 */

router.post('/getUserBasedScenarioList', (req, res) => {
    try {
        const SelectedGroup = req.body
        const ususerStoreeData = {}
        for (var i = 0; i < SelectedGroup.length; i++) {
            SelectedGroup[i] = ObjectID(SelectedGroup[i]);
        }
        ususerStoreeData['SelectedGroup'] = SelectedGroup
        const getReportDatafrombundel = reportmodel.getUserbasedScenarioList('scenarios', ususerStoreeData)
        getReportDatafrombundel.then((data) => {
            res.status(200).send(data)
        }).catch(err => {
            util.writeLog(`${err} -> get getUserBasedScenarioList Error`, 'post:/report/getUserBasedScenarioList');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'scenario not found';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> get getUserBasedScenarioList Error`, 'post:/report/getUserBasedScenarioList');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }

})

/**
 * Sends a HTTP post request to get scenario bassed report
 * </br> 
 * @function getSenarioBasedReport
 * @path {post} path /report/getSenarioBasedReport
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user based scenario details.
 * @param {Function}  reportmodel.getScenarioBasedReport() This function is used to pass collection name  and data
 * in reportmodel to retrive report based on user scenario report data. 
 * @return {Object} Its return success or failure message and scenario report.
 */

router.post('/getSenarioBasedReport', (req, res) => {
    try {
        const SecnarioId = req.body
        const getReportDatafrombundel = reportmodel.getScenarioBasedReport('reports', SecnarioId)
        getReportDatafrombundel.then((data) => {
            res.status(200).send(data)
        }).catch(err => {
            util.writeLog(`${err} -> getSenarioBasedReport Error`, 'post:/report/getSenarioBasedReport');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'scenario not found';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> getSenarioBasedReport Error`, 'post:/report/getSenarioBasedReport');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})


router.get('/streamingAssetEndUser', (req, res) => {
    try {
        if (req.query.id) {
            const getStremingAssetDAta = reportmodel.getStremingAssetDAta('scenarios', (req.query.id))
            getStremingAssetDAta.then((data) => {
                res.status(200).send(data)
            }).catch(err => {
                util.writeLog(`${err} -> get streamingAssetEndUser Error`, 'get:/report/streamingAssetEndUser');
                var error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'Streaming data not found.';
                res.send(error);
            })
        } else {
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Streaming data  id not found.';
            res.send(error);
        }
    } catch (err) {
        util.writeLog(`${err} -> get streamingAssetEndUser Error`, 'get:/report/streamingAssetEndUser');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})


router.get('/streamingAssetEndUser/:id', (req, res) => {
    try {
        if (req.params.id) {
            const getStremingAssetDAta = reportmodel.getStremingAssetDAta('scenarios', (req.params.id))
            getStremingAssetDAta.then((data) => {
                res.status(200).send(data)
            }).catch(err => {
                util.writeLog(`${err} -> get streamingAssetEndUser Error`, 'get:/report/streamingAssetEndUser');
                var error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'Streaming Scenario data not found.';
                res.send(error);
            })
        } else {
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Streaming Scenario data id not found.';
            res.send(error);
        }
    } catch (err) {
        util.writeLog(`${err} -> get streamingAssetEndUser Error`, 'get:/report/streamingAssetEndUser');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

module.exports = router