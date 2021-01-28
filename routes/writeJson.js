
var express = require('express');
var router = express.Router();
var fs = require('fs')

const jsonObj = {
    scenarioTitle: "AFF A320 Systems",
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
        }
    ]
}

router.get('/scenarioJsonGen', (req, res) => {
    var jsonContent = JSON.stringify(jsonObj);
    var  filenameVal='myjsonfile.json'
    fs.writeFile(`jsondata/${filenameVal}`, jsonContent, 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        // res.download('jsondata/myjsonfile.json')
        res.download('jsondata/myjsonfile.json', 'user-facing-filename.json', (err) => {
            if (err) {
              //handle error
              console.log(err)
              return
            } else {
                console.log('file sent')
              //do something
            }
          })
    })
})

module.exports = router