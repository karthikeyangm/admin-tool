
/**
 * UserModel module to perform users operations through User module ..
 * @module User Model
 * @see {@link User}
 */

var ObjectID = require('mongodb').ObjectID;
var admin = require('../models/adminModel');
var tenantModel = require('../models/TenantModel')
var SubscribersDetails_model = require('../models/subscribersModel')

module.exports = {
    /**
     * * getcountOfuser method to get user count.<br>
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data 
     * @return {Object} Its return the count
     */
    getcount: (collectionName) => {
        return new Promise((resolve, reject) => {
            let db = global.db;
            db.collection(collectionName).find().toArray((err, scenarioCount) => {
                if (err) {
                    reject(err)
                }
                db.collection('groupinfo').find({}).toArray((err, len) => {
                    if (err) {
                        reject(err)
                    }
                    let result = {
                        success: true,
                        status: 200,
                        groupCount: len.length,
                        scenarioCount: scenarioCount.length,
                        message: "success."
                    }
                    resolve(result)
                })
            })
        })
    },
}