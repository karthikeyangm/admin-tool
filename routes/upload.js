
/**
 * Upload module to perform File based operations..
 * @module Upload
 */

var express = require('express');
var router = express.Router();
const multer = require('multer');
let fs = require('fs-extra');
var fileSystem = require('fs')
var path = require('path');
var crypto = require('crypto');
var os = require('os');
var ObjectID = require('mongodb').ObjectID;
var util = require("../utils/util");
/**
 * Its contains the details of uploa0ding destination and renaming process
 * @type {Function}
 */
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let tenantname = req.query.tenantDeatails
        let typePath = req.query.type
       if(req.query.type != 'guidefiles'){
        let path = `./uploads/assets/${tenantname}/${typePath}`;
        // cb(null, 'uploads')
        fs.mkdirsSync(path);        
        cb(null, path);
       }else{
        let path = `./uploads/pdf/${tenantname}/${typePath}`;
        fs.mkdirsSync(path);        
        cb(null, path);
       }
    },
    filename: function (req, file, cb) {
        const vName = file.originalname.split('.')
        if (req.query.type == 'uploadcommand'||req.query.type == 'guidefiles') {
            let filenameNew = (file.originalname).split('.');
            cb(null, filenameNew[0] + '-' + Date.now() + '.' + vName[vName.length - 1])
        } else {
            cb(null, file.originalname)
        }
        // cb(null, file.originalname)// + '-' + Date.now() + '.' + vName[vName.length - 1])
        // cb(null, file.originalname + '-' + Date.now() + '.' + vName[vName.length - 1])
    }
})

/**
 * Its show to properties of multer library. Here we declare what type of storage and what type of files we want to processs.
 * @type {Function}
 */
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ||
         file.mimetype == 'application/octet-stream'|| file.mimetype== 'application/pdf') {
            cb(null, true);
        } else {
            cb(null, false);
            // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }

})
/**
 * Sends a HTTP POST request to create user record based on tenant Login.
 * </br> 
 * @function uploadfile
 * @function
 * @path {POST} path /upload/uploadfile
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param upload.single {Function} It act as a midileware and it contains the details of file storage and upload variables.
 * @param req.file {File} Its contain File details to store in storage
 * @return {Object} Its return success or failure message based on File upload status.
 */

router.post('/uploadfile', upload.single('File'), (req, res, next) => {
    try {
        const file = req.file
        if (!file) {
            const error = {
                status: false
            }
            // error.httpStatusCode = 400
            res.status(400).send(error);
            // res.send(error)
            // return next(error)
        } else {
            file['status'] = true
            if (req.query.type == 'uploadcommand') {
                var ret = ''
                if (os.type() == 'Windows_NT') {
                    ret = (file.path).replace('uploads\\', '');
                } else {
                    ret = (file.path).replace('uploads/assets/', '');
                }
                file['path'] = process.env.baseUrl + ret
            }
            if (req.query.type == 'guidefiles') {
                var ret = ''
                if (os.type() == 'Windows_NT') {
                    ret = (file.path).replace('uploadspdf\\', '');
                } else {
                    ret = (file.path).replace('uploads/pdf/', '');
                }
                file['path'] = process.env.baseUrl + ret
            }
            res.status(200).send(file);
        }
    } catch (err) {
        util.writeLog(`${err} -> uploadfile`, 'post:/uploadImg/uploadfile');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }

})


