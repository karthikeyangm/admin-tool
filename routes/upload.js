
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
/**
 * Its contains the details of uploa0ding destination and renaming process
 * @type {Function}
 */
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let type = req.query.tenantDeatails
        let typePath = req.query.type
        let path = `./uploads/${type}/${typePath}`;
        // cb(null, 'uploads')
        fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: function (req, file, cb) {
        // const vName = file.originalname.split('.')
        if(req.query.type == 'uploadcommand'){
            cb(null, file.originalname + '-' + Date.now() + '.' + vName[vName.length - 1])
        }else{
            cb(null, file.originalname)    
        }
        cb(null, file.originalname)// + '-' + Date.now() + '.' + vName[vName.length - 1])
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
        console.log(file)
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == 'application/octet-stream') {
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
            var ret = (file.path).replace('uploads/', '');
            file['path'] = process.env.baseUrl + ret
        }
        res.status(200).send(file);
        // res.send(file)
    }

})


router.get('/getThumpnailImg/:id', (req, res) => {
    var TenantDetail = req.headers.tendetail
    var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
    let decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));
    let p = path.join(__dirname, `../uploads/${decrypted[0].tenantname}/thumbnail/${req.params.id}`);
    res.sendFile(p);
})

router.get('/getThumpnailImg', (req, res) => {
    var TenantDetail = req.headers.tendetail
    var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
    let decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));
    let p = path.join(__dirname, `../uploads/${decrypted[0].tenantname}/thumbnail/${req.query.id}`);
    res.sendFile(p);
})


router.get('/getbundle', (req, res) => {
    let filename = 'cubetest.unity3d'
    let p = path.join(__dirname, `../uploads/sample/bundle/${filename}`);
    res.sendFile(p);
    // res.download(p);
})
router.get('/getmanifest', (req, res) => {
    let filename = 'cubetest.unity3d.manifest'
    if (os.type() == 'Windows_NT') {
        let p = path.join(__dirname, `../sample/bundle/${filename}`);
        res.sendFile(p);
    } else {
        let p = path.join(__dirname, `../uploads/sample/bundle/${filename}`);
        res.sendFile(p);
    }
})


router.get('/getthumbnailData', (req, res) => {
    var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
    let decrypted = JSON.parse(decipher.update(req.query.id, 'hex', 'utf8') + decipher.final('utf8'));
    var vSplitData = (decrypted[0].thumbnailImgPath).split(process.env.baseUrl);
    if (os.type() == 'Windows_NT') {
        let p = path.join(__dirname, `../${vSplitData[1]}`);
        res.sendFile(p);
    } else {
        let p = path.join(__dirname, `../uploads/${vSplitData[1]}`);
        res.sendFile(p);
    }

})

router.get('/getthumbnailData/:id', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.params.id) }).toArray((err, resdata) => {
            if (err) {
                console.log(err)
            }
            var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
            let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
            var vSplitData = (decrypted[0].thumbnailImgPath).split(process.env.baseUrl);
            if (os.type() == 'Windows_NT') {
                let p = path.join(__dirname, `../${vSplitData[1]}`);
                res.sendFile(p);
            } else {
                let p = path.join(__dirname, `../uploads/${vSplitData[1]}`);
                res.sendFile(p);
            }
        });
    } catch (e) {
        console.log(e)
    }
})

