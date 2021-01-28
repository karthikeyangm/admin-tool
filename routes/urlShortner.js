
/**
 * URLShortner module to perform URl based operations..
 * @module URLShortner 
 
 */

var express = require('express');
var router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const Url = require('../models/Url');
var ObjectID = require('mongodb').ObjectID;
const q = require('q');
const webPush = require('web-push');
var emailNotification=require('../models/sendEmail')
var util = require("../utils/util");


/**
 * Sends a HTTP POST request to create shortner based on scenario id.
 * </br> 
 * @function URLShortner
 * @function
 * @path {POST} path /urlShortner/shorten
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain scenario details to create shortner url.
 * @param baseUrl  {Library} Used to validate the base url.
 * @param shortid  {Library} Used to genrate url code.
 * @param shortUrl  {String} Base url and url code combained to get the short url
 * @return {Object} Its return shrt url object. It contains Longurl, Shorturl, urlcode and scenario id.
 */



router.post('/shorten', async function (req, res, next) {
  let db = global.db;
  // const { longUrl, ScenarioId } = req.body;
  const longUrl = req.body.longUrl
  const ScenarioId = req.body.ScenarioId
  const dataValue = req.body.data
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
            // const shortUrl = baseUrl + '/pages/loginshort/' + configdata[0].urlCode + '/' + urlCode;
            const shortUrl = process.env.baseUrl + '#/pages/loginshort/' + configdata[0].urlCode + '/' + urlCode;

            let tenantCode = configdata[0].urlCode
            let tenantName= configdata[0].tenantName
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
                          
                          // ,
                          // "actions": [{
                          //   "action": "explore",
                          //   "title": "Go to the site"
                          // }]
                        }

                        // title: 'New Scenario Added',
                        // message: 'New Scenario is created by Admin.',
                        // url: shortUrl,
                        // ttl: 'New Scenario Added',
                        // icon: req.body.icon,
                        // image: req.body.image,
                        // badge: req.body.badge,
                        // tag: req.body.tag
                      };
                      db.collection('subscribers').find({ userId: { $in: userIdData } }).toArray((err, subscriptions) => {
                        // Subscription.find({}, (err, subscriptions) => {
                        if (err) {
                          console.error(`Error occurred while getting subscriptions`);
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
                                console.log(err)
                                reject({
                                  status: false,
                                  endpoint: subscription.endpoint,
                                  data: err
                                });
                              });
                            });
                          });
                          q.allSettled(parallelSubscriptionCalls).then((pushResults) => {
                            console.info(pushResults);
                          });

                          db.collection('scenarios').updateMany({ "_id": ObjectID(ScenarioId) },
                            { $set: { shortUrl: shortUrl } }, (err, resData) => {
                              db.collection('users').find({ SelectedGroup: { $in: userStore.SelectedGroup } }).toArray((err, userdataValue) => {
                                let mailAddress=[]
                                if(userdataValue){
                                  if(userdataValue.length>0){
                                    for(let aa=0;aa<userdataValue.length;aa++){
                                      mailAddress.push(userdataValue[aa].email)
                                    }
                                    let emailId=mailAddress
                                    let subject=`${dataValue.Title} scenario added`
                                    let message=`${dataValue.Information} scenariod added by Admin.`
                                    let htmlMsg=''
                                   // var emailMsg =  emailNotification.sendMailModel(emailId,subject,message,htmlMsg)
                                    res.json(dataval);
                                  }else{
                                    res.json(dataval);
                                  }
                                }else{
                                  res.json(dataval);
                                }

                              })
                             
                            })
                          // res.json({
                          //   data: 'Push triggered'
                          // });
                        }
                      });
                    }

                  }
                })
              }
              // res.json(dataval);
            })
          })
        }
      })
      // let url = await Url.findOne({ ScenarioId });
      // if (url) {
      //     res.json(url);
      // } else {
      //     const shortUrl = baseUrl + '/' + urlCode;
      //     url = new Url({
      //         longUrl,
      //         shortUrl,
      //         urlCode,
      //         ScenarioId,
      //         date: new Date()
      //     });

      //     await url.save();

      //     res.json(url);
      // }
    } catch (err) {
      util.writeLog(`${err} -> shorten Error`, 'get:/urlshort/shorten');
      res.status(500).json('Server error');
    }
  } else {
    util.writeLog(`Not valid long url`, 'get:/urlshort/shorten');
    res.status(401).json('Invalid long url');
  }
});



router.post('/scenarioredirect', async (req, res) => {
  let db = global.db;
  db.collection("SecnarioShortUrls").find({ tenantCode: req.body.tenantCode, urlCode: req.body.scenarioUrlCode }).toArray((err, resdata) => {

    if (err) {
      let result = {
        success: false,
        message: 'No Url Found'
      }
      res.json(result)
    }

    if (resdata.length > 0) {
      let result = {
        success: true,
        message: 'success',
        resdata: resdata
      }
      res.json(result);
    } else {
      let result = {
        success: false,
        message: 'No Url Found'
      }
      res.json(result)
    }

  })
})


module.exports = router;