router.get('/getThumpnailImg/:id', (req, res) => {
    try {
        var TenantDetail = req.headers.tendetail
        var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
        let decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));
        let p = path.join(__dirname, `../uploads/assets/${decrypted[0].tenantname}/thumbnail/${req.params.id}`);
        res.sendFile(p);
    } catch (err) {
        util.writeLog(`${err} -> getThumpnailImg`, 'get:/uploadImg//getThumpnailImg/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

router.get('/getThumpnailImg', (req, res) => {
    try {
        var TenantDetail = req.headers.tendetail
        var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
        let decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));
        let p = path.join(__dirname, `../uploads/assets/${decrypted[0].tenantname}/thumbnail/${req.query.id}`);
        res.sendFile(p);
    } catch (err) {
        util.writeLog(`${err} -> getThumpnailImg`, 'get:/uploadImg//getThumpnailImg');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})


router.get('/getbundle', (req, res) => {
    try {
        let filename = 'cubetest.unity3d'
        let p = path.join(__dirname, `../uploads/sample/bundle/${filename}`);
        res.sendFile(p);
    } catch (err) {
        util.writeLog(`${err} -> getbundle`, 'get:/uploadImg//getbundle');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
    // res.download(p);
})
router.get('/getmanifest', (req, res) => {
    try {
        let filename = 'cubetest.unity3d.manifest'
        if (os.type() == 'Windows_NT') {
            let p = path.join(__dirname, `../sample/bundle/${filename}`);
            res.sendFile(p);
        } else {
            let p = path.join(__dirname, `../uploads/sample/bundle/${filename}`);
            res.sendFile(p);
        }
    } catch (err) {
        util.writeLog(`${err} -> getmanifest`, 'get:/uploadImg//getmanifest');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})


router.get('/getthumbnailData', (req, res) => {
    try {
        var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
        let decrypted = JSON.parse(decipher.update(req.query.id, 'hex', 'utf8') + decipher.final('utf8'));
        var vSplitData = (decrypted[0].thumbnailImgPath).split(process.env.baseUrl);
        if (os.type() == 'Windows_NT') {
            let p = path.join(__dirname, `../${vSplitData[1]}`);
            res.sendFile(p);
        } else {
            let p = path.join(__dirname, `../uploads/assets/${vSplitData[1]}`);
            res.sendFile(p);
        }
    } catch (err) {
        util.writeLog(`${err} -> getthumbnailData`, 'get:/uploadImg//getthumbnailData');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

router.get('/getthumbnailData/:id', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.params.id) }).toArray((err, resdata) => {
            try {
                if (err) {  res.send(err)
                }
                var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
                let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
                var vSplitData = (decrypted[0].thumbnailImgPath).split(process.env.baseUrl);
                if (os.type() == 'Windows_NT') {
                    let p = path.join(__dirname, `../${vSplitData[1]}`);
                    res.sendFile(p);
                } else {
                    let p = path.join(__dirname, `../uploads/assets/${vSplitData[1]}`);
                    res.sendFile(p);
                }
            } catch (err) {
                util.writeLog(`${err} -> getthumbnailData`, 'get:/uploadImg/getthumbnailData/:id--data');
                var error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'An internal error occurred. Please try again later';
                res.send(error);
            }
        });
    } catch (err) {
        util.writeLog(`${err} -> getthumbnailData`, 'get:/uploadImg//getthumbnailData/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

router.get('/getbundelData', (req, res) => {
    let db = global.db;
    try {
        let queryStrValue = (req.query.id).includes("?")
        var valueData = ''
        if (queryStrValue) {
            valueData = (req.query.id).split('?')[0]
        } else {
            valueData = req.query.id
        }
        db.collection('assestdetails').find({ _id: ObjectID(valueData) }).toArray(async (err, resdata) => {
            try {
                if (err) {  res.send(err)
                }
                var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
                let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
                var vSplitData = (decrypted[0].bundlePath).split(process.env.baseUrl);
                if (os.type() == 'Windows_NT') {
                    let p = path.join(__dirname, `../${vSplitData[1]}`);
                    res.sendFile(p);
                } else {
                    let p = path.join(__dirname, `../uploads/assets/${vSplitData[1]}`);
                    res.sendFile(p);
                }
            } catch (err) {
                util.writeLog(`${err} -> getbundelData`, 'get:/uploadImg//getbundelData');
                var error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'An internal error occurred. Please try again later';
                res.send(error);
            }
        });

    } catch (err) {
        util.writeLog(`${err} -> getbundelData`, 'get:/uploadImg//getbundelData');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})
router.get('/getbundelData/:id', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.params.id) }).toArray((err, resdata) => {
            try {
                if (err) {  res.send(err)
                }
                var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
                let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
                var vSplitData = (decrypted[0].bundlePath).split(process.env.baseUrl);
                if (os.type() == 'Windows_NT') {
                    let p = path.join(__dirname, `../${vSplitData[1]}`);
                    res.sendFile(p);
                } else {
                    let p = path.join(__dirname, `../uploads/assets/${vSplitData[1]}`);
                    res.sendFile(p);
                }
            } catch (err) {
                util.writeLog(`${err} -> getbundelData`, 'get:/uploadImg//getbundelData/:id--data');
                var error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'An internal error occurred. Please try again later';
                res.send(error);
            }

        });

    } catch (err) {
        util.writeLog(`${err} -> getbundelData`, 'get:/uploadImg//getbundelData/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }

})

router.get('/getmanifestData', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.query.id) }).toArray((err, resdata) => {
            try {
                if (err) {  res.send(err)
                }
                var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
                let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
                var vSplitData = (decrypted[0].manifestPath).split(process.env.baseUrl);
                if (os.type() == 'Windows_NT') {
                    let p = path.join(__dirname, `../${vSplitData[1]}`);
                    res.sendFile(p);
                } else {
                    let p = path.join(__dirname, `../uploads/assets/${vSplitData[1]}`);
                    res.sendFile(p);
                }
            } catch (err) {
                util.writeLog(`${err} -> getmanifestData`, 'get:/uploadImg//getmanifestData--data');
                var error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'An internal error occurred. Please try again later';
                res.send(error);
            }
        });
    } catch (err) {
        util.writeLog(`${err} -> getmanifestData`, 'get:/uploadImg//getmanifestData');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

router.get('/getmanifestData/:id', (req, res) => {
    
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.params.id) }).toArray((err, resdata) => {
            try {
                if (err) {  res.send(err)
                }
                var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
                let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
                var vSplitData = (decrypted[0].manifestPath).split(process.env.baseUrl);
                if (os.type() == 'Windows_NT') {
                    let p = path.join(__dirname, `../${vSplitData[1]}`);
                    res.sendFile(p);
                } else {
                    let p = path.join(__dirname, `../uploads/assets/${vSplitData[1]}`);
                    res.sendFile(p);
                }
            } catch (err) {
                console.log(err)
                util.writeLog(`${err} -> getmanifestData`, 'get:/uploadImg//getmanifestData/:id--data');
                var error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'An internal error occurred. Please try again later';
                res.send(error);
            }
        });
    } catch (err) {
        util.writeLog(`${err} -> getmanifestData`, 'get:/uploadImg//getmanifestData/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})

router.get('/getCableTypeData/:id', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.params.id) }).toArray((err, resdata) => {
            try {
                if (err) {  res.send(err)
                }
                var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
                let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
                var vSplitData = (decrypted[0].cabel_name_diff_head_path).split(process.env.baseUrl);
                if (os.type() == 'Windows_NT') {
                    let p = path.join(__dirname, `../${vSplitData[1]}`);
                    res.sendFile(p);
                } else {
                    let p = path.join(__dirname, `../uploads/assets/${vSplitData[1]}`);
                    res.sendFile(p);
                }
            } catch (err) {
                util.writeLog(`${err} -> getcabelData`, 'get:/uploadImg/cableTypeImagePath/:id-data');
                var error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'An internal error occurred. Please try again later';
                res.send(error);
            }
        });
    } catch (err) {
        util.writeLog(`${err} -> getcabelData`, 'get:/uploadImg//getcabelData/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})


router.get('/getcabelData/:id', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.params.id) }).toArray((err, resdata) => {
            try {
                if (err) {  res.send(err)
                }
                var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
                let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
                var vSplitData = (decrypted[0].cablePath).split(process.env.baseUrl);
                if (os.type() == 'Windows_NT') {
                    let p = path.join(__dirname, `../${vSplitData[1]}`);
                    res.sendFile(p);
                } else {
                    let p = path.join(__dirname, `../uploads/assets/${vSplitData[1]}`);
                    res.sendFile(p);
                }
            } catch (err) {
                util.writeLog(`${err} -> getcabelData`, 'get:/uploadImg//getcabelData/:id-data');
                var error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'An internal error occurred. Please try again later';
                res.send(error);
            }
        });
    } catch (err) {
        util.writeLog(`${err} -> getcabelData`, 'get:/uploadImg//getcabelData/:id');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})


