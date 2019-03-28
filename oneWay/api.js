var express = require('express');
var variable = require('./variable');
var router = express.Router();

router.get('/point', function(req, res) {
    res.json({ point: point });
});

module.exports = router;