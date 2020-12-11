/**
 * Report module to perform Report based operations.
 * @module Report 
 * @see {@link reportmodel}
 */

const express = require('express');
const router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var reportmodel = require('../models/reportModel')
var util = require("../utils/util");

/**
 * Sends a HTTP post request to add report data in collection
 * </br> 
 * @function getReportData
 * @path {post} path /report/getReportData
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain report data.
 * @param {Function}  reportmodel.getReportDatafrombundel() This function is used to pass collection name  and data
 * in reportmodel to store datain collection. 
 * @return {Object} Its return success or failure message based on data insertion.
 */


router.post('/getReportData', (req, res) => {
    data = {
        scenarioName: "AFF A320 Systems",
        userName: "testuser@netapp.com",
        pieSliceValues: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
        isPieTransistion: true,
        timeAllocatedValue: 50,
        timeTakenValue: 20,
        isBarTransition: true,
        totalAttemptsCount: 10,
        beginnerRange: { min: 16, max: 0 },
        intermediateRange: { min: 8, max: 15 },
        expertRange: { min: 0, max: 7 },
        isSkillMeterTransition: true,
        attmeptsData:
        {
            configCount: 20,
            timeTakenList: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
            attemptsCountList: [2, 0, 5, 2, 1, 2, 0, 5, 2, 1, 2, 0, 5, 2, 1, 2, 0, 5, 2, 1],
            extraSteps: [10, 5, 0, 0, 0, 0, 0]
        },
        isAttemptsPanelTransition: true
    };
    const getReportDatafrombundel = reportmodel.getReportDatafrombundel('reports', data)
    getReportDatafrombundel.then((data) => {
        res.status(200).send(data)
    }).catch(err => {
        util.writeLog(`${err} -> get scenario Error`, 'post:/report/getReportData');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'scenario not found';
        res.send(error);
    })
})


/**
 * Sends a HTTP post request to get user based scenario list
 * </br> 
 * @function getUserBasedScenarioList
 * @path {post} path /report/getUserBasedScenarioList
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user based scenario list.
 * @param {Function}  reportmodel.getUserbasedScenarioList() This function is used to pass collection name  and data
 * in reportmodel to retrive scenario list. 
 * @return {Object} Its return success or failure message and scenario list.
 */

router.post('/getUserBasedScenarioList', (req, res) => {
    const SelectedGroup = req.body
    const ususerStoreeData = {}
    for (var i = 0; i < SelectedGroup.length; i++) {
        SelectedGroup[i] = ObjectID(SelectedGroup[i]);
    }
    ususerStoreeData['SelectedGroup'] = SelectedGroup
    const getReportDatafrombundel = reportmodel.getUserbasedScenarioList('scenarios', ususerStoreeData)
    getReportDatafrombundel.then((data) => {
        res.status(200).send(data)
    }).catch(err => {
        util.writeLog(`${err} -> get getUserBasedScenarioList Error`, 'post:/report/getUserBasedScenarioList');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'scenario not found';
        res.send(error);
    })
})

/**
 * Sends a HTTP post request to get scenario bassed report
 * </br> 
 * @function getSenarioBasedReport
 * @path {post} path /report/getSenarioBasedReport
 * @param req {Object} The req object represents the HTTP request.
 * @param res {Object} The res object represents the HTTP response.
 * @param req.body {Object} The JSON payload. Its contain user based scenario details.
 * @param {Function}  reportmodel.getScenarioBasedReport() This function is used to pass collection name  and data
 * in reportmodel to retrive report based on user scenario report data. 
 * @return {Object} Its return success or failure message and scenario report.
 */

router.post('/getSenarioBasedReport', (req, res) => {
    const SecnarioId = req.body
    const getReportDatafrombundel = reportmodel.getScenarioBasedReport('reports', SecnarioId)
    getReportDatafrombundel.then((data) => {
        res.status(200).send(data)
    }).catch(err => {
        util.writeLog(`${err} -> getSenarioBasedReport Error`, 'post:/report/getSenarioBasedReport');
        var error = new Error();
        error.success = false;
        error.status = 404;
        error.message = 'scenario not found';
        res.send(error);
    })
})


