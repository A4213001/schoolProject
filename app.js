var astar = require('./astar');
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sizeof = require('object-sizeof');
var extend = require('jquery-extend');

server.listen(80);
console.log('Server running at port 80');

app.use(express.static('views'));

// ---varInit---
var point = new Array(); //當前位置
var nextPoint = new Array(); //下個位置
var route = new Array(); //預定路線
var endPoint = new Array(); //終點位置
var direction = new Array(); //前進方向
var number_plate = new Array(); //號碼牌
var mapLength = 10;
//

//---graphInit---
var x = new Array(mapLength);
for(var i = 0; i < mapLength; i++)
	x[i] = Array(mapLength).fill(1);
var graph = new astar.Graph(x);
//

//---function---
function point_equal(point1, point2){
	if(point1.x == point2.x && point1.y == point2.y){
		return true;
	} else {
		return false;
	}
}

function find_index(robot_ID, socket){
	for(let i = 0; i < point.length; i++){
		if(robot_ID == point[i].id){
			socket.emit('return_index', { index : i });
			return i;
		}
	}
};

function find_route(now_X, now_Y, goto_X, goto_Y, robot_ID, index) {
	// io.emit("console",{graph : graph});
	var graphLine = new astar.Graph(x);
	if(goto_X == 0){
		for(let i = 1; i < mapLength - 1; i++){
			if(i >= 3 && i <= mapLength - 4){
				for(let j = 0; j < mapLength; j+=2)
					graphLine.grid[i][j].weight = 0;
			}
		}
	}
	if(goto_X == mapLength - 1){
		for(let i = 1; i < mapLength - 1; i++){
			if(i >= 3 && i <= mapLength - 4){
				for(let j = 1; j < mapLength; j+=2)
					graphLine.grid[i][j].weight = 0;
			}
		}
	}
	io.emit("console",{graph : graphLine});
	var start = graphLine.grid[now_X][now_Y];
	var end = graphLine.grid[goto_X][goto_Y];
	var result = astar.astar.search(graphLine, start, end);
	var route_point = new Array();
	result.forEach(function(element) {
		route_point.push(
			{
				x : element.x,
				y : element.y
			}
		);
	});
	var valid = true;
	for(let i = 0 ; i < route.length; i++){
	  	if(route[i].id == robot_ID){
	  	    route[i].route_point = route_point;
	  	    valid = false;
	  	    break;
	  	}
	}
	if(valid){
	  	route.push(
	  		{
	  			id : robot_ID,
	  			route_point : route_point
	  		}
	  	);
	}
};

function re_find_route(now_X, now_Y, goto_X, goto_Y, index, lock) {
	var graphLine = new astar.Graph(x);
	if(goto_X == 0){
		for(let i = 1; i < mapLength - 1; i++){
			if(i >= 3 && i <= mapLength - 4){
				for(let j = 0; j < mapLength; j+=2)
					graphLine.grid[i][j].weight = 0;
			}
		}
	}
	if(goto_X == mapLength - 1){
		for(let i = 1; i < mapLength - 1; i++){
			if(i >= 3 && i <= mapLength - 4){
				for(let j = 1; j < mapLength; j+=2)
					graphLine.grid[i][j].weight = 0;
			}
		}
	}
	for(let i = 0; i < lock.length; i++){
		graphLine.grid[lock[i].x][lock[i].y] = 0;
	}
	io.emit("console",{graph : graphLine});
	var start = graphLine.grid[now_X][now_Y];
	var end = graphLine.grid[goto_X][goto_Y];
	var result = astar.astar.search(graphLine, start, end);
	var route_point = new Array();
	result.forEach(function(element) {
		route_point.push(
			{
				x : element.x,
				y : element.y
			}
		);
	});
	if(route_point.length > 0){
		route[index].route_point = route_point;
	}
};

function drawNumberPlate(index){
	var vaild = true;
	//已抽過號碼牌不再抽取
	for(let i = 0; i < number_plate.length; i++){
		if(point_equal(number_plate[i], route[index].route_point[0]) && number_plate[i].index == index){
			vaild = false;
		}
	}
	if(vaild){
		number_plate.push(
			{
				x : route[index].route_point[0].x,
				y : route[index].route_point[0].y,
				index : index
			}
		);
	}
};

