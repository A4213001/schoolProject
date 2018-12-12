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

    socket.on('setAddress', function (data){
		  serverRobotEvent.onSetAddress(data);
  	});

  	socket.on('start', function (data) {
  		serverRobotEvent.onStart(data, socket);
  	});

    //connectionEvent getCargoEndPoint
    socket.on('getCargoEndPoint', function (data) {
      console.log(cargo);
      var gotoX, gotoY, success = true;
      if(data.nowX == 0){
        //如果此位置還有貨物，直接取得此貨物的終點座標
        if(cargo.left[data.nowY].length > 0){
          gotoX = mapXLength - 1;
          gotoY = cargo.left[data.nowY][0];
        } 
        //若此位置沒有貨物，則去附近尋找貨物
        else {
          var offset = 1; //相鄰格數
          var turn = 1; //上方或下方
          var times = 0; //迴圈執行次數
          var cargoIndex; //貨物位置
          while(true){
            cargoIndex = data.nowY + offset * turn;
            if(cargoIndex >= 0 && cargoIndex < mapYLength){
              if(cargo.left[cargoIndex].length > 0){
                gotoX = 0;
                gotoY = cargoIndex; //前往有貨物的位置
                break;
              }
            }
            if(times % 2 == 1){
              offset = offset + 1;
            }
            turn = turn * -1;
            times++;
            if((data.nowY + offset) > mapYLength - 1 && (data.nowY - offset) < 0){
              success = false;
              break;
            }
          }
        }
      } else if(data.nowX == mapXLength - 1){
        //如果此位置還有貨物，直接取得此貨物的終點座標
        if(cargo.right[data.nowY].length > 0){
          gotoX = 0;
          gotoY = cargo.right[data.nowY][0];
        } 
        //若此位置沒有貨物，則去附近尋找貨物
        else {
          var offset = 1; //相鄰格數
          var turn = 1; //上方或下方
          var times = 0; //迴圈執行次數
          var cargoIndex; //貨物位置
          while(true){
            cargoIndex = data.nowY + offset * turn;
            if(cargoIndex >= 0 && cargoIndex < mapYLength){
              if(cargo.right[cargoIndex].length > 0){
                gotoX = 0;
                gotoY = cargoIndex; //前往有貨物的位置
                break;
              }
            }
            if(times % 2 == 1){
              offset = offset + 1;
            }
            turn = turn * -1;
            times++;
            if((data.nowY + offset) > (mapYLength - 1) && (data.nowY - offset) < 0){
              success = false;
              break;
            }
          }
        }
      } else {
        success = false;
      }
      if(success){
        if(data.nowX == 0){
          cargo.left[data.nowY].shift();
        } else {
          cargo.right[data.nowY].shift();
        }
        socket.emit('returnCargoEndPoint',
          {
            gotoX : gotoX,
            gotoY : gotoY
          }
        )
      }
    });

  	socket.on('walk', function (data) {
		  serverRobotEvent.onWalk(data, socket);
  	});

  	socket.on('XXXXX', function (data) {
		  serverRobotEvent.onXXXXX(data);
  	});

  	socket.on('allAutoStart', function () {
		  serverRobotEvent.onAllAutoStart();
  	});

  	socket.on('disconnect', function() {
  		serverRobotEvent.onDisconnect();
  	});
});
//socket connect end