router.get('/getbundelData', (req, res) => {
    let db = global.db;
    console.log(req.query.id)
    let queryStrValue = (req.query.id).includes("?")
    var valueData = ''
    if (queryStrValue) {
        valueData = (req.query.id).split('?')[0]
    } else {
        valueData = req.query.id
    }
    console.log(valueData)
    try {
        db.collection('assestdetails').find({ _id: ObjectID(valueData) }).toArray((err, resdata) => {
            if (err) {
                console.log(err)
            }
            var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
            let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
            var vSplitData = (decrypted[0].bundlePath).split(process.env.baseUrl);
            if (os.type() == 'Windows_NT') {
                let p = path.join(__dirname, `../${vSplitData[1]}`);
                res.sendFile(p);
            } else {
                let p = path.join(__dirname, `../uploads/${vSplitData[1]}`);
                res.sendFile(p);
            }
        });

    } catch (e) {
        console.log(e)
    }
})
router.get('/getbundelData/:id', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.params.id) }).toArray((err, resdata) => {
            if (err) {
                console.log(err)
            }
            var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
            let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
            var vSplitData = (decrypted[0].bundlePath).split(process.env.baseUrl);
            if (os.type() == 'Windows_NT') {
                let p = path.join(__dirname, `../${vSplitData[1]}`);
                res.sendFile(p);
            } else {
                let p = path.join(__dirname, `../uploads/${vSplitData[1]}`);
                res.sendFile(p);
            }


        });

    } catch (e) {
        console.log(e)
    }

})
router.get('/getmanifestData', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.query.id) }).toArray((err, resdata) => {
            console.log("==============")
            if (err) {
                console.log(err)
            }
            var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
            let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
            console.log(req.query.id)
            var vSplitData = (decrypted[0].manifestPath).split(process.env.baseUrl);
            console.log(vSplitData)
            if (os.type() == 'Windows_NT') {
                let p = path.join(__dirname, `../${vSplitData[1]}`);
                res.sendFile(p);
            } else {
                let p = path.join(__dirname, `../uploads/${vSplitData[1]}`);
                res.sendFile(p);
            }
        });
    } catch (e) {
        console.log(e)
    }
})
router.get('/getmanifestData/:id', (req, res) => {
    let db = global.db;
    try {
        console.log(req.params.id)
        db.collection('assestdetails').find({ _id: ObjectID(req.params.id) }).toArray((err, resdata) => {
            if (err) {
                console.log(err)
            }
            var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
            let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
            console.log(req.query.id)
            var vSplitData = (decrypted[0].manifestPath).split(process.env.baseUrl);
            console.log(vSplitData)
            if (os.type() == 'Windows_NT') {
                let p = path.join(__dirname, `../${vSplitData[1]}`);
                res.sendFile(p);
            } else {
                let p = path.join(__dirname, `../uploads/${vSplitData[1]}`);
                res.sendFile(p);
            }
        });
    } catch (e) {
        console.log(e)
    }
})



router.get('/getcabelData/:id', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.params.id) }).toArray((err, resdata) => {
            if (err) {
                console.log(err)
            }
            var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
            let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
            console.log(req.query.id)
            var vSplitData = (decrypted[0].cablePath).split(process.env.baseUrl);
            console.log(vSplitData)
            if (os.type() == 'Windows_NT') {
                let p = path.join(__dirname, `../${vSplitData[1]}`);
                res.sendFile(p);
            } else {
                let p = path.join(__dirname, `../uploads/${vSplitData[1]}`);
                res.sendFile(p);
            }


        });
    } catch (e) {
        console.log(e)
    }
})


router.get('/getcabelData', (req, res) => {
    let db = global.db;
    try {
        db.collection('assestdetails').find({ _id: ObjectID(req.query.id) }).toArray((err, resdata) => {
            if (err) {
                console.log(err)
            }
            var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
            let decrypted = JSON.parse(decipher.update(resdata[0].asset_encrypt, 'hex', 'utf8') + decipher.final('utf8'));
            console.log(req.query.id)
            var vSplitData = (decrypted[0].cablePath).split(process.env.baseUrl);
            console.log(vSplitData)
            if (os.type() == 'Windows_NT') {
                let p = path.join(__dirname, `../${vSplitData[1]}`);
                res.sendFile(p);
            } else {
                let p = path.join(__dirname, `../uploads/${vSplitData[1]}`);
                res.sendFile(p);
            }
        });
    } catch (e) {
        console.log(e)
    }

})

console.log("Platform: " + os.platform());
console.log("type: " + os.type());

module.exports = router