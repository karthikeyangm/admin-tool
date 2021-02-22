var CryptoJS = require("crypto-js");
var express = require('express');
var router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const Url = require('../models/Url');
var ObjectID = require('mongodb').ObjectID;
const q = require('q');
const webPush = require('web-push');
var emailNotification = require('../models/sendEmail')
var util = require("../utils/util");
const { db } = require('../models/Url');

router.post('/authoringData', async (req, res) => {
    try {
        var jsonData = JSON.parse(req.body['json'])
        let db = global.db;
        // jsonData['assetID']=ObjectID(jsonData.assetID)
        if (jsonData.publishFlag == 1) {
            var dataforEncrypt = {
                ScenarioId: jsonData.scenarioID,
                ScenarioTitle: jsonData.scenarioTitle
            }
            var encryptedvalueResult;
            await encryptData(dataforEncrypt)
            function encryptData(dataforEncrypt) {
                let conversionOutput = CryptoJS.AES.encrypt(JSON.stringify(dataforEncrypt),
                    (process.env.cryptokey).trim()).toString();
                const dataCheck = conversionOutput.includes('/');
                if (dataCheck) {
                    encryptData(dataforEncrypt)
                } else {
                    encryptedvalueResult = conversionOutput
                    // return conversionOutput
                }
            }
            if (encryptedvalueResult != undefined) {
                const deeplink = process.env.baseUrl + '#/pages/scenario-test/' + encryptedvalueResult
                db.collection('scenarios').find({ _id: ObjectID(jsonData.scenarioID) }).toArray((err, sceData) => {
                    if (err) {
                        util.writeLog(`${err} -> shorten Error`, 'get:/urlshort/scenarios-err');
                        res.status(500).json('Server error');
                    } else {
                        if (sceData.length > 0) {
                            let valueData = jsonData
                            db.collection('scenarios').updateOne({ _id: ObjectID(jsonData.scenarioID) }, { $set: valueData }, (err, updateStatus) => {
                                if (err) {
                                    util.writeLog(`${err} -> shorten Error`, 'get:/urlshort/scenarios');
                                    res.status(500).json('Server error');
                                }
                                const longurldata = {
                                    longUrl: deeplink,
                                    ScenarioId: jsonData.scenarioID,
                                    data: sceData[0]
                                }
                                const longUrl = longurldata.longUrl
                                const ScenarioId = longurldata.ScenarioId
                                const dataValue = longurldata.data
                                const baseUrl = config.get('baseUrl');

                                // Check base url
                                if (!validUrl.isUri(baseUrl)) {
                                    return res.status(401).json('Invalid base url');
                                }
                                // Create url code
                                const urlCode = shortid.generate();
                                // Check long url
                                if (validUrl.isUri(longUrl)) {
                                    try {
                                        db.collection("SecnarioShortUrls").find({ ScenarioId: ObjectID(ScenarioId) }).toArray((err, resdata) => {
                                            if (resdata.length > 0) {
                                                res.json(resdata);
                                            } else {
                                                db.collection("config").find({}).toArray((err, configdata) => {
                                                    const shortUrl = process.env.baseUrl + '#/pages/loginshort/' + configdata[0].urlCode + '/' + urlCode;
                                                    let tenantCode = configdata[0].urlCode
                                                    let tenantName = configdata[0].tenantName
                                                    let url = new Url({
                                                        longUrl,
                                                        shortUrl,
                                                        urlCode,
                                                        ScenarioId,
                                                        tenantCode,
                                                        date: new Date()
                                                    });
                                                    db.collection('SecnarioShortUrls').insertOne(url, (err, dataval) => {
                                                        if (dataValue.SelectedGroup != undefined) {
                                                            for (var i = 0; i < dataValue.SelectedGroup.length; i++) {
                                                                dataValue.SelectedGroup[i] = ObjectID(dataValue.SelectedGroup[i]);
                                                            }
                                                        }
                                                        var userStore = {};
                                                        userStore = {
                                                            Title: dataValue.Title,
                                                            SelectedGroup: dataValue.SelectedGroup
                                                        }
                                                        notificationFun()
                                                        async function notificationFun() {
                                                            let db = global.db;
                                                            await db.collection('groupinfo').find({ _id: { $in: userStore.SelectedGroup } }).toArray((err, dataalue) => {
                                                                if (dataalue.length > 0) {
                                                                    let userIdData = []
                                                                    for (let a = 0; a < dataalue.length; a++) {
                                                                        if (dataalue[a].userIds) {
                                                                            for (let b = 0; b < dataalue[a].userIds.length; b++) {
                                                                                userIdData.push(ObjectID(dataalue[a].userIds[b]))
                                                                            }
                                                                        }
                                                                    }
                                                                    sendNotificationFunction()

                                                                    async function sendNotificationFunction() {
                                                                        const payload = {
                                                                            "notification": {
                                                                                "title": dataValue.Title + " Scenario Added",
                                                                                "body": dataValue.Information,
                                                                                "icon": "assets/main-page-logo-small-hat.png",
                                                                                "vibrate": [100, 50, 100],
                                                                                "data": {
                                                                                    "dateOfArrival": Date.now(),
                                                                                    "primaryKey": 1,
                                                                                    "url": shortUrl //'https://adminpanel.sifylivewire.com:8081/pages/loginshort/lw8rLHiAa'
                                                                                }
                                                                            }
                                                                        };
                                                                        db.collection('subscribers').find({ userId: { $in: userIdData } }).toArray((err, subscriptions) => {
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
                                                                                                // subject: 'https://adminpanel.sifylivewire.com:8081/',
                                                                                                subject: tenantName,//process.env.baseUrl,
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

                                                                                db.collection('scenarios').updateMany({ "_id": ObjectID(ScenarioId) },
                                                                                    { $set: { shortUrl: shortUrl } }, (err, resData) => {
                                                                                        db.collection('users').find({ SelectedGroup: { $in: userStore.SelectedGroup } }).toArray((err, userdataValue) => {
                                                                                            let mailAddress = []
                                                                                            if (userdataValue) {
                                                                                                if (userdataValue.length > 0) {
                                                                                                    for (let aa = 0; aa < userdataValue.length; aa++) {
                                                                                                        mailAddress.push(userdataValue[aa].email)
                                                                                                    }
                                                                                                    let emailId = mailAddress
                                                                                                    let subject = `${dataValue.Title} scenario added`
                                                                                                    let message = `${dataValue.Information} scenariod added by Admin.`

                                                                                                    let htmlMsg = `Hi,<br><br> The scenario <strong>(${dataValue.Title})</strong> is creadted by admin.
                                                                                                    So please <a href="${shortUrl}">click here</a> to access the scenario.
                                                                                                    <br/><br>Thanks,<br>- Admin<br><br>`
                                                                                                    var emailMsg = emailNotification.sendMailModel(emailId, subject, message, htmlMsg)
                                                                                                    res.json(dataval);
                                                                                                } else {
                                                                                                    res.json(dataval);
                                                                                                }
                                                                                            } else {
                                                                                                res.json(dataval);
                                                                                            }
                                                                                        })
                                                                                    })
                                                                            }
                                                                        });
                                                                    }

                                                                }
                                                            })
                                                        }
                                                    })
                                                })
                                            }
                                        })

                                    } catch (err) {
                                        util.writeLog(`${err} -> shorten Error`, 'get:/urlshort/shorten');
                                        res.status(500).json('Server error');
                                    }
                                } else {
                                    util.writeLog(`Not valid long url`, 'get:/urlshort/shorten');
                                    res.status(401).json('Invalid long url');
                                }
                            })
                        } else {
                            res.status(401).json('Scenario not found');
                        }
                    }
                })
            } else {
                encryptData(dataforEncrypt)
            }
        } else {
            db.collection('scenarios').find({ _id: ObjectID(jsonData.scenarioID) }).toArray((err, data) => {
                if (err) {
                    util.writeLog(`${err} -> shorten Error`, 'get:/urlshort/scenarios-else');
                    res.status(500).json('Server error');
                } else {
                    if (data.length > 0) {
                        let valueData = jsonData
                        db.collection('scenarios').updateOne({ _id: ObjectID(jsonData.scenarioID) }, { $set: valueData }, (err, updateStatus) => {
                            if (err) {
                                util.writeLog(`${err} -> shorten Error`, 'get:/urlshort/scenarios-else');
                                res.send(err)
                            }else{
                                res.send(updateStatus)
                            }
                        })
                    } else {
                        res.status(401).json('Scenario not found');
                    }
                }
            })
        }
    } catch (e) {
        util.writeLog(`${e} -> authoringData`, 'post:/authoringToolData/authoringData');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }

})

module.exports = router;