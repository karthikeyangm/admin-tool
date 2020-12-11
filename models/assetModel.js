
/**
 * AssetModel module to perform Asset operations through Asset module ..
 * @module Asset Model
 * @see {@link Assetmanage}
 */
var ObjectID = require('mongodb').ObjectID;
var crypto = require('crypto');

module.exports = {
    /**
       * getAllassetCategory method used to retrive the all asset.
       * @param  {string} collectionName Its show the collection name.
       * @return {Object} Its return all asset data.
       */
    getAllassetCategory: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find().sort({title:1}).toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            });
        })
    },
        /**
       * getAllassetViewMode method used to retrive the all asset ViewMode.
       * @param  {string} collectionName Its show the collection name.
       * @return {Object} Its return all asset data.
       */
      getAllassetViewMode: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find().toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            });
        })
    },
        /**
       * getAllassetInventoryItemKeyName method used to retrive the all asset InventoryItemKeyName.
       * @param  {string} collectionName Its show the collection name.
       * @return {Object} Its return all asset data.
       */
      getAllassetInventoryItemKeyName: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find(data).toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            });
        })
    },
        /**
       * getAllassetModelDetails method used to retrive the all asset ModelDetails.
       * @param  {string} collectionName Its show the collection name.
       * @return {Object} Its return all asset data.
       */
      getAllassetModelDetails: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find(data).toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            });
        })
    },

    /**
       * CreateAsset method used to create asset in db.
       * @param  {string} collectionName Its show the collection name.
       * @param  {string} data Its contain the asset data for insertion.
       * @return {Object} Its return success or failure message based on insertion.
       */

    CreateAsset: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).insertOne(data, (err, dataval) => {
                if (err) { reject(err) }
                else {
                    var dataenc = dataval.ops
                    console.log(dataval.ops)
                    encryptData()
                    function encryptData() {
                        var cipher = crypto.createCipher(process.env.cryptoalgorithm, process.env.cryptokey);
                        var encrypted = cipher.update(JSON.stringify(dataenc), 'utf8', 'hex') + cipher.final('hex');
                        const dataCheck = (encrypted.toString()).includes('/');

                        if (dataCheck) {
                            encryptData()
                        } else {
                            let updateData = {
                                asset_Thumpnail_encrypt: process.env.baseUrl + 'uploadImg/getthumbnailData/' + dataval.ops[0]._id,
                                asset_bundel_encrypt: process.env.baseUrl + 'uploadImg/getbundelData/' + dataval.ops[0]._id,
                                asset_manifest_encrypt: process.env.baseUrl + 'uploadImg/getmanifestData/' + dataval.ops[0]._id,
                                asset_encrypt: encrypted
                            }
                            if (data.cabel_name != null) {
                                updateData = {
                                    asset_Thumpnail_encrypt: process.env.baseUrl + 'uploadImg/getthumbnailData/' + dataval.ops[0]._id,
                                    asset_bundel_encrypt: process.env.baseUrl + 'uploadImg/getbundelData/' + dataval.ops[0]._id,
                                    asset_manifest_encrypt: process.env.baseUrl + 'uploadImg/getmanifestData/' + dataval.ops[0]._id,
                                    asset_cabel_encrypt: process.env.baseUrl + 'uploadImg/getcabelData/' + dataval.ops[0]._id,
                                    asset_encrypt: encrypted
                                }
                            }
                            db.collection(collectionName).updateMany({ _id: ObjectID(dataval.ops[0]._id) }, {
                                $set: updateData
                            }, {
                                safe: true
                            }, (err, res) => {
                                if (err) {
                                    reject(err)
                                }
                                let result = {
                                    success: true,
                                    status: 200,
                                    message: "Asset created successful!",
                                    dataValue: dataval.ops
                                }
                                resolve(result)
                            })
                        }
                    }
                }
            })
        })
    },
    /**
       * getSingleAsset method used to retrive the all asset.
       * @param  {string} collectionName Its show the collection name.
       * @param  {string} id Its contain specific asset id.
       * @return {Object} Its return specific asset data.
       */
    getSingleAsset: (collectionName, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        message: "Asset not found."
                    }
                    resolve(result)
                } else {
                    resolve(res)
                }
            })
        })
    },
    updateasset: (collectionName, data, id) => {
        
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).updateMany({ _id: ObjectID(id) }, {
                $set: data
            }, {
                safe: true
            }, (err, res) => {
                if (err) {
                    reject(err)
                }
                let newData = data
                newData['_id'] = id
                var dataenc =[newData]
                    encryptData()
                    function encryptData() {
                        console.log(id)
                        var cipher = crypto.createCipher(process.env.cryptoalgorithm, process.env.cryptokey);
                        var encrypted = cipher.update(JSON.stringify(dataenc), 'utf8', 'hex') + cipher.final('hex');
                        const dataCheck = (encrypted.toString()).includes('/');

                        if (dataCheck) {
                            encryptData()
                        } else {
                            let updateData = {
                                asset_Thumpnail_encrypt: process.env.baseUrl + 'uploadImg/getthumbnailData/' + id,
                                asset_bundel_encrypt: process.env.baseUrl + 'uploadImg/getbundelData/' + id,
                                asset_manifest_encrypt: process.env.baseUrl + 'uploadImg/getmanifestData/' + id,
                                asset_encrypt: encrypted
                            }
                            if (data.cabel_name != null) {
                                updateData = {
                                    asset_Thumpnail_encrypt: process.env.baseUrl + 'uploadImg/getthumbnailData/' + id,
                                    asset_bundel_encrypt: process.env.baseUrl + 'uploadImg/getbundelData/' + id,
                                    asset_manifest_encrypt: process.env.baseUrl + 'uploadImg/getmanifestData/' + id,
                                    asset_cabel_encrypt: process.env.baseUrl + 'uploadImg/getcabelData/' + id,
                                    asset_encrypt: encrypted
                                }
                            }
                            db.collection(collectionName).updateMany({ _id: ObjectID(id) }, {
                                $set: updateData
                            }, {
                                safe: true
                            }, (err, res) => {
                                if (err) {
                                    reject(err)
                                }
                                let result = {
                                    success: true,
                                    status: 200,
                                    message: "Asset update successful!"
                                }
                                resolve(result)
                            })
                        }
                    }
                // let result = {
                //     success: true,
                //     status: 200,
                //     message: "Asset update successful!"
                // }
                // resolve(result)
            })
        })
    }




}


