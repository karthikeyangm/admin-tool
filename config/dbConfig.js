/**
 * dbConfig module.
 * @module DB Connection
 * 
 */
var express = require('express');
var app = express();
const crypto = require("crypto").randomBytes(256).toString('hex')
const mongoose = require('mongoose');
var db;
var initialized = false;

/**
 * open database super admin connection at the time of server starting to store global variable.
 * @param  {string} database Its represent database name
 * @param  {string} host Its represent host name
 * @param  {Function} callback Its represent callback funtionif db initialized its excute
 * @type {number}
 */

function initialize(database, host,callback) {
    if (initialized) {
        return callback();
    }
    initialized = true;
       /**
     * Notice the idenfier newFunction given to the member
     * You can now document the function here
     */
    openMongo(callback,host);
}


function openMongo(callback,host) {
    var url = 'mongodb://admin:S1fyTwswd@mongodb/NetApp';
//    var url='mongodb+srv://elearning:Elearning321@cluster0.nzqy8.mongodb.net/TenantMaster?retryWrites=true&w=majority'
    mongoose.connect(url, {
        useCreateIndex: true, useNewUrlParser: true,useUnifiedTopology: true
    }, (err, client) => {
        if (err) {
            console.log("connection refused")
        } else {
            db = client.db//(process.env.DB);        
            global.db = db;
            global.clients={}
            global.clientdbconn={}
            console.log("database connected "+ process.env.DB)
        }
    })
}

module.exports.initialize = initialize;
module.exports.openMongo = openMongo;


// db.AdminDetails.insert({
//     "firstname" : "Sify", 
//     "lastname" : "Admin", 
//     "mobile" : "1234657789", 
//     "username" : "admin", 
//     "email" : "admin@gmail.com", 
//     "role" : "0", 
//     "password" : "dd5204ed569ed5c4b9e4ce70e722ba7e17779a3ea64ae756",
//     "status" : "Active", 
//   })