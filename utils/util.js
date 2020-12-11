var config = require("../config/config");
var fs = require('fs');


/**
 * writeLog module to crete error logs in Public/log folder.
 * @module ErrorLog
 * 
 */

function writeLog(message, url) {
    var date = new Date();
    var fileName = "./public/logs/log_" + date.getDate() + "-" + (date.getMonth() + 1) +
        "-" + date.getFullYear() + ".txt";
    // var msg = "\n\n*************\n Date :" + date.getDate() + "-" + (date.getMonth() + 1) + "-" +
    //     date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() +
    //     "\n IP Address:" + config.IP_ADDRESS + "\n PORT: " + config.PORT + "\n Service Url:" + url +
    //     "\n Message: " + typeof message == "object" ? JSON.stringify(message) : message + "\n*************";

    var msg = `
    ************* Date : ${date.getDate()} -  ${date.getMonth() + 1} - ${date.getFullYear()} - ${date.getHours()} :  ${date.getMinutes()} : ${date.getSeconds()}
    IP Address: ${config.IP_ADDRESS} PORT: ${config.PORT} Service Url: ${url}
    Message: ${typeof message == "object" ? JSON.stringify(message) : message} *************
    `;



    if (fs.existsSync(fileName)) {
        fs.appendFile(fileName, msg, function (err) {
            if (err) throw err;
            console.log('log Updated!');
        });
    } else {
        fs.open(fileName, 'w', function (err, file) {
            if (err) throw err;
            fs.appendFile(fileName, msg, function (err) {
                if (err) throw err;
                console.log('log Updated!');
            });
        });
    }

}
module.exports.writeLog = writeLog;