var express = require('express');
var app = require('express')();
var variable = require('./variable');
var server = require('http').Server(app);
global.io = require('socket.io')(server);
var serverRobotEvent = require('./serverRobotEvent');

server.listen(80);
console.log('Server running at port 80');

app.use(express.static('views'));

//webRoute start
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

app.get('/demo', function (req, res) {
    res.render('demo.ejs');
});
//webRoute end

//socket connect start
io.on('connection', function (socket) {
    serverRobotEvent.onConnection(io);

    socket.on('signUp', function (data) {
        serverRobotEvent.onSignUp(data, socket);
    });

    socket.on('setAddress', function (data){
		serverRobotEvent.onSetAddress(data);
  	});

  	socket.on('start', function (data) {
  		serverRobotEvent.onStart(data, socket);
  	});

    socket.on('getCargoEndPoint', function (data) {
        serverRobotEvent.onGetCargoEndPoint(data, socket);
    });

  	socket.on('walk', function (data) {
		serverRobotEvent.onWalk(data, socket);
  	});

  	socket.on('allAutoStart', function () {
		serverRobotEvent.onAllAutoStart();
        startTime = new Date();
  	});

  	socket.on('disconnect', function() {
  		serverRobotEvent.onDisconnect();
  	});
});
//socket connect end