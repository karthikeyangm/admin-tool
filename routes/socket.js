var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/data', function(req, res, next) {
    res.io.emit("socketToMe", "users");
    res.send('respond with a resource.');
});

module.exports = router