router.get('/getcabelData', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.query.id) }).toArray((err, resdata) => {
            try {
                if (err) {
                    res.send(err)
                }
                var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
                let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
                var vSplitData = (decrypted[0].cablePath).split(process.env.baseUrl);
                if (os.type() == 'Windows_NT') {
                    let p = path.join(__dirname, `../${vSplitData[1]}`);
                    res.sendFile(p);
                } else {
                    let p = path.join(__dirname, `../uploads/assets/${vSplitData[1]}`);
                    res.sendFile(p);
                }
            } catch (err) {
                util.writeLog(`${err} -> getcabelData`, 'get:/uploadImg//getcabelData--data');
                var error = new Error();
                error.success = false;
                error.status = 404;
                error.message = 'An internal error occurred. Please try again later';
                res.send(error);
            }
        });
    } catch (err) {
        util.writeLog(`${err} -> getcabelData`, 'get:/uploadImg//getcabelData');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})


router.post('/configurationUniqId', (req, res) => {
    let db = global.db;
    try {
        db.collection('configurationUniqId').insertOne({ configurationStep: "1" }, (err, dataval) => {
            if (err) {
                res.send(err)
            }
            res.send(dataval.ops[0])
        })
    } catch (err) {
        util.writeLog(`${err} -> configurationUniqId`, 'post:/uploadImg//configurationUniqId');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'An internal error occurred. Please try again later';
        res.send(error);
    }
})



console.log("Platform: " + os.platform());
console.log("type: " + os.type());

module.exports = router