router.get('/streamingAssetEndUser/:id', (req, res) => {
    let streamingAsset = {
        "_id": "5f6e1253d0f2cf09bc0373c9",
        "scenarioTitle": "AFF A320 Storage Systems",
        "Information": "This scenario will help you install and setup AFF A320 storage systems. This scenario is do connection between shelf and controller.",
        "configurations": [
            {
                "configurationName": "Rack Setup",
                "setupType": "RackSetup",
                "stepCompletedMessage": "Rack setup is completed successfully.",
                "cableColor": "",
                "componentInstallations": [
                    {
                        "assetName": "NS224",
                        "instruction": "Install first shelf into cabinet",
                        "successMessage": "Shelf correctly installed",
                        "incorrectFeedback": "Incorrect shelf location",
                        "prefabName": "NS224",
                        "assetItem": "NS224_1"
                    },
                    {
                        "assetName": "AFFA320",
                        "instruction": "Install storage controller(s) into cabinet",
                        "successMessage": "Storage controller(s) correctly installed",
                        "incorrectFeedback": "Incorrect storage controller(s) location",
                        "prefabName": "AFFA320",
                        "assetItem": "AFFA320_1"
                    },
                    {
                        "assetName": "NS224",
                        "instruction": "Install next shelf into cabinet",
                        "successMessage": "Shelf correctly installed",
                        "incorrectFeedback": "Incorrect shelf location",
                        "prefabName": "NS224",
                        "assetItem": "NS224_2"
                    }
                ],
                "cableInstallations": [],
                "consoleInstallations": []
            },
            {
                "configurationName": "Power Cables",
                "setupType": "CableSetup",
                "stepCompletedMessage": "Power cables are connected successfully",
                "cableColor": "000000",
                "componentInstallations": [],
                "cableInstallations": [
                    {
                        "assetName": "Power",
                        "instruction": "Connect power cable on Shelf ID: 20 NSM: A",
                        "successMessage": "Redundant power source established",
                        "incorrectFeedback": "Power source is not redundant",
                        "prefabName": "Power",
                        "cableType": "power",
                        "singleSidePort": true,
                        "colorCode": "",
                        "cablePortOne": "NS224_2_NSM100A_powerplug",
                        "cablePortTwo": "NS224_2_NSM100A_powerplug"
                    },
                    {
                        "assetName": "Power",
                        "instruction": "Connect power cable to the alternate power source on Shelf ID: 20 NSM: B",
                        "successMessage": "Redundant power source established",
                        "incorrectFeedback": "Power source is not redundant",
                        "prefabName": "Power",
                        "cableType": "power",
                        "singleSidePort": true,
                        "colorCode": "",
                        "cablePortOne": "NS224_2_NSM100B_powerplug",
                        "cablePortTwo": "NS224_2_NSM100B_powerplug"
                    }
                ],
                "consoleInstallations": []
            },
            {
                "configurationName": "Storage Cabling",
                "setupType": "CableSetup",
                "stepCompletedMessage": "Storage cables are connected successfully.",
                "cableColor": "2369C0",
                "componentInstallations": [],
                "cableInstallations": [
                    {
                        "assetName": "100GBE",
                        "instruction": "Connect primary storage cable from Controller: A Port: e0c to Shelf ID: 20 NSM: A Port: e0a",
                        "successMessage": "Cable properly connected",
                        "incorrectFeedback": "Cable connected to incorrect ports",
                        "prefabName": "100GBE",
                        "cableType": "100GBE",
                        "singleSidePort": false,
                        "colorCode": "",
                        "cablePortOne": "NS224_2_NSM100A_e0a",
                        "cablePortTwo": "AFFA320_1_ControllerA_e0c"
                    }
                ],
                "consoleInstallations": []
            },
            {
                "configurationName": "HA Cluster Connection",
                "setupType": "CableSetup",
                "stepCompletedMessage": "HA Cluster is connected successfully.",
                "cableColor": "501177",
                "componentInstallations": [],
                "cableInstallations": [
                    {
                        "assetName": "100GBE",
                        "instruction": "Connect HA Cluster Interconnect cable from Controller: A Port: e0a to Controller: B Port: e0a",
                        "successMessage": "Interconnect ports cabled properly",
                        "incorrectFeedback": "Incorrect ports used for Interconnect",
                        "prefabName": "100GBE",
                        "cableType": "100GBE",
                        "singleSidePort": false,
                        "colorCode": "",
                        "cablePortOne": "AFFA320_1_ControllerA_e0a",
                        "cablePortTwo": "AFFA320_1_ControllerB_e0a"
                    }
                ],
                "consoleInstallations": []
            },
            {
                "configurationName": "Management Cabling",
                "setupType": "CableSetup",
                "stepCompletedMessage": "Management cables are connected successfully.",
                "cableColor": "906AB3",
                "componentInstallations": [],
                "cableInstallations": [
                    {
                        "assetName": "RJ45",
                        "instruction": "Connect management cable on Controller: A Port: RJ45a",
                        "successMessage": "Management port cabled correctly",
                        "incorrectFeedback": "Incorrect port selected as management port",
                        "prefabName": "RJ45",
                        "cableType": "RJ45",
                        "singleSidePort": true,
                        "colorCode": "",
                        "cablePortOne": "AFFA320_1_ControllerA_RJ45a",
                        "cablePortTwo": "AFFA320_1_ControllerA_RJ45a"
                    }
                ],
                "consoleInstallations": []
            },
            {
                "configurationName": "Host Connection - Ethernet",
                "setupType": "CableSetup",
                "stepCompletedMessage": "Ethernet is connected with host successfully.",
                "cableColor": "EE8866",
                "componentInstallations": [],
                "cableInstallations": [
                    {
                        "assetName": "40GBE",
                        "instruction": "Connect onboard Ethernet data ports on Controller: A Port: e0g",
                        "successMessage": "Ethernet data port(s) cabled correctly",
                        "incorrectFeedback": "Incorrect onboard ports selected as Ethernet data ports",
                        "prefabName": "40GBE",
                        "cableType": "40GBE",
                        "singleSidePort": true,
                        "colorCode": "",
                        "cablePortOne": "AFFA320_1_ControllerA_e0g",
                        "cablePortTwo": "AFFA320_1_ControllerA_e0g"
                    }
                ],
                "consoleInstallations": []
            },
            {
                "configurationName": "Host Connection - Fibre Channel",
                "setupType": "CableSetup",
                "stepCompletedMessage": "Fiber channels are connected with host successfully.",
                "cableColor": "44BB99",
                "componentInstallations": [],
                "cableInstallations": [
                    {
                        "assetName": "FC",
                        "instruction": "Connect onboard FC port on Controller: A Port: 0a",
                        "successMessage": "FC Port cabled correctly",
                        "incorrectFeedback": "Incorrect onboard ports selected",
                        "prefabName": "Fc",
                        "cableType": "FC",
                        "singleSidePort": true,
                        "colorCode": "",
                        "cablePortOne": "AFFA320_1_ControllerA_FCa",
                        "cablePortTwo": "AFFA320_1_ControllerA_FCa"
                    }
                ],
                "consoleInstallations": []
            },
            {
                "configurationName": "Command",
                "setupType": "ConsoleSetup",
                "stepCompletedMessage": "Console setup is completed successfully. Close the console manually",
                "cableColor": "",
                "componentInstallations": [],
                "cableInstallations": [],
                "consoleInstallations": [
                    {
                        "assetName": "cmd1",
                        "instruction": "storage port show - Run this command to display settings of onboard storage ports",
                        "successMessage": "",
                        "incorrectFeedback": "Syntax error",
                        "imageName": "",
                        "prefabName": "console",
                        "command": "storage port show"
                    }
                ]
            }
        ],
        "inventoryItems": {
            "controllersInInventory": [
                {
                    "assetId": 1,
                    "assetName": "AFF A320",
                    "prefabName": "AFF A320"
                }
            ],
            "shelvesInInventory": [
                {
                    "assetId": 1,
                    "assetName": "NS224",
                    "prefabName": "NS224"
                }
            ],
            "switchesInInventory": [],
            "cablesInInventory": [
                {
                    "assetId": 1,
                    "assetName": "40GBE Single channel cable",
                    "prefabName": "i40GBECableBtn",
                    "singleSideCable": true
                },
                {
                    "assetId": 7,
                    "assetName": "40GBE Dual channel cable",
                    "prefabName": "i40GBEDualCableBtn",
                    "singleSideCable": false
                },
                {
                    "assetId": 8,
                    "assetName": "100GBE Single channel cable",
                    "prefabName": "i100GBECableBtn",
                    "singleSideCable": true
                },
                {
                    "assetId": 2,
                    "assetName": "100GBE Dual channel cable",
                    "prefabName": "i100GBEDualCableBtn",
                    "singleSideCable": false
                },
                {
                    "assetId": 3,
                    "assetName": "FC Single channel cable",
                    "prefabName": "iFCCableBtn",
                    "singleSideCable": true
                },
                {
                    "assetId": 10,
                    "assetName": "FC Dual channel cable",
                    "prefabName": "iFCDualCableBtn",
                    "singleSideCable": false
                },
                {
                    "assetId": 6,
                    "assetName": "RJ45 Single channel cable",
                    "prefabName": "iRJ45CableBtn",
                    "singleSideCable": true
                },
                {
                    "assetId": 9,
                    "assetName": "RJ45 Dual channel cable",
                    "prefabName": "iRJ45DualCableBtn",
                    "singleSideCable": false
                },
                {
                    "assetId": 4,
                    "assetName": "Left power Single channel cable",
                    "prefabName": "iLeftPowerCableBtn",
                    "singleSideCable": true
                },
                {
                    "assetId": 5,
                    "assetName": "Right power Single channel cable",
                    "prefabName": "iRightPowerCableBtn",
                    "singleSideCable": true
                }
            ],
            "rackInInventory":
            {
                "assetId": 1,
                "assetName": "42U Cabinet",
                "slotIndex":
                    [3, 4, 5]
            }
        }
    }
    console.log(req.params)
    res.send(streamingAsset)
})

module.exports = router