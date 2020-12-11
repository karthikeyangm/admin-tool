/**
 * UserModel module to perform users operations through User module ..
 * @module WEBGL Model
 * @see {@link Report}
 */
var ObjectID = require('mongodb').ObjectID;
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs')
var crypto = require('crypto');


exports.insertDataBasedonWebGl = (socket, collectionName, data) => {
  let db = global.db;


  var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
  let decrypted = JSON.parse(decipher.update(data.data, 'hex', 'utf8') + decipher.final('utf8'));
  var vSplitData = (decrypted[0].bundlePath).split(process.env.baseUrl);
  let pathvalue = path.join(__dirname, `../uploads/${vSplitData[1]}`);



  let filename = 'forgot.png'
  // let filename ='Archive.zip'
  let p = path.join(__dirname, `../uploads/sample/bundle/${filename}`);
  var data = '';
  // var file = fs.readFile(p, { encoding: 'utf8'})

  // var readStream = fs.createReadStream(p, { encoding: 'utf8'})
  // io.emit('addWebGlReportData', file);
  // readStream.on('data', function (chunk) {
  //     data += chunk;
  // }).on('end', function () {
  //     console.log("====data==")
  //     io.emit('addWebGlReportData', data);
  //     console.log("====data end==")
  //     // console.log(data);
  // });

  fs.readFile(p, function (err, buf) {
    // it's possible to embed binary data
    // within arbitrarily-complex objects
    // socket.emit('addWebGlReportData', {  buffer: buf });
    // let data=base64ArrayBuffer(buf)
    // console.log(data)
    let json = JSON.stringify(buf);
    var date = new Date();
    var fileName = "./logssss_" + date.getDate() + "-" + (date.getMonth() + 1) +
      "-" + date.getFullYear() + ".png";
    //   fs.appendFile(fileName, buf, function (err) {
    //     if (err) throw err;
    //     console.log('log Updated!');
    //  });
    socket.emit('addWebGlReportData', buf);
    // socket.emit('addWebGlReportData', { image:true, buffer: buf });
  })



  function base64ArrayBuffer(arrayBuffer) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
      d = chunk & 63               // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength]

      a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4 // 3   = 2^2 - 1

      base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

      a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2 // 15    = 2^4 - 1

      base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
  }


  // fs.readFile(p,'utf8', function (err, buf) {
  //     console.log(err)
  //     // it's possible to embed binary data
  //     // within arbitrarily-complex objects
  //     // console.log(buf)
  //     io.emit('addWebGlReportData', buf);
  //     console.log('image file is initialized');
  // })

  // var readStream = fs.createReadStream(path.resolve(__dirname, `../uploads/sample/bundle/${filename}`), {
  //     encoding: 'binary'
  // }), chunks = [];
  // readStream.on('readable', function () {
  //     console.log('Image loading');
  // });
  // readStream.on('data', function (chunk) {
  //     chunks.push(chunk);
  //     io.emit('img-chunk', chunk);
  // });
  // readStream.on('end', function () {
  //     console.log('Image loaded');
  // })




  // let db = global.db;
  // // return new Promise((resolve, reject) => {
  // const beginnerRangeValue = { min: Number(data.beginnerRange.min), max: Number(data.beginnerRange.max) }
  // const intermediateRangeValue = { min: Number(data.intermediateRange.min), max: Number(data.intermediateRange.max) }
  // const expertRangeValue = { min: Number(data.expertRange.min), max: Number(data.expertRange.max) }
  // let dataFormation = {}
  // dataFormation = {
  //     scenarioName: data.scenarioName,
  //     userName: data.userName,
  //     timeAllocatedValue: Number(data.timeAllocatedValue),
  //     timeTakenValue: Number(data.timeTakenValue),
  //     totalAttemptsCount: Number(data.totalAttemptsCount),
  //     beginnerRange: beginnerRangeValue,
  //     intermediateRange: intermediateRangeValue,
  //     expertRange: expertRangeValue,
  //     isSkillMeterTransition: data.isSkillMeterTransition,
  //     isBarTransition: data.isBarTransition,
  //     configCount: Number(data.attmeptsData.configCount),
  //     isAttemptsPanelTransition: data.isAttemptsPanelTransition
  // }
  // let vAttemptData = []
  // let warrningCount = 0
  // for (let i = 0; i < Number(data.attmeptsData.configCount); i++) {
  //     let dataextrastep = 0
  //     if (data.attmeptsData.extraSteps[i] !== undefined) {
  //         dataextrastep = data.attmeptsData.extraSteps[i]
  //         warrningCount += data.attmeptsData.extraSteps[i]
  //     }
  //     vAttemptData.push({
  //         step: `Configuration ${i + 1}`,
  //         timeTaken: Number(data.attmeptsData.timeTakenList[i]),
  //         attemptsCount: Number(data.attmeptsData.attemptsCountList[i]),
  //         extraSteps: Number(dataextrastep)
  //     })
  // }
  // dataFormation['AttemptsData'] = vAttemptData
  // dataFormation['warrningCount'] = warrningCount
  // db.collection(collectionName).deleteOne({ scenarioName: data.scenarioName, userName: data.userName })
  // db.collection(collectionName).insertOne(dataFormation, (err, dataval) => {
  //     if (err) {
  //         result = { 'success': false, 'message': 'Some Error', 'error': err };
  //         console.log(result);
  //     }
  //     else {

  //         db.collection('reports_History').insertOne(dataFormation, (err, dataval) => {
  //             if (err) {
  //                 result = { 'success': false, 'message': 'Some Error', 'error': err };
  //                 console.log(result);
  //             }
  //             else {
  //                 const result = { 'success': true, 'message': 'Report Added Successfully', dataval }
  //                 io.emit('addWebGlReportData', result);                    
  //             }
  //         })
  //     }
  // })
}

