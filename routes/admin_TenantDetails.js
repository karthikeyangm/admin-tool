/**
 * Super admin module to perform SuperAdmin based operations.
 * @module SuperAdmin 
 */
var express = require('express');
var router = express.Router();

/**
 * Its contains the details TenantDetails collection schema
 * @type {Object}
 */
const TenantModel = require("../models/TenantModel")
var util = require("../utils/util");
var ObjectID = require('mongodb').ObjectID;
var crypto = require('crypto');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = '789456123';
var salt = '1234567890'; // default salt

/**
 * Its contains the details AdminDetails collection schema
 * @type {Object}
 */
var admintData = require('../models/adminModel')
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');


/**
 * Sends a HTTP POST request to create tenant record in super admin database.
 * </br> 
 * @function CreateTenant
 * @path {POST} path /tenant/addTenantDetails
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain tenant details to store in  TenantModel.
 * @return {Object} Its return success or failure message based on data insertion.
 */
router.post('/addTenantDetails', (req, res) => {
    const baseUrl = config.get('baseUrl');
    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base url');
    }
    // process.env.baseUrl
    // Create url code
    const urlCode = shortid.generate();
    var tenantId_data = Math.floor(Math.random() * 90000) + 10000
    var dataforEncrypt = [{
        tenantId: tenantId_data,
        tenantname: req.body.tenantName,
        tenantPrefix:req.body.tenantPrefix
    }]
    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(JSON.stringify(dataforEncrypt), 'utf8', 'hex') + cipher.final('hex');
    let TenantModelData = {
        tenantName: req.body.tenantName,
        Tenant_DB: req.body.tenantName,
        TenantEncrpt: encrypted,
        TenantId: tenantId_data,
        Tenant_Url: process.env.baseUrl+"#/pages/login?tendetail=" + encrypted,
        dbUrl: 'mongodb://localhost:27017/' + req.body.tenantName,
        name: req.body.tenantName,
        status: req.body.status,
        tenantDetails: req.body.tenantDetails,
        SubscriptionStartDate: req.body.SubscriptionStartDate,
        SubscriptionEndDate: req.body.SubscriptionEndDate,
        userlimit: req.body.userlimit,
        createdAt: new Date(),
        urlCode: urlCode,
        shortURL: process.env.baseUrl+'#/pages/loginshort/' + urlCode,
        userAdded: 0,
        userAdmin: 0,
        tenantPrefix:req.body.tenantPrefix
    }

    TenantModel.find({ tenantName: req.body.tenantName }, function (err, dataVal) {
        if (err) {
            util.writeLog(`${err} -> TenantModel.find Error`, 'post:/tenant/addTenantDetails');
            var error = new Error();
            error.success = false;
            error.status = 403;
            error.message = 'Tenant not created';
            res.send(error);
        }
        if (dataVal.length > 0) {
            let result = {
                success: false,
                status: 403,
                message: 'Tenant already created.'
            }
            res.send(result);
        } else {
            TenantModel.create(TenantModelData, (err, data) => {
                if (err) {
                    util.writeLog(`${err} -> TenantModel.create Error`, 'post:/tenant/addTenantDetails');
                    var error = new Error();
                    error.success = false;
                    error.status = 403;
                    error.message = 'Tenant not created';
                    res.send(error);
                }
                let result = {
                    success: true,
                    status: 200,
                    message: 'Tenant created successful!',
                    response: data
                }
                res.status(200).send(result)
            })
        }
    })
})


/**
 * Sends a HTTP get request to get all tenant records in super admin database.
 * </br> 
 * @function GetTenant
 * @path {get} path /tenant/getTenantDetails
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @return {Object} Its return success or failure message with tenant data.
 */
router.get('/getTenantDetails', (req, res) => {

    TenantModel.find({}, function (err, dataVal) {
        if (err) {
            util.writeLog(`${err} -> getTenantDetails Error`, 'get:/tenant/getTenantDetails');
            var error = new Error();
            error.success = false;
            error.status = 403;
            error.message = 'Tenant not found';
            res.send(error);
        }

        let result = {
            success: true,
            status: 200,
            message: 'Tenant retrieve',
            response: dataVal
        }

        res.status(200).send(result)

    })
})

/**
 * Sends a HTTP DELETE request to delete tenant record in super admin collection.
 * </br>
 * @function deleteTenantDetails
 * 
 * @function
 * @path {delete} path /tenant/deleteTenantDetails
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param  {string}  id  its represent the tenant id for delete record in super admin databse.
 * @return {Object} Its return success or failure message.
 */

