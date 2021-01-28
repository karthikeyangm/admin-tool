
/**
 * UserModel module to perform users operations through User module ..
 * @module Scenario Model
 * @see {@link Scenario}
 */

var ObjectID = require('mongodb').ObjectID;

module.exports = {

    /**
    * * In getAllScenario method to get all Scenario records in Scenario colletion.<br>
    * @param  {string} collectionName Its show the collection name.
    * @return {Object} Its return success or failure message with scenario data.
    */
    getAllScenario: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find().toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                if (res.length > 0) {
                    let result = {
                        success: true,
                        status: 200,
                        data: res
                    }
                    resolve(result)
                } else {
                    let result = {
                        success: false,
                        status: 403,
                        message: "Scenario not found."
                    }
                    resolve(result)
                }
            });
        })
    },

    /**
    * * In getAllScenario_limit method to get all Scenario records in Scenario colletion based on pagination limit.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} ScenarioLimit Its contain the pagination limit.
    * @return {Object} Its return success or failure message with scenario data.
    */
    getAllScenario_limit: (collectionName, ScenarioLimit) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            let query = {}
            if (ScenarioLimit.search_filter) {
                query = {
                    Title: {

                        '$regex': new RegExp("^" + ScenarioLimit.searchValue, "i")
                        // '$regex': ScenarioLimit.searchValue
                    }
                }
            }
            console.log(query)

            db.collection(collectionName).find(query).skip(parseInt(ScenarioLimit.start_user)).
                limit(parseInt(ScenarioLimit.end_user)).toArray((err, res) => {
                    if (err) {
                        reject(err)
                    }
                    if (res.length > 0) {
                        let result = {
                            success: true,
                            status: 200,
                            data: res
                        }
                        resolve(result)
                    } else {

                        let result = {
                            success: false,
                            status: 403,
                            message: "Scenario not found."
                        }
                        resolve(result)
                    }
                });
        })
    },

    /**
    * * In getUserScenario method to get all Scenario records based on user in Scenario colletion.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} id Its contains the user id to get specific user.
    * @return {Object} Its return success or failure message with scenario data based on User.
    */

    getUserScenario: (collectionName, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection('users').find({ _id: { $in: [ObjectID(id)] } }).toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                if (res.length > 0) {
                    db.collection(collectionName).find({ SelectedGroup: { $in: res[0].SelectedGroup } }).toArray((err, resdata) => {
                        if (err) {
                            reject(err)
                        }
                        if (resdata.length > 0) {
                            let result = {
                                success: true,
                                status: 200,
                                data: resdata
                            }
                            resolve(result)
                        } else {
                            let result = {
                                success: false,
                                status: 403,
                                message: "Scenario not found."
                            }
                            resolve(result)
                        }
                    })
                } else {
                    let result = {
                        success: false,
                        status: 403,
                        message: "Scenario not found."
                    }
                    resolve(result)
                }
            })
        })
    },

    /**
    * * In getUserScenario_limit method to get all Scenario records based on user with pagination limit in Scenario colletion.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} ScenarioLimit Its contains the user id and pagination count to get specific scenario.
    * @return {Object} Its return success or failure message with scenario data.
    */

    getUserScenario_limit: (collectionName, ScenarioLimit) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection('users').find({ _id: { $in: [ObjectID(ScenarioLimit.userid)] } }).toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                if (res.length > 0) {

                    let query = {}
                    if (ScenarioLimit.search_filter) {
                        query = {
                            Title: {

                                '$regex': new RegExp("^" + ScenarioLimit.searchValue, "i")
                                // '$regex': ScenarioLimit.searchValue
                            },
                            SelectedGroup: { $in: res[0].SelectedGroup }
                        }
                    } else {
                        query = {
                            SelectedGroup: { $in: res[0].SelectedGroup }
                        }
                    }


                    db.collection(collectionName).find(query).skip(parseInt(ScenarioLimit.start_user)).
                        limit(parseInt(ScenarioLimit.end_user)).toArray((err, resdata) => {
                            if (err) {
                                reject(err)
                            }
                            if (resdata != null) {
                                if (resdata.length > 0) {
                                    let result = {
                                        success: true,
                                        status: 200,
                                        data: resdata
                                    }
                                    resolve(result)
                                }else{
                                    
                                let result = {
                                    success: false,
                                    status: 403,
                                    message: "Scenario not found."
                                }
                                resolve(result)
                                }
                            }else {
                                let result = {
                                    success: false,
                                    status: 403,
                                    message: "Scenario not found."
                                }
                                resolve(result)
                            }
                        })
                } else {
                    let result = {
                        success: false,
                        status: 403,
                        message: "Scenario not found."
                    }
                    resolve(result)
                }
            })
        })
    },

    /**
    * * In deleteScenario method to delet Scenario in Scenario colletion and remove scenario id in grouping collection.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} id Its contains the scenario id to delete specific scenario.
    * @return {Object} Its return success or failure message.
    */

    deleteScenario: (collectionName, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        success: false,
                        status: 403,
                        message: "Scenario not found."
                    }
                    resolve(result)
                } else {
                    db.collection(collectionName).deleteOne({ _id: ObjectID(id) }, (err, res) => {
                        if (err) {
                            reject(err)
                        }
                        db.collection('groupinfo').updateMany({ "scenarioIds": { $in: [ObjectID(id)] } },
                            { $pull: { scenarioIds: ObjectID(id) } }, (err, resData) => {
                                if (err) {
                                    reject(err)
                                }
                                else {
                                    let result = {
                                        success: true,
                                        status: 200,
                                        message: "Scenario Deleted successfully!."
                                    }
                                    resolve(result)
                                }
                            })
                    })
                }
            })
        })
    },

    /**
    * * In CreateScenario method to create Scenario in Scenario colletion and add scenario id in grouping collection based on selected group.
    * @param  {string} collectionName Its show the collection name.
    * @param  {Object} data Its contains the scenario data.
    * @return {Object} Its return success or failure message based on insertion.
    */
    CreateScenario: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ Title: data.Title }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    data['publishFlag']=Number(0)
                    db.collection(collectionName).insertOne(data, (err, dataval) => {
                        if (err) { reject(err) }
                        else {
                            if (data.role !== '1') {
                                updateGroupUserDetails(data, dataval.ops[0]._id)
                                async function updateGroupUserDetails(data, id) {
                                    let db = global.db;
                                    await db.collection('groupinfo').updateMany({ scenarioIds: { $in: [ObjectID(id)] } }, {
                                        $pull: { scenarioIds: ObjectID(id) }
                                    }, (err, res) => {
                                        if (err) { reject(err) }
                                        for (let aa = 0; aa < data.SelectedGroup.length; aa++) {
                                            db.collection('groupinfo').updateMany({ _id: { $in: [ObjectID(data.SelectedGroup[aa])] } }, {
                                                $push: { scenarioIds: ObjectID(id) }
                                            }, (err, res) => {
                                                if (err) { reject(err); }
                                                let result = {
                                                    success: true,
                                                    status: 200,
                                                    message: "Scenario created successful!",
                                                    data: dataval.ops[0]
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
                                    message: "Scenario created successful!"
                                }
                                resolve(result)
                            }
                            // const result = {
                            //     success: true,
                            //     status: true,
                            //     message: 'User created successful!'

                            // }
                            // resolve(result)
                        }
                    })
                } else {
                    const result = {
                        success: false,
                        status: 403,
                        message: "Scenario Name added."
                    }
                    resolve(result)
                }
            })
        })
    },

    /**
    * * In updatescenarios method to update Scenario in Scenario colletion and add or remove scenario id in grouping collection based on selected group.
    * @param  {string} collectionName Its show the collection name.
    * @param  {Object} data Its contains the scenario data to update.
    * @return {Object} Its return success or failure message based on updation.
    */
    updatescenarios: (collectionName, data, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        success: false,
                        status: 403,
                        message: "Scenario not found."
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
                            updateGroupUserDetails(data, id)
                            async function updateGroupUserDetails(data, id) {
                                let db = global.db;
                                await db.collection('groupinfo').updateMany({ scenarioIds: { $in: [ObjectID(id)] } }, {
                                    $pull: { scenarioIds: ObjectID(id) }
                                }, (err, res) => {
                                    if (err) { reject(err) }
                                    for (let aa = 0; aa < data.SelectedGroup.length; aa++) {
                                        db.collection('groupinfo').updateMany({ _id: { $in: [ObjectID(data.SelectedGroup[aa])] } }, {
                                            $push: { scenarioIds: ObjectID(id) }
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
                        }
                    })
                }
            })
        })
    },

}