/**
 * forgotModel to perform forgot operations through forgot module ..
 * @module forgot Model
 * @see {@link forgot}
 */
var ObjectID = require('mongodb').ObjectID;
var CryptoJS = require("crypto-js");
var encryptSecretKey = 'emailvalidate'
var crypto = require('crypto');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = '789456123';

module.exports = {

    /**
    * In CreateUserScenarioGroup method to create record in grouping collection After that creation to insert gcreated id in scenario and user 
    * collection based on selected scenarios and selected users.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} data Its contains all group data.
    * @return {Object} Its return success or failure message based on data insertion.
    */

    createEncryptUrl: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            try {
                let vEmailid = data
                db.collection(collectionName).find({ username: vEmailid }).toArray((err, res) => {
                    if (err) {
                        reject(err)
                    }
                    if (res.length > 0) {
                        var userData = res
                        var tenantId_data = Math.floor(Math.random() * 90000) + 10000
                        var dataenc = [{
                            email: res[0].email,
                            tenantName: res[0].tenantName,
                            tenant_randomChar: tenantId_data
                        }]
                        encryptData()
                        function encryptData() {
                            var cipher = crypto.createCipher(algorithm, key);
                            var encrypted = cipher.update(JSON.stringify(dataenc), 'utf8', 'hex') + cipher.final('hex');
                            const dataCheck = (encrypted.toString()).includes('/');
                            if (dataCheck) {
                                encryptData()
                            } else {
                                db.collection(collectionName).updateOne({ username: vEmailid }, {
                                    $set: {
                                        resetToken: encrypted,
                                        user_randomChar: tenantId_data,
                                        forgot_verified: true,
                                        forgotLink_verified: 0
                                    }
                                }, (err, res) => {
                                    if (err) {
                                        reject(err)
                                    }
                                    let result = {
                                        success: true,
                                        status: 200,
                                        data: userData,
                                        encryptDataValue: encrypted
                                    }
                                    resolve(result)
                                })
                            }
                        }
                    } else {
                        let result = {
                            success: false,
                            status: 404,
                            message: 'User email not found'
                        }
                        resolve(result)
                    }
                });
            } catch (err) {
                reject(err)
            }
        })

    },

    /**
    * validateId method used to identify the user is valid or not.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} data Its contains user data.
    * @return {Object} Its return success or failure message based on data.
    */

    validateId: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            try {

                var decipher = crypto.createDecipher(algorithm, key);
                let decrypted = JSON.parse(decipher.update(data.id, 'hex', 'utf8') + decipher.final('utf8'));
                db.collection(collectionName).find({
                    email: decrypted[0].email,
                    resetToken: data.id, forgot_verified: true, user_randomChar: decrypted[0].tenant_randomChar
                }).toArray((err, datavalue) => {
                    if (err) {
                        reject(err)
                    }
                    db.collection(collectionName).updateOne({
                        email: decrypted[0].email,
                        resetToken: data.id, forgot_verified: true, user_randomChar: decrypted[0].tenant_randomChar, forgotLink_verified: 0
                    }, {
                        $set: {
                            resetToken: null,
                            user_randomChar: null,
                            forgot_verified: false,
                            forgotLink_verified: 1
                        }
                    }, (err, res) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(datavalue)
                    })
                    // resolve(datavalue)

                })
            } catch (err) {
                reject(err)
            }
        })
    },

    /**
    * updatePassword method used to update the user passsword.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} data Its contains user data.
    * @return {Object} Its return success or failure message based on data.
    */


    updatePassword: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).updateOne({ email: data.email, forgotLink_verified: 1 }, {
                $set: {
                    password: data.password,
                    forgotLink_verified: 0
                }
            }, (err, res) => {
                if (err) {
                    reject(err)
                }
                let result = {
                    success: true,
                    status: 200,
                    message: 'Password Updated Successfull'
                }
                resolve(result)
            })
        })
    },

    /**
    * changePasswordFirstLogin method used to update the user passsword on first time login.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} data Its contains user data.
    * @return {Object} Its return success or failure message based on data.
    */


    changePasswordFirstLogin: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).updateOne({ email: data.email, firstLogin: 1 }, {
                $set: {
                    password: data.password,
                    firstLogin: 0
                }
            }, (err, res) => {
                if (err) {
                    reject(err)
                }
                let result = {
                    success: true,
                    status: 200,
                    message: 'Password Updated Successfully.'
                }
                resolve(result)
            })
        })
    },

    /**
     * profilePasswordUpdate method used to update the user profile passsword.
     * @param  {string} collectionName Its show the collection name.
     * @param  {string} data Its contains user data.
     * @return {Object} Its return success or failure message based on data.
     */



    profilePasswordUpdate: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).updateOne({ email: data.email }, {
                $set: {
                    password: data.password
                }
            }, (err, res) => {
                if (err) {
                    reject(err)
                }
                let result = {
                    success: true,
                    status: 200,
                    message: 'Password Updated Successfull'
                }
                resolve(result)
            })
        })
    }


}