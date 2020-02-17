var express = require('express');
var path = require('path');
var app = express();
var router = express.Router();

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/visual.html'));
})

app.use('/', router);
var server = app.listen(5000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://localhost:5000", host, port)
})