exports.getAssestBundle = (socket, io, data) => {
  var decipher = crypto.createDecipher(process.env.cryptoalgorithm, process.env.cryptokey);
  let decrypted = JSON.parse(decipher.update(data, 'hex', 'utf8') + decipher.final('utf8'));
  var vSplitData = (decrypted[0].bundlePath).split(process.env.baseUrl);
  let pathvalue = path.join(__dirname, `../uploads/${vSplitData[1]}`);
  fs.readFile(pathvalue, function (err, buf) {
    let json = JSON.stringify(buf);
    socket.emit('getAssestBundle', json);
  })
}

exports.getAssestBundle_type = (socket, io, data) => {
  socket.emit('getAssestBundle_type', data);
}

exports.setAssestBundle_details = (socket, io, data) => {
  let db = global.db;
  db.collection('assestdetails').find({ title: data }).toArray((err, res) => {

    var result;
    if (err) { result = [err] }
    if (res.length == 0) {
      result = [{
        message: "Asset not found."
      }]
    } else {
      result = [{
        _id: res[0]._id,
        title: res[0].title,
        type: res[0].type,
        bunndel_name: res[0].bunndel_name,
        bundlePath: res[0].bundlePath,
        cabel_name: res[0].cabel_name,
        cablePath: res[0].cablePath,
        manifest_name: res[0].manifest_name,
        asset_bundel_encrypt: res[0].asset_bundel_encrypt,
        asset_manifest_encrypt: res[0].asset_manifest_encrypt
      }]
    }
    socket.emit('getAssestBundle_details', result);
  })
}

/**
 * addEndUserResult model used to get the data from WEBGL component method to insert data in report collection based on scenario data.
 * @param  {string} collectionName Its show the collection name.
 * @param  {Object} data Its contain report data.
 */

