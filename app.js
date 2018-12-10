var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
global.io = require('socket.io')(server);
var serverRobotEvent = require('./serverRobotEvent');

server.listen(80);
console.log('Server running at port 80');

app.use(express.static('views'));

// ---varInit---
global.robotCount = 0; //機器人數量
global.point = new Array(); //當前位置
global.nextPoint = new Array(); //下個位置
global.route = new Array(); //預定路線
global.endPoint = new Array(); //終點位置
global.direction = new Array(); //前進方向
global.number_plate = new Array(); //號碼牌
global.stepCount = new Array(); //步數
global.changeRoute = new Array(); //更換路徑
global.stopCount = new Array(); //停止次數
global.robotStatus = new Array(); //robot狀態
//

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
