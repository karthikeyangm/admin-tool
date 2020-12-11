/**
 * ReportModel to perform report operations through Report module ..
 * @module Report Model
 * @see {@link Report}
 */
var ObjectID = require('mongodb').ObjectID;

module.exports = {

    /**
    * In getReportDatafrombundel method to create report data.<br>
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} data Its contains all report data.
    * @return {Object} Its return success or failure message based on data insertion.
    */

    getReportDatafrombundel: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            const beginnerRangeValue = { min: Number(data.beginnerRange.min), max: Number(data.beginnerRange.max) }
            const intermediateRangeValue = { min: Number(data.intermediateRange.min), max: Number(data.intermediateRange.max) }
            const expertRangeValue = { min: Number(data.expertRange.min), max: Number(data.expertRange.max) }
            let dataFormation = {}
            dataFormation = {
                scenarioName: data.scenarioName,
                userName: data.userName,
                timeAllocatedValue: Number(data.timeAllocatedValue),
                timeTakenValue: Number(data.timeTakenValue),
                totalAttemptsCount: Number(data.totalAttemptsCount),
                beginnerRange: beginnerRangeValue,
                intermediateRange: intermediateRangeValue,
                expertRange: expertRangeValue,
                isSkillMeterTransition: data.isSkillMeterTransition,
                isBarTransition: data.isBarTransition,
                configCount: Number(data.attmeptsData.configCount),
                isAttemptsPanelTransition: data.isAttemptsPanelTransition
            }
            let vAttemptData = []
            let warrningCount = 0
            for (let i = 0; i < Number(data.attmeptsData.configCount); i++) {
                let dataextrastep = 0
                if (data.attmeptsData.extraSteps[i] !== undefined) {
                    dataextrastep = data.attmeptsData.extraSteps[i]
                    warrningCount += data.attmeptsData.extraSteps[i]
                }
                vAttemptData.push({
                    step: `Configuration ${i + 1}`,
                    timeTaken: Number(data.attmeptsData.timeTakenList[i]),
                    attemptsCount: Number(data.attmeptsData.attemptsCountList[i]),
                    extraSteps: Number(dataextrastep)
                })
            }
            dataFormation['AttemptsData'] = vAttemptData
            dataFormation['warrningCount'] = warrningCount
            db.collection(collectionName).insertOne(dataFormation, (err, dataval) => {
                if (err) { reject(err) }
                else {
                    let result = {
                        success: true,
                        status: 200,
                        message: "report created successful!"
                    }
                    resolve(result)
                }
            })
        })
    },

    /**
    * In getUserbasedScenarioList method to get scenario list.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} data Its contains selected group id to get scenario list.
    * @return {Object} Its return success or failure message with scenario list.
    */
    getUserbasedScenarioList: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ SelectedGroup: { $in: data.SelectedGroup } }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {
                    let result = {
                        message: "Scenario not found."
                    }
                    resolve(result)
                } else {
                    resolve(res)
                }
            })
        })
    },


    /**
    * In getScenarioBasedReport method to get scenario based report.
    * @param  {string} collectionName Its show the collection name.
    * @param  {string} data Its contains selected group id.
    * @return {Object} Its return success or failure message with scenario based records.
    */
    getScenarioBasedReport: (collectionName, data) => {
        let db = global.db;
        return new Promise((resolve, reject) => {
            db.collection(collectionName).find({ scenarioId:ObjectID(data.scenarioId),
                userid:ObjectID(data.userid) }).toArray((err, res) => {
                if (err) { reject(err) }
                if (res.length == 0) {                      
                    let result = {
                        success: false,
                        status: 403,
                        message: 'Report not found'
                    }
                    resolve(result)
                } else {                    
                    let result = {
                        success: true,
                        status: 200,
                        message: 'Success!',
                        data: res
                    }
                    resolve(result)
                }
            })
        })
    }

}