exports.addEndUserResult = (io, collectionName, data) => {

  let db = global.db;
  if (data.scenarioName != null) {

    const beginnerRangeValue = { min: Number(data.biginnerRange.min), max: Number(data.biginnerRange.max) }
    const intermediateRangeValue = { min: Number(data.intermediateRange.min), max: Number(data.intermediateRange.max) }
    const expertRangeValue = { min: Number(data.expertRange.min), max: Number(data.expertRange.max) }
    let dataFormation = {}
    dataFormation = {
      scenarioName: data.scenarioName,
      userName: data.userName,
      userid: ObjectID(data.userId),
      scenarioId: ObjectID(data.scenarioId),
      timeAllocatedValue: Number(data.timeAllocatedValue),
      timeTakenValue: Number(data.timeTakenValue),
      totalAttemptsCount: Number(data.totalAttemptsCount),
      beginnerRange: beginnerRangeValue,
      intermediateRange: intermediateRangeValue,
      expertRange: expertRangeValue,
      // isSkillMeterTransition: data.isSkillMeterTransition,
      // isBarTransition: data.isBarTransition,
      configCount: Number(data.attemptData.configurationCount),
      // isAttemptsPanelTransition: data.isAttemptsPanelTransition
    }
    let vAttemptData = []
    let warrningCount = 0
    for (let i = 0; i < Number(data.attemptData.configurationCount); i++) {
      let dataextrastep = 0
      if (data.attemptData.extraSteps[i] !== undefined) {
        dataextrastep = data.attemptData.extraSteps[i]
        warrningCount += data.attemptData.extraSteps[i]
      }
      vAttemptData.push({
        step: `Configuration ${i + 1}`,
        timeTaken: Number(data.attemptData.timeTakenList[i]),
        attemptsCount: Number(data.attemptData.attemptsCountList[i]),
        extraSteps: Number(dataextrastep)
      })
    }
    dataFormation['AttemptsData'] = vAttemptData
    dataFormation['warrningCount'] = warrningCount
    dataFormation['updatedAt'] = new Date()
    let result;
    db.collection(collectionName).deleteOne({ userid: ObjectID(data.userId), scenarioId: ObjectID(data.scenarioId) })
    console.log(dataFormation)
    db.collection(collectionName).insertOne(dataFormation, (err, dataval) => {
      if (err) {
        result = { 'success': false, 'message': 'Some Error', 'error': err };
      }
      else {

        db.collection('reports_History').insertOne(dataFormation, (err, dataval_history) => {
          if (err) {
            result = { 'success': false, 'message': 'Some Error', 'error': err };
          }
          else {
            result = { 'success': true, 'message': 'Report Added Successfully' }
            console.log(result)
            io.emit('addEndUserResult_response', result);
          }
        })
      }
    })

  }
}



exports.setAllAssestList = (io, collectionName, data) => {
  console.log(data)
  let db = global.db;
  db.collection(collectionName).find({ type: data },
    {
      projection: {
        _id: 1, title: 1, type: 1, asset_Thumpnail_encrypt: 1,
        ViewMode: 1, InventoryItemKeyName: 1, ModelDetails: 1,
        asset_manifest_encrypt: 1, asset_bundel_encrypt: 1, asset_cabel_encrypt: 1
      }
    }).toArray((err, data) => {
      var result;
      if (err) { result = [err] }
      if (data.length == 0) {
        result = [{
          message: "Asset not found."
        }]
      } else {
        result = data
      }
      io.emit('getAllAssestList', result);
    })
}

exports.setCustomAssest = (io, collectionName, data1) => {
  var obj = JSON.parse(JSON.stringify(data1));
  var data = [];
  for (var i in obj) {
    data.push(obj[i]);
  }
  let db = global.db;
  db.collection(collectionName).find({ title: { $in: data } }, {
    projection: {
      _id: 1, title: 1, type: 1, asset_Thumpnail_encrypt: 1,
      InventoryItemKeyName: 1, ViewMode: 1, ModelDetails: 1,
      asset_manifest_encrypt: 1, asset_bundel_encrypt: 1, asset_cabel_encrypt: 1
    }
  }).toArray((err, data) => {
    var result;
    if (err) { result = [err] }
    if (data.length == 0) {
      result = [{
        message: "Asset not found."
      }]
    } else {
      result = data
    }
    io.emit('getCustomAssest', result);
  })
}

