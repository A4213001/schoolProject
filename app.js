var express = require('express');
var app = require('express')();
var variable = require('./variable');
var server = require('http').Server(app);
global.io = require('socket.io')(server);
var serverRobotEvent = require('./serverRobotEvent');

server.listen(80);
console.log('Server running at port 80');

app.use(express.static('views'));

//webroute start
app.get('/', function (req, res) {
    res.render('robot.ejs');
});

app.get('/line', function (req, res) {
    res.render('line.ejs');
});

app.get('/home', function (req, res) {
    res.render('home.ejs');
});

app.get('/search', function (req, res) {
    res.render('search.ejs');
});

app.get('/button', function (req, res) {
    res.render('button.ejs');
});
//webroute end

//socket connect start
io.on('connection', function (socket) {
    console.log("connect connectCount : " + io.engine.clientsCount);

    //connectionEvent setAddress
    socket.on('setAddress', function (data){
		serverRobotEvent.onSetAddress(data);
  	});

    //connectionEvent start
  	socket.on('start', function (data) {
  		serverRobotEvent.onStart(data, socket);
  	});

  	//connectionEvent walk
  	socket.on('walk', function (data) {
		serverRobotEvent.onWalk(data, socket);
  	});

  	//connectionEvent XXXXX
  	socket.on('XXXXX', function (data) {
		serverRobotEvent.onXXXXX(data);
  	});

  	//connectionEvent allStart
  	socket.on('allAutoStart', function () {
		serverRobotEvent.onAllAutoStart();
  	});

  	socket.on('disconnect', function() {
  		serverRobotEvent.onDisconnect();
  	});
});
//socket connect end