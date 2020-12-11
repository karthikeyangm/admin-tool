
/**
 * dashboard module to perform dashboard based operations..
 * @module dashboard 
 * @see {@link dashboardModel}
 */

var express = require('express');
var router = express.Router();
var usermodel = require("../models/usermodel")
var ObjectID = require('mongodb').ObjectID;
var util = require("../utils/util");
var dashboardModel = require('../models/dashboardModel')

/**
 * getScenarioCounts method to get count of users
 * @path {post} path /dashboard/getScenarioCounts
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  dashboard.getScenarioCounts() This function is used call getScenarioCounts() from dashboard 
 * routes to dashboard model to get the count.
 * @return {Object} Its return success or failure message with count. 
 */
router.get("/getScenarioGroupingCounts", async (req, res) => {
    try {
        var vgetcount = await dashboardModel.getcount('scenarios')
        if (vgetcount.success) {
            res.status(200).send(vgetcount);
        } else {
            let result = {
                success: false,
                status: 403,
                message: "data not found"
            }
            res.status(200).send(result);
        }
    } catch (e) {
        util.writeLog(`${e} -> dashboard count`, 'post:/dashboard/getScenarioGroupingCounts');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'Dashboard count not calculate';
        res.send(error);
    }
})

module.exports = router;