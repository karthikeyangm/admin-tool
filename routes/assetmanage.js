/**
 * AssestModel module to perform asset operations..
 * @module Assetmanage
 * @see {@link assestModel}
 */

var express = require('express');
var router = express.Router();
const assestModel = require("../models/assetModel")
var util = require("../utils/util");
var ObjectID = require('mongodb').ObjectID;

/**
 * Sends a HTTP GET request to get all asset category.
 * </br>
 * @function GetAllAssetCategory
 * 
 * @path {get} path /asset/GetAllAssetCategory
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  assestModel.getAllassetCategory() This function is used to pass data from assestmanage 
 * routes to asset model to get all record in database
 * @return {Object} Its retrun success or failure message with all data.
 */

router.get('/GetAllAssetCategory', (req, res) => {
    try {
        const vGetAllCategory = assestModel.getAllassetCategory('categorylist', '')
        vGetAllCategory.then((data) => {
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
            util.writeLog(`${err} -> get asset cat Error`, 'get:/asset/GetAllAssetCategory');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Asset Category not found';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> get asset cat Error`, 'get:/asset/GetAllAssetCategory');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }

})

/**
 * Sends a HTTP GET request to get all asset.
 * </br>
 * @function getAllassetCategory
 * 
 * @path {get} path /asset/getAllassetCategory
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  assestModel.getAllassetCategory() This function is used to pass data from assestmanage 
 * routes to asset model to get all record in database
 * @return {Object} Its retrun success or failure message with all data.
 */
router.get('/GetAllAsset', (req, res) => {
    try {
        const vGetAllCategory = assestModel.getAllassetCategory('assestdetails', '')
        vGetAllCategory.then((data) => {
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
            util.writeLog(`${err} -> get asset Error`, 'get:/asset/GetAllAsset');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Asset not found';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> get asset Error`, 'get:/asset/GetAllAsset');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})




/**
 * Sends a HTTP GET request to get all asset.
 * </br>
 * @function getAllassetViewMode
 * 
 * @path {get} path /asset/getAllassetViewMode
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  assestModel.getAllassetViewMode() This function is used to pass data from assestmanage 
 * routes to asset model to get all record in database
 * @return {Object} Its retrun success or failure message with all data.
 */
router.get('/getAllassetViewMode', (req, res) => {
    try {
        const vGetAllviewMode = assestModel.getAllassetViewMode('viewMode', '')
        vGetAllviewMode.then((data) => {
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
            util.writeLog(`${err} -> get asset vGetAllviewMode Error`, 'get:/asset/getAllassetViewMode');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Viewmode not found';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> get asset vGetAllviewMode Error`, 'get:/asset/getAllassetViewMode');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})



/**
 * Sends a HTTP GET request to get all asset.
 * </br>
 * @function getAllassetInventoryItemKeyName
 * 
 * @path {get} path /asset/getAllassetInventoryItemKeyName
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  assestModel.getAllassetInventoryItemKeyName() This function is used to pass data from assestmanage 
 * routes to asset model to get all record in database
 * @return {Object} Its retrun success or failure message with all data.
 */
router.post('/getAllassetInventoryItemKeyName', (req, res) => {
    try {
        const vGetAllInventoryItemKeyName = assestModel.getAllassetInventoryItemKeyName('inventoryItemKeyName', req.body)
        vGetAllInventoryItemKeyName.then((data) => {
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
            util.writeLog(`${err} -> get asset vGetAllInventoryItemKeyName Error`, 'get:/asset/getAllassetInventoryItemKeyName');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'InventoryItem not found';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> get asset vGetAllInventoryItemKeyName Error`, 'get:/asset/getAllassetInventoryItemKeyName');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})



/**
 * Sends a HTTP GET request to get all asset.
 * </br>
 * @function getAllassetModelDetails
 * 
 * @path {get} path /asset/getAllassetModelDetails
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param {Function}  assestModel.getAllassetModelDetails() This function is used to pass data from assestmanage 
 * routes to asset model to get all record in database
 * @return {Object} Its retrun success or failure message with all data.
 */
router.post('/getAllassetModelDetails', (req, res) => {
    try {
        const vGetAllModelDetails = assestModel.getAllassetModelDetails('modelDetails', req.body)
        vGetAllModelDetails.then((data) => {
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
            util.writeLog(`${err} -> get asset vGetAllModelDetails Error`, 'get:/asset/getAllassetModelDetails');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'ModelDetails not found';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> get asset vGetAllModelDetails Error`, 'get:/asset/getAllassetModelDetails');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})



/**
 * Sends a HTTP POST request to create asset record.
 * </br> 
 * @function createAssetData
 * @function
 * @path {POST} path /asset/assestModel
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user details to store in  userStore.
 * @param {Function}  assestModel.CreateAsset() This function is used to pass  data from assestmanage routes to asset model 
 * to create record in database
 * @return {Object} Its retrun success or failure message based on data insertion.
 */

router.post('/createAssetData', (req, res) => {
    try {
        var data = req.body;
        const CreateAsset = assestModel.CreateAsset('assestdetails', data)
        CreateAsset.then((datavalue) => {
            res.status(200).send(datavalue)
        }).catch(err => {
            var error = new Error();
            util.writeLog(`${err} -> create Asset Error`, 'post:/asset/createAssetData');
            error.success = false;
            error.status = 404;
            error.message = 'Asset not created';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> create Asset Error`, 'post:/asset/createAssetData');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})


/**
 * Sends a HTTP GET request to get asset for edit.
 * </br>
 * @function getAssetForEdit
 * 
 * @function
 * @path {get} path /asset/getAssetForEdit
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param :id {string} Id is used to get specific asset. it represent _id.
 * @param {Function}  assestModel.getSingleAsset() This function is used to pass data from assestmanage 
 * routes to asset model to get specific record in database
 * @return {Object} Its retrun success or failure message with data.
 */
router.get('/getAssetForEdit/:id', (req, res) => {
    try {
        if (req.params.id) {
            var id = req.params.id;
            var vGetUser = assestModel.getSingleAsset('assestdetails', id)
            vGetUser.then((data) => {
                if (data.message) {
                    res.status(404).send(data)
                }
                res.status(200).send(data)
            }).catch(err => {
                util.writeLog(`${err} -> getAssetForEdit Error`, 'get:/Asset/getAssetForEdit');
                let error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'Asset not found ';
                res.send(error);
            })
        } else {
            util.writeLog(`getAssetForEdit Error`, 'get:/Asset/getAssetForEdit/:id');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Asset not found ';
            res.send(error);
        }
    } catch (err) {
        util.writeLog(`${err} -> getAssetForEdit Error`, 'get:/Asset/getAssetForEdit/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }

})



/**
 * Sends a HTTP PUT request to update user record based on tenant Login.
 * </br>
 * @function updateasset
 * 
 * @function
 * @path {PUT} path /asset/updateUser
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain asset details to store in  assetStore.
 * @param :id {string} Id is used to update specific asset. it represent _id.
 * @param userStore  {Object} All parsed data is stored in assetrStore object
 * @param {Function}  assestModel.updateasset() This function is used to pass userStore data from asset 
 * routes to asset model to update record in database
 * @return {Object} Its return success or failure message based on data updation.
 */

router.put('/updateasset/:id', (req, res) => {
    try {
        let valueObj = req.body
        delete valueObj._id
        const vUpdateAsset = assestModel.updateasset('assestdetails', valueObj, req.params.id)
        vUpdateAsset.then((data) => {
            res.status(200).send(data)
        }).catch(err => {
            util.writeLog(`${err} -> updateasset Error`, 'put:/Asset/updateasset/:id');
            var error = new Error();
            error.success = false;
            error.status = 404;
            error.message = 'Asset not Update ';
            res.send(error);
        })
    } catch (err) {
        util.writeLog(`${err} -> updateasset Error`, 'put:/Asset/updateasset/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

module.exports = router