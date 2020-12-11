var mongoose = require('mongoose');
//var dynamicConnection = require('../models/dynamicMongoose');

var crypto = require('crypto');
var assert = require('assert');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = '789456123';
var text = 'I love kittens';

function setclientdb() {
    return function (req, res, next) {


        var TenantDetail = ""
        if (req.query.tendetail == undefined) {
            TenantDetail = req.headers.tendetail
        } else {
            TenantDetail = req.query.tendetail
        }

        var decipher = crypto.createDecipher(algorithm, key);
        var decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));

        // var decrypted = [{
        //     tenantId: '123456789',
        //     type: 'tenantcreation',
        //     tenantname: 'NetApp'
        // }]
        //check if client has an existing db connection                                                               /*** Check if client db is connected and pooled *****/
        if (/*typeof global.App.clientdbconn === 'undefined' && */ typeof (req.session.Client) !== 'undefined'
            && global.clients[req.session.Client.name] !== decrypted[0].tenantname)  //////////lastcheck
        {
            //check if client session, matches current client if it matches, establish new connection for client
            if (req.session.Client) {
                console.log('setting db for client ' + decrypted[0].tenantname + ' and ' + req.session.Client.dbUrl);
                client = mongoose.createConnection(req.session.Client.dbUrl /*, dbconfigoptions*/);


                client.on('connected', function () {
                    console.log('Mongoose default connection open to  ' + req.session.Client.name);
                });
                // When the connection is disconnected
                client.on('disconnected', function () {
                    console.log('Mongoose ' + req.session.Client.name + ' connection disconnected');
                });

                // If the Node process ends, close the Mongoose connection
                process.on('SIGINT', function () {
                    client.close(function () {
                        console.log(req.session.Client.name + ' connection disconnected through app termination');
                        process.exit(0);
                    });
                });

                //If pool has not been created, create it and Add new connection to the pool and set it as active connection

                if (typeof (global.clients) === 'undefined' || typeof (global.clients[req.session.Client.name]) === 'undefined'
                    && typeof (global.clientdbconn[req.session.Client.name]) === 'undefined') {
                    clientname = req.session.Client.name;
                    global.clients[clientname] = req.session.Client.name;// Store name of client in the global clients array
                    activedb = global.clientdbconn[clientname] = client; //Store connection in the global connection array
                    console.log('I am now in the list of active clients  ' + global.clients[clientname]);
                }
                global.db = activedb;
                console.log('client connection established, and saved ' + req.session.Client.name);
                next();
            }
            //if current client, does not match session client, then do not establish connection
            else {
                delete req.session.Client;
                client = false;
                next();
            }
        }
        else {
            if (typeof (req.session.Client) === 'undefined') {
                next();
            }
            //if client already has a connection make it active
            else {
                global.db = global.clientdbconn[req.session.Client.name];
                console.log('did not make new connection for ' + req.session.Client.name);
                return next();
            }

        }
    }
}

module.exports = setclientdb;