// var Clients = require('../models/clients');
// var basedomain = dbConfig.baseDomain;
var allowedSubs = { 'admin': true, 'www': true };
// allowedSubs[basedomain] = true;
const url = require('url');


var crypto = require('crypto');

var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = '789456123';


function clientlistener() {
    return function (req, res, next) {


        console.log(req.headers)
        var TenantDetail = ""
        if (req.query.tendetail == undefined) {
            TenantDetail = req.headers.tendetail
        } else {
            TenantDetail = req.query.tendetail
        }

        console.log(TenantDetail + "====query")
        // var queryv = url.parse(req.url, true).query;
        // console.log(queryv)
        // var vpar = JSON.parse(JSON.stringify(queryv))
        // console.log(vpar.tendetail)
        // tenant Creation start
        // var decrypted = [{
        //     tenantId: '123456789',
        //     type: 'tenantcreation',
        //     tenantname: 'NetApp'
        // }]
        // var cipher = crypto.createCipher(algorithm, key);
        // var encrypted = cipher.update(JSON.stringify(dataforEncrypt), 'utf8', 'hex') + cipher.final('hex');

        var decipher = crypto.createDecipher(algorithm, key);
        console.log("decrypted")
        decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));
        // console.log(req.session.Client)
        // console.log(decrypted[0].tenantname)
        if (req.session.Client &&
            req.session.Client.name === decrypted[0].tenantname) {
            // if (req.session.Client && req.session.Client.name === decrypted[0].tenantname) {
            //console.dir('look at the sub domain  ' + req.subdomains[0]);
            //console.dir('testing Session ' + req.session.Client);
            console.log('did not search database for ' + decrypted[0].tenantname);
            //console.log(JSON.stringify(req.session.Client, null, 4));
            next();
        }
        else {
            db.collection('TenantDetails').findOne({ "TenantId": decrypted[0].tenantId }, function (err, client) {
                if (!err) {
                    if (!client) {
                        //res.send(client);
                        res.send(403, 'Sorry! you cant see that.');
                    }
                    else {
                        console.log('searched database for ' + client.Tenant_Name);
                        //console.log(JSON.stringify(client, null, 4));
                        //console.log(client);
                        req.session.tester = "moyo cow";
                        req.session.Client = client;
                        return next();
                    }
                }
                else {
                    return next(err)
                }

            });
        }

    }
}



module.exports = clientlistener;