function useNumberPlate(index, x, y){
	if(point[index].x != x || point[index].y != y){
		for(let i = 0; i < number_plate.length; i++){
			if(number_plate[i].index == index && number_plate[i].x == x && number_plate[i].y == y)
				number_plate.splice(i, 1);
		}
	}
}

function throwNumberPlate(index, x, y){
	for(let i = 0; i < number_plate.length; i++){
		if(number_plate[i].index == index && number_plate[i].x == x && number_plate[i].y == y){
			number_plate.splice(i, 1);
		}
	}
}

function trunWhere(index){
	if(point[index].x == route[index].route_point[0].x){
		if(point[index].y - route[index].route_point[0].y == 0)
			return "stop";
		return point[index].y - route[index].route_point[0].y > 0 ? "up" : "down";
	}
	else if(point[index].y == route[index].route_point[0].y){
		return point[index].x - route[index].route_point[0].x > 0 ? "left" : "right";
	}
}

function next(robot_ID, index, socket) {
	if(robot_ID == 0){
		// console.log(number_plate);
	}
	var stop = false;
	var count = 0;
	var lock = new Array();
	xe = point[index].x;
	ye = point[index].y;
	switch(trunWhere(index)){
		//向下前進時
		case "down":
			direction[index] = 'down';
			//當位置不在最左或最右，且下方還>=3格
			if(xe > 0 && xe < mapLength - 1 && ye < mapLength - 3){
				for(let i = xe - 1; i <= xe + 1; i++){
					for(let j = ye + 1; j <= ye + 3; j++){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			//當位置在最左時，且下方還>=3格
			else if(xe == 0 && ye < mapLength - 3){
				for(let i = xe; i <= xe + 1; i++){
					for(let j = ye + 1; j <= ye + 3; j++){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			//當位置在最右時，且下方還>=3格
			else if(xe == mapLength - 1 && ye < mapLength - 3){
				for(let i = xe; i >= xe - 1; i--){
					for(let j = ye + 1; j <= ye + 3; j++){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			break;

		//向上前進時
		case "up":
			direction[index] = 'up';
			//當位置不在最左或最右時，且上方還>=3格
			if(xe > 0 && xe < mapLength - 1 && ye > 2){
				for(let i = xe - 1; i <= xe + 1; i++){
					for(let j = ye - 1; j >= ye - 3; j--){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			//當位置在最左時，且上方還>=3格
			else if(xe == 0 && ye > 2){
				for(let i = xe; i <= xe + 1; i++){
					for(let j = ye - 1; j >= ye - 3; j--){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			//當位置在最右時，且上方還>=3格
			else if(xe == mapLength - 1 && ye > 2){
				for(let i = xe; i >= xe - 1; i--){
					for(let j = ye - 1; j >= ye - 3; j--){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			break;

		//向左前進時
		case "left":
			direction[index] = 'left';
			//當位置不在最上或最下時，且左方還>=3格
			if(xe > 2 && ye > 0 && ye < mapLength - 1){
				for(let i = xe - 1; i >= xe - 3; i--){
					for(let j = ye - 1; j <= ye + 1; j++){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			//當位置在最左時，且上方還>=3格
			else if(xe > 2 && ye == 0){
				for(let i = xe - 1; i >= xe - 3; i--){
					for(let j = ye; j <= ye + 1; j++){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			//當位置在最右時，且上方還>=3格
			else if(xe > 2 && ye < mapLength - 1){
				for(let i = xe - 1; i >= xe - 3; i--){
					for(let j = ye; j >= ye - 1; j--){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			break;

		//向右前進時
		case "right":
			direction[index] = 'right';
			//當位置不在最上或最下時，且右方還>=3格
			if(xe < mapLength - 3 && ye > 0 && ye < mapLength - 1){
				for(let i = xe + 1; i <= xe + 3; i++){
					for(let j = ye - 1; j <= ye + 1; j++){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			//當位置在最上時，且右方還>=3格
			else if(xe < mapLength - 3 && ye == 0){
				for(let i = xe + 1; i <= xe + 3; i++){
					for(let j = ye; j <= ye + 1; j++){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			//當位置在最下時，且右方還>=3格
			else if(xe < mapLength - 3 && ye == mapLength - 1){
				for(let i = xe + 1; i <= xe + 3; i++){
					for(let j = ye; j >= ye - 1; j--){
						lock.push(
							{
								x : i,
								y : j
							}
						);
						for(let z = 0; z < point.length; z++){
							if(point[z].x == i && point[z].y == j){
								count++;
							}
						}
					}
				}
			}
			break;

		default: break;
	}
	console.log(direction);
	if(count > 2){
		throwNumberPlate(index, route[index].route_point[0].x, route[index].route_point[0].y);
		re_find_route(point[index].x, point[index].y, route[index].route_point[route[index].route_point.length - 1].x, route[index].route_point[route[index].route_point.length - 1].y, index, lock)
		stop = true;
	}
	if(!stop){
		for(let i = 0; i < point.length; i++){
			if(i != index){
				//判斷對撞
				if(point[index].x == route[i].route_point[0].x && point[index].y == route[i].route_point[0].y && point[i].x == route[index].route_point[0].x && point[i].y == route[index].route_point[0].y){
					throwNumberPlate(index, route[index].route_point[0].x, route[index].route_point[0].y);
					//上下準備對撞時，判斷上邊的robot位置，位置在前2行或倒數第3行，往右方繞路
					if(point[index].x == route[index].route_point[0].x && point[index].x <= 1 && point[index].y < point[i].y || point[index].x == route[index].route_point[0].x && point[index].x == mapLength - 3 && point[index].y < point[i].y){
						var barrier = false;
						for(let j = 0; j < point.length; j++){
							if(point[index].x + 1 == point[j].x && point[index].y + 1 == point[j].y){
								barrier = true;
							}
						}
						if(!barrier){
							if(route[index].route_point.length > 1 && route[index].route_point[1].x == point[index].x + 1 && route[index].route_point[1].y == point[index].y + 1){
								route[index].route_point.shift();
							} else {
								route[index].route_point.unshift(
									{
										x : point[index].x + 1,
										y : point[index].y + 1
									}
								)
							}
							// 00 01 11 原本路徑
							// 00 10 11 01 11正常變更
							// 00 10 11 新的變更
							route[index].route_point.unshift(
								{
									x : point[index].x + 1,
									y : point[index].y
								}
							);
						//若上邊robot的右方有阻礙，則由下方robot往右方繞路
						} else {
							if(route[i].route_point.length > 1 && route[i].route_point[1].x == point[i].x + 1 && route[i].route_point[1].y == point[i].y + 1){
								route[i].route_point.shift();
							} else {
								route[i].route_point.unshift(
									{
										x : point[i].x + 1,
										y : point[i].y + 1
									}
								)
							}
							route[i].route_point.unshift(
								{
									x : point[i].x + 1,
									y : point[i].y
								}
							);
						}
					}
					//上下準備對撞時，判斷下邊的robot位置，位置在第3行或倒數前2行，往左方繞路
					else if(point[index].x == route[index].route_point[0].x && point[index].x == 2 && point[index].y > point[i].y || point[index].x == route[index].route_point[0].x && point[index].x >= mapLength - 2 && point[index].y > point[i].y){
						if(route[index].route_point.length > 1 && route[index].route_point[1].x == point[index].x - 1 && route[index].route_point[1].y == point[index].y - 1){
							route[index].route_point.shift();
						} else {
							route[index].route_point.unshift(
								{
									x : point[index].x - 1,
									y : point[index].y - 1
								}
							)
						}
						route[index].route_point.unshift(
							{
								x : point[index].x - 1,
								y : point[index].y
							}
						);
					}
					//左右準備對撞時，判斷左邊的robot位置，位置在前5列時，往下方繞路
					else if(point[index].y == route[index].route_point[0].y && point[index].y <= 4 && point[index].x < point[i].x){
						if(route[index].route_point.length > 1 && route[index].route_point[1].x == point[index].x + 1 && route[index].route_point[1].y == point[index].y + 1){
							route[index].route_point.shift();
						} else {
							route[index].route_point.unshift(
								{
									x : point[index].x + 1,
									y : point[index].y + 1
								}
							)
						}
						route[index].route_point.unshift(
							{
								x : point[index].x,
								y : point[index].y + 1
							}
						);
					}
					//左右準備對撞時，判斷右邊的robot位置，位置在後5列時，往上方繞路
					else if(point[index].y == route[index].route_point[0].y && point[index].y >= 5 && point[index].x > point[i].x){
						if(route[index].route_point.length > 1 && route[index].route_point[1].x == point[index].x - 1 && route[index].route_point[1].y == point[index].y - 1){
							route[index].route_point.shift();
						} else {
							route[index].route_point.unshift(
								{
									x : point[index].x - 1,
									y : point[index].y - 1
								}
							)
						}
						route[index].route_point.unshift(
							{
								x : point[index].x,
								y : point[index].y - 1
							}
						);
					}
				}
			}
		}
	}
	if(!stop){
		drawNumberPlate(index);
		for(let i = 0; i < number_plate.length; i++){
			if(route[index].route_point[0].x == number_plate[i].x && route[index].route_point[0].y == number_plate[i].y){
				if(number_plate[i].index != index){
					stop = true;
				}
				break;
			}
		}
	}
	if(stop){
		socket.emit('stop');
	}
	else{
	    socket.emit('go',
	    	{
	    		x : route[index].route_point[0].x,
	    		y : route[index].route_point[0].y
	    	}
	    );
	    nextPoint[index] = {
	    	x : route[index].route_point[0].x,
	    	y : route[index].route_point[0].y,
	    	id : robot_ID
	    };
	    io.emit('draw',{ point : point, nextPoint : nextPoint });
	}
};
//

//webroute start
app.get('/', function (req, res) {
    res.render('test.ejs');
});

app.get('/line', function (req, res) {
    res.render('line.ejs');
});

app.get('/home', function (req, res) {
    res.render('home.ejs');
});
//webroute end

//socket connect start
io.on('connection', function (socket) {
    console.log("connect connectCount : " + io.engine.clientsCount);

    //connectionEvent setADDress
    socket.on('setAddress', function (data){
		point[data.index] = {
			x : data.now_x,
			y : data.now_y,
			id : data.id
		};
		useNumberPlate(data.index, data.previous_x, data.previous_y);
  		io.emit('draw',{ point : point, nextPoint : nextPoint });
  	});

    //connectionEvent start
  	socket.on('start', function (data) {
  		if (io.sockets.connected[socket.id]) {
	  		var valid = true;
	  		for(let i = 0; i < point.length ; i++){
	  			if(point[i].id == data.id){
	  	  			point[i] = {
	  	  				x : data.now_x,
	  	  				y : data.now_y,
	  	  				id : data.id
	  	  			};
	  	 			valid = false;
	  	  			break;
	  			}
	  		}
	  		if(valid){
	  			point.push(
	  				{
	  					x : data.now_x,
	  					y : data.now_y,
	  					id : data.id
	  				}
	  			);
	  		}
	  		io.emit('draw',{ point : point, nextPoint : nextPoint });
	  		var index = find_index(data.id, socket);
	  		endPoint[index] = {
  				x : data.goto_x,
  				y : data.goto_y,
  				id : data.id
  			}
	  		find_route(data.now_x, data.now_y, data.goto_x, data.goto_y, data.id, index);
	  		next(data.id, index, socket);
  		}
  	});

  	//connectionEvent walk
  	socket.on('walk', function (data) {
		if(point[data.index].x == route[data.index].route_point[0].x && point[data.index].y == route[data.index].route_point[0].y){
			route[data.index].route_point.shift();
			next(data.id, data.index, socket);
		}
		else
			next(data.id, data.index, socket);
  	});

  	socket.on('disconnect', function() { console.log("disconnect connectCount : " + io.engine.clientsCount) });
});
//socket connect end