router.delete('/deleteTenantDetails/:id', (req, res) => {

    if (req.params.id != undefined || req.params.id != 'undefined' || req.params.id != null) {
        let id = req.params.id;

        TenantModel.find({ _id: ObjectID(id) }, function (err, dataVal) {
            if (dataVal.length == 0) {
                let result = {
                    success: false,
                    status: 403,
                    message: "Tenat not found."
                }
                res.send(error);
            } else {
                TenantModel.deleteOne({ _id: ObjectID(id) }, (err, data) => {
                    if (err) {
                        let result = {
                            success: false,
                            status: 403,
                            message: "Tenant not delete."
                        }
                        res.send(error);
                    } else {
                        let result = {
                            success: true,
                            status: 200,
                            message: "Tenant Deleted successfully!."
                        }
                        res.status(200).send(result)
                    }
                })
            }
        })
    } else {
        util.writeLog('delete Error', 'delete:/tenat/deleteTenantDetails/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'tenant id not found ';
        res.send(error);
    }

})

/**
 * Sends a HTTP PUT request to update tenant record based on tenant id in super admin DB.
 * </br>
 * @function updateTenantDetails
 * 
 * @path {PUT} path /tenant/updateUser
 * @param req {Object} The req updateTenantDetails represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain tenant details for updating record.
 * @param :id {string} Id is used to update specific tenant. it represent _id.
 * @return {Object} Its return success or failure message based on data updation.
 */
router.put('/updateTenantDetails/:id', (req, res) => {
    let useData = req.body
    let userStore = {
        status: req.body.status,
        tenantDetails: req.body.tenantDetails,
        SubscriptionStartDate: req.body.SubscriptionStartDate,
        SubscriptionEndDate: req.body.SubscriptionEndDate,
        userlimit: req.body.userlimit,
        UpdatedAt: new Date()
    };
    let result = {
        success: true,
        status: 200,
        message: 'Tenant updated successful!',
        response: userStore
    }
    res.status(200).send(result)

    // TenantModel.findByIdAndUpdate({ _id: ObjectID(req.params.id) }, userStore, (err, data) => {
    //     if (err) {
    //         util.writeLog('updatetenant Error', 'post:/tenant/updateTenantDetails');
    //         var error = new Error();
    //         error.success = false;
    //         error.status = 403;
    //         error.message = 'Tenant not update';
    //         res.send(error);
    //     } else {
    //         let result = {
    //             success: true,
    //             status: 200,
    //             message: 'Tenant updated successful!',
    //             response: data
    //         }
    //         res.status(200).send(result)
    //     }
    // })

})

/**
 * Sends a HTTP get request to get the user for particular tenant based on global.db.
 * </br> 
 * @function GetTenant
 * @path {get} path /tenant/userVerification
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @return {Object} Its return success or failure message with tenant based user data.
 */
// Tenant Admin user verification
router.get('/userVerification', (req, res) => {
    let db = global.db;
    db.collection('users').find({ "role": "1" }).toArray((err, data) => {
        if (err) {
            util.writeLog(`${err} -> Tenant Based user get Error`, 'get:/tenant/userVerification');
            var error = new Error();
            error.success = false;
            error.status = 403;
            error.message = 'User not found';
            res.send(error);
        } else {
            let result = {
                success: true,
                status: 200,
                message: 'User data',
                response: data
            }
            res.status(200).send(result)
        }
    })
})
// Tenant Admin user creation    // regiter component
router.post('/addTennatAdminUser', (req, res) => {
    let db = global.db;

    try {
        let data = req.body
        var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 24, 'sha512');
        let userStore = {
            firstname: data.firstname,
            lastname: data.lastname,
            mobile: data.mobile,
            username: data.email,
            email: data.email,
            role: "1",
            password: (Buffer.from(hash).toString('hex')),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'Active'
        }

        db.collection('users').insertOne(userStore, (err, dataval) => {
            if (err) {
                util.writeLog(`${err} -> Tenant Based user add Error`, 'post:/tenant/addTennatAdminUser');
                var error = new Error();
                error.success = false;
                error.status = 403;
                error.message = 'User not addded';
                res.send(error);
            } else {
                let result = {
                    success: true,
                    status: 200,
                    message: 'User data added successfully.',
                    response: data
                }
                res.status(200).send(result)
            }
        })

    } catch (err) {
        util.writeLog(`${err} -> createUser Error`, 'post:/tenant/addTennatAdminUser');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'User not created';
        res.send(error);
    }

})

/**
 * Sends a HTTP post request to set hidden user in user collection based on tenant selection with 
 * verification of super admin login. </br>
 * To crete config collection with tenant details like Subscription dates, Userlimit and etc.</br>
 * To increment userAdmin value in Tenant Model in super admin collection for the purpose to indicate 
 * warrning msessage in super admin Tenant creation screen.
 * </br> 
 * @function setadminhiddenData
 * @path {post} path /tenant/userVerification
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @return {Object} Its return success or failure message with tenant data.
 */
