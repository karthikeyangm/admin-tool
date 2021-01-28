/**
 * GroupModel to perform Group operations through Group module ..
 * @module Group Model
 * @see {@link Group}
 */
var ObjectID = require('mongodb').ObjectID;

module.exports = {

    /**
    * In CreateUserScenarioGroup method to create record in grouping collection After that creation to insert gcreated id in scenario and user 
    * collection based on selected scenarios and selected users.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} data Its contains all group data.
    * @return {Object} Its return success or failure message based on data insertion.
    */

    CreateUserScenarioGroup: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {

            if (data.userIds.length > 0) {
                for (let i = 0; i < data.userIds.length; i++) {
                    data.userIds[i] = ObjectID(data.userIds[i])
                }
            }
            if (data.scenarioIds.length > 0) {
                for (let i = 0; i < data.scenarioIds.length; i++) {
                    data.scenarioIds[i] = ObjectID(data.scenarioIds[i])
                }
            }
            db.collection(collectionName).insertOne(data, (err, dataval) => {
                if (err) { reject(err) }
                else {
                    const id = dataval.ops[0]._id
                    for (let aa = 0; aa < data.scenarioIds.length; aa++) {
                        db.collection('scenarios').updateMany({ _id: { $in: [ObjectID(data.scenarioIds[aa])] } }, {
                            $push: { SelectedGroup: ObjectID(id) }
                        }, (err, res) => {
                            if (err) { reject(err); }

                            if (aa + 1 == data.scenarioIds.length) {
                                for (let aa = 0; aa < data.userIds.length; aa++) {
                                    db.collection('users').updateMany({ _id: { $in: [ObjectID(data.userIds[aa])] } }, {
                                        $push: { SelectedGroup: ObjectID(id) }
                                    }, (err, res) => {
                                        if (err) { reject(err); }
                                        let result = {
                                            success: true,
                                            status: 200,
                                            message: "Group created successful!",
                                            data: dataval.ops[0]
                                        }
                                        if (aa + 1 == data.userIds.length)
                                            resolve(result)
                                    })
                                }

                            }
                        })
                    }

                }
            })
        })
    },
    
    /**
    * In getAllgroupinfo method to get all record in grouping collection.
    * @param  {string} collectionName Its show the collection name.
    * @return {Object} Its return success or failure message with grouped data.
    */

    getAllgroupinfo: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find().toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                let result = {
                    success: true,
                    status: 200,
                    data: res
                }
                resolve(result)
            });
        })
    },
    /**
    * In getAllgroupinfo_limit method to get all record in grouping collection based on pagination count.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} groupLimit Its contain record limit.
    * @return {Object} Its return success or failure message with grouped data.
    */
    getAllgroupinfo_limit: (collectionName, groupLimit) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            let query = {}
            if (groupLimit.search_filter) {
                query = {
                    groupname: {

                        '$regex': new RegExp("^" + groupLimit.searchValue, "i")
                        // '$regex': groupLimit.searchValue
                    }
                }
            }
            db.collection(collectionName).find(query).skip(parseInt(groupLimit.start_user)).
                limit(parseInt(groupLimit.end_user)).toArray((err, res) => {
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
                            message: "Group not found."
                        }
                        resolve(result)
                    }
                });
        })
    },

    /**
    * In getUsergroupinfo_limit method to get all user based grouping details based on pagination limit.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} groupLimit Its contain record limit.
    * @return {Object} Its return success or failure message with grouped data.
    */
    getUsergroupinfo_limit: (collectionName, groupLimit) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection('users').find({ _id: { $in: [ObjectID(groupLimit.userid)] } }).toArray((err, res) => {
                if (err) {
                    reject(err)
                }
                if (res.length > 0) {

                    let query = {}
                    if (groupLimit.search_filter) {
                        query = {
                            groupname: {

                                '$regex': new RegExp("^" + groupLimit.searchValue, "i")
                                // '$regex': groupLimit.searchValue
                            },
                            _id: { $in: res[0].SelectedGroup }
                        }
                    } else {
                        query = {
                            _id: { $in: res[0].SelectedGroup }
                        }
                    }
                    db.collection(collectionName).find(query).skip(parseInt(groupLimit.start_user)).
                        limit(parseInt(groupLimit.end_user)).toArray((err, resdata) => {
                            if (err) {
                                reject(err)
                            }
                            if (resdata != null) {
                                if(resdata.length > 0){
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
                                    message: "Group not found."
                                }
                                resolve(result)
                                }

                     
                            } else {
                                let result = {
                                    success: false,
                                    status: 403,
                                    message: "Group not found."
                                }
                                resolve(result)
                            }
                        })
                } else {
                    let result = {
                        success: false,
                        status: 403,
                        message: "Group not found."
                    }
                    resolve(result)
                }
            })

        })
    },

    /**
    * In getSinglegroup method to get a specific group.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} id Its represent group id to find the specific group.
    * @return {Object} Its return success or failure message with grouped data.
    */
    getSinglegroup: (collectionName, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        message: "Group not found."
                    }
                    resolve(result)
                } else {
                    resolve(res)
                }
            })
        })
    },
      
    /**
    * In updategroupInfo method to get a specific group to update recors based on id. After to update the group id in Users collectioon and Scenario collection basd on selected details.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} data Its contains the group details like group info, Users list and Scenario list.
    * @param  {string} id Its represent group id to find the specific group to update.
    * @return {Object} Its return success or failure message with grouped data.
    */
    updategroupInfo: (collectionName, data, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {

            if (data.userIds.length > 0) {
                for (let i = 0; i < data.userIds.length; i++) {
                    data.userIds[i] = ObjectID(data.userIds[i])
                }
            }
            if (data.scenarioIds.length > 0) {
                for (let i = 0; i < data.scenarioIds.length; i++) {
                    data.scenarioIds[i] = ObjectID(data.scenarioIds[i])
                }
            }

            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        success: false,
                        status: 403,
                        message: "group not found."
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
                                await db.collection('scenarios').updateMany({ SelectedGroup: { $in: [ObjectID(id)] } }, {
                                    $pull: { SelectedGroup: ObjectID(id) }
                                }, (err, res) => {
                                    if (err) { reject(err) }
                                    for (let aa = 0; aa < data.scenarioIds.length; aa++) {

                                        db.collection('scenarios').updateMany({ _id: { $in: [ObjectID(data.scenarioIds[aa])] } }, {
                                            $push: { SelectedGroup: ObjectID(id) }
                                        }, (err, res) => {
                                            if (err) { reject(err); }
                                            if (aa + 1 == data.scenarioIds.length) {

                                                db.collection('users').updateMany({ SelectedGroup: { $in: [ObjectID(id)] } }, {
                                                    $pull: { SelectedGroup: ObjectID(id) }
                                                }, (err, res) => {
                                                    if (err) { reject(err) }
                                                    for (let aa = 0; aa < data.userIds.length; aa++) {
                                                        db.collection('users').updateMany({ _id: { $in: [ObjectID(data.userIds[aa])] } }, {
                                                            $push: { SelectedGroup: ObjectID(id) }
                                                        }, (err, res) => {
                                                            if (err) { reject(err); }
                                                            let result = {
                                                                success: true,
                                                                status: 200,
                                                                message: "Group Successfully Updated!"
                                                            }
                                                            if (aa + 1 == data.userIds.length)
                                                                resolve(result)
                                                        })
                                                    }
                                                })

                                            }
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


    /**
    * In deleteGroup method to delee group details in grouping collection and to remove group id in users collection and scenario  collection.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} groupLimit Its contain record limit.
    * @return {Object} Its return success or failure message with grouped data.
    */
    deleteGroup: (collectionName, id) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ _id: ObjectID(id) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        success: false,
                        status: 403,
                        message: "Group not found."
                    }
                    resolve(result)
                } else {
                    db.collection(collectionName).deleteOne({ _id: ObjectID(id) }, (err, res) => {
                        if (err) {
                            reject(err)
                        }
                        else {

                            db.collection('scenarios').updateMany({ "SelectedGroup": { $in: [ObjectID(id)] } },
                                { $pull: { SelectedGroup: ObjectID(id) } }, (err, resData) => {
                                    if (err) {
                                        reject(err)
                                    }
                                    else {
                                        db.collection('users').updateMany({ "SelectedGroup": { $in: [ObjectID(id)] } },
                                            { $pull: { SelectedGroup: ObjectID(id) } }, (err, resData) => {
                                                if (err) {
                                                    reject(err)
                                                }
                                                else {
                                                    let result = {
                                                        success: true,
                                                        status: 200,
                                                        message: "Group Deleted successfully!."
                                                    }
                                                    resolve(result)
                                                }
                                            })
                                    }
                                })


                        }
                    })
                }
            })
        })
    },
}