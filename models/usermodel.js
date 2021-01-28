
/**
 * UserModel module to perform users operations through User module ..
 * @module User Model
 * @see {@link User}
 */

var ObjectID = require('mongodb').ObjectID;
var admin = require('../models/adminModel');
var tenantModel = require('../models/TenantModel')
var SubscribersDetails_model = require('../models/subscribersModel')
var salt = '1234567890'; // default salt
var crypto = require('crypto');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = '789456123';
module.exports = {
    /**
     * * In create user method first we check the user limit of particular tenant in <b> User </b> & <b> config </b> collections.<br>
     * * The limit is not exceed we insert the data in <b> user </b> collection with find method of username to avoid duplication.<br>
     * * In user insertion we give reference id of that created user in <b> groupinfo </b> collection for the user groups details.<br>
     * * After Tenant based user updation count will be increased in Super Admin Collection based on that Tenant.
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data Its contain user data.
     */
    createUser: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            // db.collection(collectionName).find().toArray((err, totalUser) => {
                // if (err) {
                //     reject(err)
                // }
                // db.collection('config').find({ "userlimit": { $gte: (totalUser.length - 1) } }).toArray((err, len) => {
                    // if (err) {
                    //     reject(err)
                    // }
                    // if (len.length > 0) {
                        db.collection(collectionName).find({ username: data.username }).toArray((err, res) => {
                            if (err) { reject(err) }
                            if (res.length == 0) {
                                db.collection(collectionName).insertOne(data, (err, dataval) => {
                                    if (err) { reject(err) }
                                    else {
                                        if (data.role !== '1') {
                                            updateGroupUserDetails(data, dataval.ops[0]._id)
                                            async function updateGroupUserDetails(data, id) {
                                                let db = global.db;
                                                await db.collection('groupinfo').updateMany({ userIds: { $in: [ObjectID(id)] } }, {
                                                    $pull: { userIds: ObjectID(id) }
                                                }, (err, res) => {
                                                    if (err) { reject(err) }
                                                    for (let aa = 0; aa < data.SelectedGroup.length; aa++) {
                                                        db.collection('groupinfo').updateMany({ _id: { $in: [ObjectID(data.SelectedGroup[aa])] } }, {
                                                            $push: { userIds: ObjectID(id) }
                                                        }, (err, res) => {
                                                            if (err) { reject(err); }
                                                            let result = {
                                                                success: true,
                                                                status: 200,
                                                                message: "User created successful!",
                                                                data: dataval.ops[0]
                                                            }
                                                            if (aa + 1 == data.SelectedGroup.length) {
                                                                db.collection('TenantDetails').updateOne({ "TenantId": data.TenantId, tenantName: data.tenantName },
                                                                    { $inc: { userAdded: 1 } }, (err, value) => {
                                                                        if (err) { reject(err); }
                                                                        resolve(result)
                                                                    })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        } else {
                                            db.collection('TenantDetails').updateOne({ "TenantId": data.TenantId, tenantName: data.tenantName },
                                                { $inc: { userAdded: 1 } }, (err, value) => {
                                                    if (err) { reject(err); }
                                                    db.collection('TenantDetails').updateOne({ "TenantId": data.TenantId, tenantName: data.tenantName },
                                                        { $inc: { userAdmin: 1 } }, (err, value) => {
                                                            if (err) { reject(err); }
                                                            let result = {
                                                                success: true,
                                                                status: 200,
                                                                message: "User created successful!"
                                                            }
                                                            resolve(result)
                                                        })
                                                })
                                        }
                                    }
                                })
                            } else {
                                const result = {
                                    success: false,
                                    status: 403,
                                    message: "Email already added."
                                }
                                resolve(result)
                            }
                        })
                    // } else {
                    //     let result = {
                    //         success: false,
                    //         status: 403,
                    //         message: "User limit exits."
                    //     }
                    //     resolve(result)
                    // }
                // })
            // })

        })
    },

    /**
     * * In updation to update user detail and user groups detail in <b> Users </b> & <b> gruopinfo </b> collection.<br>
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data Its contain user data.
     * @param  {string} id to find which user we want to update.
     */
    updateUser: (collectionName, data, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        success: false,
                        status: 403,
                        message: "User not found."
                    }
                    resolve(result)
                } else {
                    db.collection(collectionName).updateMany({ _id: ObjectID(id) }, {
                        $set: data
                    }, {
                        safe: true
                    }, (err, res) => {
                        if (err) { reject(err) }
                        else {
                            if (data.role !== '1') {
                                updateGroupUserDetails(data, id)
                                async function updateGroupUserDetails(data, id) {
                                    let db = global.db;
                                    await db.collection('groupinfo').updateMany({ userIds: { $in: [ObjectID(id)] } }, {
                                        $pull: { userIds: ObjectID(id) }
                                    }, (err, res) => {
                                        if (err) { reject(err) }
                                        for (let aa = 0; aa < data.SelectedGroup.length; aa++) {

                                            db.collection('groupinfo').updateMany({ _id: { $in: [ObjectID(data.SelectedGroup[aa])] } }, {
                                                $push: { userIds: ObjectID(id) }
                                            }, (err, res) => {
                                                if (err) { reject(err); }
                                                let result = {
                                                    success: true,
                                                    status: 200,
                                                    message: "Successfully Updated!"
                                                }
                                                if (aa + 1 == data.SelectedGroup.length)
                                                    resolve(result)
                                            })
                                        }
                                    })
                                }
                            } else {
                                let result = {
                                    success: true,
                                    status: 200,
                                    message: "Successfully Updated!"
                                }
                                resolve(result)
                            }

                        }

                    })
                }
            })
        })
    },

    /**
     * * getSingleUser method used to retrive the specific user based on user id.
     * @param  {string} collectionName Its show the collection name.
     * @param  {string} id to find which user we want to get.
     */
    getSingleUser: (collectionName, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        message: "User not found."
                    }
                    resolve(result)
                } else {
                    resolve(res)
                }
            })
        })
    },

    /**
     * * In Deletion method we delete the user details in user & groupinfo colletion based on userid.<br>
     * * After that we  decreased user count in Super Admin Collection based on that Tenant.
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data Its contain user data to delete based on tenantname.
     */
    deleteUser: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(data.id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        success: false,
                        status: 403,
                        message: "User not found."
                    }
                    resolve(result)
                } else {
                    db.collection(collectionName).deleteOne({ _id: ObjectID(data.id) }, (err, res) => {
                        if (err) {
                            reject(err)
                        }
                        else {
                            db.collection('groupinfo').updateMany({ userIds: { $in: [ObjectID(data.id)] } }, {
                                $pull: { userIds: ObjectID(data.id) }
                            }, (err, res) => {
                                if (err) {
                                    reject(err)
                                }

                                db.collection('TenantDetails').updateOne({ "TenantId": data.TenantId, tenantName: data.tenantName },
                                    { $inc: { userAdded: -1 } }, (err, value) => {
                                        if (err) { reject(err); }
                                        let result = {
                                            success: true,
                                            status: 200,
                                            message: "User Deleted successfully!."
                                        }
                                        resolve(result)
                                    })
                            })
                        }
                    })
                }
            })
        })
    },

    /**
     * * In retrieveAllUsers method to get all user records in users colletion.<br>
     * * To get superAdmin false record. Because superAdmin true record is hidden user for super admin access.
     * @param  {string} collectionName Its show the collection name.
     */
    retrieveAllUsers: (collectionName, userLimit) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ "superAdmin": { $ne: true } }).sort({ firstname: 1 }).toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res);
            });


        })
    },

    /**
     * * In retrieveAllUsers method to get user records based on pagination count in users colletion.<br>
     * * To get superAdmin false record. Because  what are thr records contain  superAdmin is true which are hidden users for super admin access.
     * @param  {string} collectionName Its show the collection name.
     * @param  {Number} userLimit Its containt user limit.
     */
    retrieveAllUsers_Limit: (collectionName, userLimit) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            let query = { "superAdmin": { $ne: true } }
            if (userLimit.search_filter) {
                query = {
                    "superAdmin": { $ne: true },
                    firstname: {
                        '$regex': new RegExp("^" + userLimit.searchValue, "i")
                        // '$regex': userLimit.searchValue
                    }
                }
            }
            db.collection(collectionName).find(query).skip(parseInt(userLimit.start_user)).
                limit(parseInt(userLimit.end_user)).sort({ firstname: 1 }).toArray((err, res) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(res);
                });
        })
    },

    /**
     * * Check user have the acces for the specific senarios.<br>
     * * To get superAdmin false record. Because  what are thr records contain  superAdmin is true which are hidden users for super admin access.
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data Its contain user deails to verify user have the access of particullar scenario.
     */
    CheckScenarioForUser: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({
                "userIds": { $in: [ObjectID(data.userid)] },
                "scenarioIds": { $in: [ObjectID(data.ScenarioId)] }
            }).toArray(function (err, res) {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(res);
                }

            })
        })
    },

    /**
     * * Check user have the acces the application.<br>
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data Its contain user deails to verify user credentials or valid or not.
     * @return {Object} Its return Login is success or failure message with user data.
     */
    validateUser: function (collectionName, data) {
        let db = global.db;
        return new Promise((resolve, reject) => {

            // console.log({
            //     $regex: new RegExp(data.username, "i")
            // });
            // username : { $regex : new RegExp(data.username, "ig") },
            var query = {
                // username: new RegExp('^' + data.username.trim() + '$', 'i'),
                username: data.username,
                password: data.password
            };
            if (data.superAdmin) {
                admin.find(query, { password: 0, username: 0 }, function (err, res) {
                    if (!err) {
                        let result = {
                            success: true,
                            status: 200,
                            message: 'Login Success!',
                            response: res
                        }
                        resolve(result);
                    }
                    else {
                        reject(err)
                    }
                });
            } else {
                // db.collection('config').find({       // subscription based
                //     SubscriptionStartDate: { $lte: new Date() },
                //     SubscriptionEndDate: { $gte: new Date() }
                // }).toArray((err, dataValue) => {
                //     if (err) {
                //         reject(err)
                //     }
                // if (dataValue.length > 0) {
                db.collection(collectionName).find(query, { password: 0, username: 0 }).toArray(function (err, res) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        if (res.length > 0) {
                            delete res[0]['password'];
                            delete res[0]['username'];
                        }
                        let result = {
                            success: true,
                            status: 200,
                            message: 'Login Success!',
                            response: res
                        }
                        resolve(result);
                    }
                });
                // } else {
                //     reject(err)
                // }
                // })
            }
        })
    },

    /**
     * * Check the exccell upload data to verify the validations.<br>
     * * Once the validation success the user data added in to user collection.<br>
     * * After that To get _id in user collection to push id in grouping collection in defalut record.
     * * After increase the user count in Tenant Master bassed on tenant.
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data Its contain user deails to verify user credentials or valid or not.
     * @return {Object} Its return Login is success or failure message with user data.
     */

    excellUploadValidation: (collectionName, data, req) => {
        return new Promise((resolve, reject) => {
            let db = global.db;
            // var TotalExcelldata = data;

            var TenantDetail = ""
            if (req.query.tendetail == undefined) {
                TenantDetail = req.headers.tendetail
            } else {
                TenantDetail = req.query.tendetail
            }

            var decipher = crypto.createDecipher(algorithm, key);
           let decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));


            // db.collection(collectionName).find().toArray((err, totalUser) => {
                // if (err) {
                //     reject(err)
                // }
                // let TotalData = totalUser.length + TotalExcelldata.length
                // db.collection('config').find({ "userlimit": { $gte: (TotalData) } }).toArray((err, len) => {
                    // if (err) {
                    //     reject(err)
                    // }
                    // if (len.length > 0) {
                        db.collection('groupinfo').find({ "groupname": "Default" }).toArray((err, grouplen) => {
                            if (err) {
                                reject(err)
                            }
                            if (grouplen.length > 0) {
                                (async function () {
                                    let isvalidBool = true
                                    var isValidNumber;
                                    var vMobileLen;
                                    var vPasswordLen;
                                    var validExcellData = []
                                    try {
                                        for await (let val of data) {
                                            if (val.Firstname == undefined) {
                                                isvalidBool = false
                                                break;
                                            }
                                            if (val.Lastname == undefined) {
                                                isvalidBool = false
                                                break;
                                            }
                                            if (val.EMail == undefined) {
                                                isvalidBool = false
                                                break;
                                            }
                                            if (val.MobileNumber == undefined) {
                                                isvalidBool = false
                                                break;
                                            }
                                            if (val.Password == undefined) {
                                                isvalidBool = false
                                                break;
                                            }

                                            isValidNumber = isNumeric(val.MobileNumber)
                                            vMobileLen = (val.MobileNumber).toString().length

                                            vPasswordLen = (val.Password).toString().length
                                            const validateEmail = (email) => {
                                                const re = /\S+@\S+\.\S+/;
                                                // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                                return re.test(email.toLowerCase());
                                            }

                                            const validatepassword = (Password) => {
                                                const re = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
                                                return re.test(Password);
                                            }

                                            if (!validateEmail(val.EMail)) {
                                                isvalidBool = false
                                                break;
                                            }
                                            if (!validatepassword(val.Password)) {
                                                isvalidBool = false
                                                break;
                                            }


                                            if (vMobileLen != 10) {
                                                isvalidBool = false
                                                break;
                                            }
                                            if (vPasswordLen < 8 && vPasswordLen > 35) {
                                                isvalidBool = false
                                                break;
                                            }

                                            if (!isValidNumber) {
                                                isvalidBool = false
                                                break;
                                            }
                                            let validExcellObj = {}
                                            var hash = crypto.pbkdf2Sync(val.Password, salt, 1000, 24, 'sha512');
                                            validExcellObj['firstname'] = val.Firstname
                                            validExcellObj['lastname'] = val.Lastname
                                            validExcellObj['mobile'] = (val.MobileNumber).toString()
                                            validExcellObj['username'] = val.EMail
                                            validExcellObj['email'] = val.EMail
                                            validExcellObj['role'] = "2"
                                            validExcellObj['password'] = (Buffer.from(hash).toString('hex'))
                                            validExcellObj['createdAt'] = new Date()
                                            validExcellObj['updatedAt'] = new Date()
                                            validExcellObj['status'] = 'Active'
                                            validExcellObj['excellUploaded'] = 1
                                            validExcellObj['SelectedGroup'] = [ObjectID(grouplen[0]._id)]

                                            validExcellObj["superAdmin"] = false
                                            validExcellObj["TenantId"] = decrypted[0].tenantId
                                            validExcellObj['tenantName'] = decrypted[0].tenantname
                                            validExcellObj['userRegisterd'] = 0
                                            validExcellObj['emailVerified'] = 0
                                            validExcellObj['firstLogin'] = 1

                                            validExcellData.push(validExcellObj)
                                        }
                                        if (!isvalidBool) {
                                            let result = {
                                                success: false,
                                                status: 403,
                                                message: "Not Valid"
                                            }
                                            resolve(result)
                                        } else {

                                            var TenantDetail = ""
                                            if (req.query.tendetail == undefined) {
                                                TenantDetail = req.headers.tendetail
                                            } else {
                                                TenantDetail = req.query.tendetail
                                            }

                                            var decipher = crypto.createDecipher(algorithm, key);
                                            decrypted = JSON.parse(decipher.update(TenantDetail, 'hex', 'utf8') + decipher.final('utf8'));

                                            InsertGroup_AdminCount(validExcellData, reject, resolve, decrypted, grouplen, 0)
                                            function InsertGroup_AdminCount(validExcellData, reject, resolve, decrypted, grouplen, loop) {
                                                db.collection('users').find({ username: validExcellData[loop].username }).toArray((err, resdata) => {
                                                    if (err) {
                                                        reject(err)
                                                    }
                                                    if (resdata.length == 0) {
                                                        db.collection('users').insertOne(validExcellData[loop], (err, dataval) => {
                                                            if (err) {
                                                                reject(err)
                                                            }
                                                            db.collection('groupinfo').updateMany({ _id: grouplen[0]._id }, {
                                                                $push: { userIds: ObjectID(dataval.ops[0]._id) }
                                                            }, (err, resval) => {
                                                                if (err) { reject(err); }
                                                                db.collection('TenantDetails').updateOne({ "TenantId": decrypted[0].tenantId, tenantName: decrypted[0].tenantname },
                                                                    { $inc: { userAdded: 1 } }, (err, value) => {
                                                                        if (err) { reject(err); }
                                                                        loop++
                                                                        if ((loop + 1) <= validExcellData.length) {
                                                                            InsertGroup_AdminCount(validExcellData, reject, resolve, decrypted, grouplen, loop)
                                                                        }

                                                                        if (loop == validExcellData.length) {
                                                                            let result = {
                                                                                success: true,
                                                                                status: 200,
                                                                                message: "Valid"
                                                                            }
                                                                            resolve(result)
                                                                        }

                                                                    })
                                                            })
                                                        })
                                                    } else {
                                                        loop++
                                                        if ((loop + 1) <= validExcellData.length) {
                                                            InsertGroup_AdminCount(validExcellData, reject, resolve, decrypted, grouplen, loop)
                                                        }
                                                        if (loop == validExcellData.length) {

                                                            let result = {
                                                                success: true,
                                                                status: 200,
                                                                message: "Valid"
                                                            }
                                                            resolve(result)
                                                        }
                                                    }

                                                })
                                            }
                                        }
                                    } catch (error) {
                                        reject(error)
                                        // throw error
                                    }
                                })()

                            } else {

                                let result = {
                                    success: false,
                                    status: 403,
                                    message: "Group empty."
                                }
                                resolve(result)
                            }
                        })

                    // } else {
                    //     let result = {
                    //         success: false,
                    //         status: 403,
                    //         message: "User limit exits."
                    //     }
                    //     resolve(result)
                    // }
                // })
            // })

            function isNumeric(num) {
                return !isNaN(num)
            }

        })
    },

    /**
     * * getcountOfuser method to get user count.<br>
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data 
     * @return {Object} Its return the count
     */
    getcountOfuser: (collectionName) => {
        return new Promise((resolve, reject) => {
            let db = global.db;
            db.collection(collectionName).find().toArray((err, totalUser) => {
                if (err) {
                    reject(err)
                }
                // db.collection('config').find({}).toArray((err, len) => {
                //     if (err) {
                //         reject(err)
                //     }
                    let result = {
                        success: true,
                        status: 200,
                        // userlimit: len[0].userlimit,
                        totalUser: totalUser.length,
                        message: "success."
                    }
                    resolve(result)
                // })
            })
        })
    },

    /**
     * * setsubscriberinDb method to add subscrbers of notification details.<br>
     * @param  {string} collectionName Its show the collection name.
     * @param  {Object} data 
     * @return {Object} Its return the success or failure
     */
    setsubscriberinDb: (collectionName, data) => {
        return new Promise((resolve, reject) => {
            let db = global.db;
            db.collection(collectionName).find({ userId: data.userId }).toArray((err, userdata) => {
                if (err) {
                    reject(err)
                }
                if (userdata.length == 0) {
                    db.collection(collectionName).insertOne(data, (err, dataval) => {
                        if (err) {
                            reject(err)
                        }                        
                        db.collection('SubscribersDetails').create(data, (err, value) => {
                            if (err) {
                                reject(err)
                            }
                            let result = {
                                success: true,
                                status: 200,
                                message: "success."
                            }
                            resolve(result)
                        })
                    })
                } else {
                    db.collection(collectionName).updateMany({ userId: data.userId }, {
                        $set: data
                    }, {
                        safe: true
                    }, (err, res) => {
                        if (err) {
                            reject(err)
                        }
                        db.collection('SubscribersDetails').updateMany({ userId: data.userId },
                            {
                                $set: data
                            }, (err, value) => {
                                if (err) {
                                    reject(err)
                                }
                                let result = {
                                    success: true,
                                    status: 200,
                                    message: "update success"
                                }
                                resolve(result)
                            })
                    })
                }
            })
        })
    },



    registerUserModel: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {

            // db.collection(collectionName).find().toArray((err, totalUser) => {

                // if (err) {
                //     reject(err)
                // }
                // let TotalData = totalUser.length + 1
                // db.collection('config').find({ "userlimit": { $gte: (TotalData) } }).toArray((err, len) => {
                    // if (err) {
                    //     reject(err)
                    // }
                    // if (len.length > 0) {
                        db.collection('groupinfo').find({ "groupname": "Default" }).toArray((err, grouplen) => {
                            if (err) {
                                reject(err)
                            }
                            if (grouplen.length > 0) {
                                db.collection('users').find({ username: data.username }).toArray((err, resdata) => {
                                    if (err) {
                                        reject(err)
                                    }
                                    if (resdata.length == 0) {

                                        data['SelectedGroup'] = [ObjectID(grouplen[0]._id)]
                                        db.collection('users').insertOne(data, (err, dataval) => {
                                            if (err) {
                                                reject(err)
                                            }
                                            db.collection('groupinfo').updateMany({ _id: grouplen[0]._id }, {
                                                $push: { userIds: ObjectID(dataval.ops[0]._id) }
                                            }, (err, resval) => {
                                                if (err) { reject(err); }
                                                db.collection('TenantDetails').updateOne({ "TenantId": data.TenantId, tenantName: data.tenantName },
                                                    { $inc: { userAdded: 1 } }, (err, value) => {
                                                        if (err) { reject(err); }
                                                       
                                                        var tenantId_data = Math.floor(Math.random() * 90000) + 10000
                                                        var dataenc = [{
                                                            email: data.email,
                                                            tenantName: data.tenantName,
                                                            tenant_randomChar: tenantId_data
                                                        }]
                                                        encryptData()
                                                        function encryptData() {
                                                            var cipher = crypto.createCipher(process.env.cryptoalgorithm, process.env.cryptokey);
                                                            var encrypted = cipher.update(JSON.stringify(dataenc), 'utf8', 'hex') + cipher.final('hex');
                                                            const dataCheck = (encrypted.toString()).includes('/');
                                                            if (dataCheck) {
                                                                encryptData()
                                                            } else {
                                                               let result = {
                                                                    success: true,
                                                                    status: 200,
                                                                    encrypted:encrypted,
                                                                    message: "Register successfully. Please verify your registration process. Link sent to be your email."
                                                                }
                                                                resolve(result)
                                                            }
                                                        }
                                                    })
                                            })
                                        })
                                    } else {
                                        let result = {
                                            success: false,
                                            status: 403,
                                            message: "User already added."
                                        }
                                        resolve(result)
                                    }
                                })

                            } else {
                                let result = {
                                    success: false,
                                    status: 403,
                                    message: "Group empty."
                                }
                                resolve(result)
                            }
                        })
                    // } else {
                    //     let result = {
                    //         success: false,
                    //         status: 403,
                    //         message: "User limit exits."
                    //     }
                    //     resolve(result)
                    // }
                // })
            // })
        })
    },


    verifyUserEmail:(collectionName,data)=>{
        let db = global.db;
        return new Promise((resolve, reject) => {

            db.collection(collectionName).find({ email: data.email, emailVerified:1}).toArray((err, resdata) => {
                if(err){
                    reject(err)
                }

                if(resdata.length > 0 ){
                    db.collection(collectionName).updateOne({ email: data.email, emailVerified:1 }, {
                        $set: {
                            emailVerified:0
                        }
                    }, (err, res) => {
                        if (err) {
                            reject(err)
                        }
                        let result={
                            success: true,
                            status: 200,
                            message: 'User verified successfully.'
                        }
                        resolve(result)
                    })
                }else{
                    let result={
                        success: false,
                        status: 403,
                        message: 'User already verified.'
                    }
                    resolve(result)
                }
            })
        })
    }

}