/**
 * Short URL based routing for login screen
 * @module ShorturlGet 
 * @see {@link UrlTenant}
 */
const express = require('express');
const router = express.Router();

/**
 * Its contains the details of Short Url detaiils
 * @type {SchemaObject}
 */
const Url = require('../models/Url');

/**
 * Its contains the details of Short Url stored against the tenant 
 * @type {SchemaObject}
 */
const UrlTenant = require('../models/TenantModel');


/**
 * Sends a HTTP GET request to get the tenant long url based on url code for Scenarios.
 * </br> 
 * @function uploadfile
 * @function
 * @path {GET} path /code
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.params.code {string} It conains the short code of lang url. based on that code to find the specific tenant to get long URL.
 * @return {String} Its return success or failure message based on that message its redirect the tenant origianl URL for Scenario.
 */


// @route     GET /:code
// @desc      Redirect to long/original URL
router.get('/:code', async (req, res) => {
  let db = global.db;
  try {
    
    db.collection("SecnarioShortUrls").find({  urlCode: req.params.code }).toArray((err, resdata) => {
      if(err){
        return res.status(404).json('No url found');
      }

      if(resdata.length>0){
        return res.json(resdata);
        // return res.redirect(resdata[0].longUrl);
      }else{
        return res.status(404).json('No url found');
      }

    })
    // const url = await Url.findOne({ urlCode: req.params.code });

    // if (url) {
    //   return res.redirect(url.longUrl);
    // } else {
    //   return res.status(404).json('No url found');
    // }
  } catch (err) {
    res.status(500).json('An internal error occurred. Please try again later');
  }
});


/**
 * Sends a HTTP GET request to get the tenant long url based on url code for login.
 * </br> 
 * @function uploadfile
 * @function
 * @path {GET} path /login/code
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.params.code {string} It conains the short code of lang url. based on that code to find the specific tenant to get long URL.
 * @return {String} Its return success or failure message based on that message its redirect the tenant origianl URL for login.
 */

router.get('/login/:code', async (req, res) => {
  try { 
    let db = global.db;
    // const url = await UrlTenant.findOne({ urlCode: req.params.code });
    const url = await db.collection('TenantDetails').findOne({ urlCode: req.params.code });

    if (url) {
      return res.redirect(url.Tenant_Url);
    } else {
      return res.status(404).json('No url found');
    }
  } catch (err) {
    res.status(500).json('An internal error occurred. Please try again later');
  }
});

module.exports = router;