router.post('/setadminhiddenData', (req, res) => {
    let db = global.db;
    try {
        let data_Body = req.body
        var hash = crypto.pbkdf2Sync(data_Body.password, salt, 1000, 24, 'sha512');
        let password = (new Buffer(hash).toString('hex'))

        let userStore = {
            firstname: 'Super',
            lastname: 'Admin',
            mobile: '',
            username: 'admin'+req.body.tenantPrefix,
            email: 'admin',
            role: "1",
            password: (Buffer.from(hash).toString('hex')),
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'Active',
            superAdmin: true,
            TenantId: req.body.TenantId,
            tenantName: req.body.tenantName,
            status: req.body.status,
        }
        let userconfig = {
            userlimit: req.body.userlimit,
            SubscriptionEndDate: new Date(req.body.SubscriptionEndDate),
            SubscriptionStartDate: new Date(req.body.SubscriptionStartDate),
            TenantId: req.body.TenantId,
            tenantName: req.body.tenantName,
            status: req.body.status,
            shortURL: req.body.shortURL,
            Tenant_Url: req.body.Tenant_Url,
            urlCode: req.body.urlCode,
        }

        admintData.find({ password: password }, function (err, data) {
            if (err) {
                util.writeLog(`${err} -> Login not success get Error`, 'post:/tenant/verifyAdmin');
                var error = new Error();
                error.success = false;
                error.status = 403;
                error.message = 'Login not success';
                res.send(error);
            }
            if (data.length > 0) {
                db.collection('users').insertOne(userStore, (err, dataval) => {
                    if (err) {
                        util.writeLog(`${err} -> Tenant Based user add Error`, 'post:/tenant/setadminhiddenData');
                        var error = new Error();
                        error.success = false;
                        error.status = 403;
                        error.message = 'User not addded';
                        res.send(error);
                    } else {
                        db.collection('config').insertOne(userconfig, (err, val) => {
                            if (err) {
                                util.writeLog(`${err} -> Tenant config Error`, 'post:/tenant/setadminhiddenData');
                                var error = new Error();
                                error.success = false;
                                error.status = 403;
                                error.message = 'User not addded';
                                res.send(error);
                            } else {
                                let groupinfo = {
                                    "groupname": "Default",
                                    "userIds": [],
                                    "scenarioIds": [],
                                    "groupdescription": "Default",
                                    "status": "Active",
                                    "createdAt": new Date()
                                }
                                db.collection('groupinfo').insertOne(groupinfo, (err, val) => {
                                    if (err) {
                                        util.writeLog(`${err} -> Tenant config Error`, 'post:/tenant/setadminhiddenData');
                                        var error = new Error();
                                        error.success = false;
                                        error.status = 403;
                                        error.message = 'User not addded';
                                        res.send(error);
                                    } else {
                                        TenantModel.updateOne({ "TenantId": data_Body.TenantId, tenantName: data_Body.tenantName },
                                            { $inc: { userAdmin: 1 } }, (err, value) => {
                                                if (err) {
                                                    util.writeLog(`${err} -> Tenant config Error`, 'post:/tenant/setadminhiddenData');
                                                    var error = new Error();
                                                    error.success = false;
                                                    error.status = 403;
                                                    error.message = 'User not addded';
                                                    res.send(error);
                                                }
                                                let result = {
                                                    success: true,
                                                    status: 200,
                                                    message: 'User data added successfully.',
                                                    response: dataval.ops
                                                }
                                                res.status(200).send(result)
                                            })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                let result = {
                    success: false,
                    status: 403,
                    message: 'Password incorrect!',
                    response: data
                }
                res.send(result);
            }
        })
    } catch (err) {
        util.writeLog(`${err} -> createUser Error`, 'post:/tenant/setadminhiddenData');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'User not created';
        res.send(error);
    }

})

/**
 * Sends a HTTP post request to verify super admin login for tenant to super admin screen navigation.
 * </br> 
 * @function verifyAdmin
 * @path {post} path /tenant/verifyAdmin
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} Its contain super admin credantials for verfication.
 * @return {Object} Its return success or failure message based on login credantials.
 */
router.post('/verifyAdmin', (req, res) => {
    try {
        var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 24, 'sha512');
        let password = (new Buffer(hash).toString('hex'))
        admintData.find({ password: password }, function (err, data) {
            if (data.length > 0) {
                let result = {
                    success: true,
                    status: 200,
                    message: 'Login Success!',
                    response: data
                }
                res.send(result);
            } else {
                let result = {
                    success: false,
                    status: 403,
                    message: 'Password incorrect!',
                    response: data
                }
                res.send(result);
            }
            if (err) {
                util.writeLog(`${err} -> admintData.find`, 'post:/tenant/verifyAdmin');
                var error = new Error();
                error.success = false;
                error.status = 403;
                error.message = 'Login not success';
                res.send(error);
            }
        })
    } catch (err) {
        util.writeLog(`${err} -> admintData.find catch error`, 'post:/tenant/verifyAdmin');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'Login not success';
        res.send(error);
    }
})

/**
 * Sends a HTTP post request to verify super admin login for super admin to tenant screen navigation.
 * For every request to update Super admin password in specific tenant hidden user.  For the purpose every tenant hidden user have same password.
 * </br> 
 * @function verifyAdminForTenant
 * @path {post} path /tenant/verifyAdminForTenant
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} Its contain super admin credantials for verfication.
 * @return {Object} Its return success or failure message based on login credantials.
 */
router.post('/verifyAdminForTenant', (req, res) => {
    let db = global.db;
    var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 24, 'sha512');
    let password = (new Buffer(hash).toString('hex'))

    admintData.find({ password: password }, function (err, data) {
        if (err) {
            util.writeLog(`${err} -> verifyAdminForTenant`, 'post:/tenant/verifyAdminForTenant');
            var error = new Error();
            error.success = false;
            error.status = 403;
            error.message = 'Login not success';
            res.send(error);
        }
        if (data.length > 0) {
            db.collection('users').findOneAndUpdate({ "superAdmin": true, "role": "1", }, {
                $set: { password: password }
            }, (err, datavalue) => {
                if (err) {
                    util.writeLog(`${err} -> updatetenant Error`, 'post:/tenant/verifyAdminForTenant');
                    var error = new Error();
                    error.success = false;
                    error.status = 403;
                    error.message = 'Login not success';
                    res.send(error);
                }
                db.collection('users').find({ "superAdmin": true, "role": "1", password: password }).toArray((err, datavalue) => {
                    if (data.length > 0) {
                        let result = {
                            success: true,
                            status: 200,
                            message: 'Login Success!',
                            response: datavalue
                        }
                        res.send(result);
                    } else {
                        let result = {
                            success: false,
                            status: 403,
                            message: 'Password incorrect!',
                            response: data
                        }
                        res.send(result);
                    }
                    if (err) {
                        util.writeLog(`${err} -> updatetenant superAdmin Error `, 'post:/tenant/verifyAdminForTenant');
                        var error = new Error();
                        error.success = false;
                        error.status = 403;
                        error.message = 'Login not success';
                        res.send(error);
                    }
                })
            })
        } else {
            let result = {
                success: false,
                status: 403,
                message: 'Password incorrect!',
                response: data
            }
            res.send(result);
        }
    })

})


/**
 * Sends a HTTP PUT request to update tenant record based on tenant id in super admin DB.
 * </br>
 * @function updateTenantDetails_data
 * 
 * @path {PUT} path /tenant/updateTenantDetails_data
 * @param req {Object} The req updateTenantDetails represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain tenant details for updating record.
 * @param :id {string} Id is used to update specific tenant. it represent _id.
 * @return {Object} Its return success or failure message based on data updation.
 */
router.put('/updateTenantDetails_data/:id', (req, res) => {
    let db = global.db;

    let userStore = {
        userlimit: Number(req.body.userlimit),
        SubscriptionEndDate: new Date(req.body.SubscriptionEndDate),
        SubscriptionStartDate: new Date(req.body.SubscriptionStartDate),
        TenantId: req.body.TenantId,
        tenantName: req.body.tenantName,
        status: req.body.status

    };
    let tenantdataForAdmin = {
        status: req.body.status,
        tenantDetails: req.body.tenantDetails,
        SubscriptionStartDate: req.body.SubscriptionStartDate,
        SubscriptionEndDate: req.body.SubscriptionEndDate,
        userlimit: Number(req.body.userlimit),
        UpdatedAt: new Date()
    };

    db.collection('config').findOneAndUpdate({ TenantId: req.body.TenantId, tenantName: req.body.tenantName }, {
        $set: userStore
    }, (err, datavalue) => {
        if (err) {
            util.writeLog(`${err} -> updatetenant Error`, 'post:/tenant/updateTenantDetails_data');
            var error = new Error();
            error.success = false;
            error.status = 403;
            error.message = 'Tenant not update';
            res.send(error);
        }

        TenantModel.findByIdAndUpdate({ _id: ObjectID(req.params.id) }, tenantdataForAdmin, (err, data) => {
            if (err) {
                util.writeLog(`${err} -> TenantModel.findByIdAndUpdate updatetenant Error`, 'post:/tenant/updateTenantDetails_data');
                var error = new Error();
                error.success = false;
                error.status = 403;
                error.message = 'Tenant not update';
                res.send(error);
            } else {
                let result = {
                    success: true,
                    status: 200,
                    message: 'Tenant updated successful!',
                    response: data
                }
                res.status(200).send(result)
            }
        })

    })
})




module.exports = router