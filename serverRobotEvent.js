var server = require('./app');
var routeMethod = require('./routeMethod');

exports.onConnection = function(io){
	console.log("connect connectCount : " + io.engine.clientsCount);
}

exports.onSetAddress = function(data){
	point[data.index] = {
		x : data.nowX,
		y : data.nowY,
		id : data.id
	};
	routeMethod.useNumberPlate(data.index, data.previousX, data.previousY);
	io.emit('draw',{ point : point, nextPoint : nextPoint });
}

exports.onSignUp = function(data, socket){
	point.push(
		{
			x : data.nowX,
			y : data.nowY,
			id : data.id
		}
	);
	var index = routeMethod.findIndex(data.id, socket);
	changeRoute[index] = {
		changeRouteStatus : false,
		id : data.id
	};
	robotStatus[index] = {
		crowded : false,
		stopOver : false,
		numberPlateIsNotPreferred : false
	};
	stopCount[index] = 0;
	io.emit('draw',{ point : point, nextPoint : nextPoint });
	socket.emit('returnIndex', { index : index });
}

exports.onStart = function(data, socket){
	endPoint[data.index] = {
		x : data.gotoX,
		y : data.gotoY,
		id : data.id
	};
	routeMethod.findRoute(data.nowX, data.nowY, data.gotoX, data.gotoY, data.id, data.index);
	routeMethod.next(data.id, data.index, socket);
}

exports.onWalk = function(data, socket){
	if(point[data.index].x == route[data.index].routePoint[0].x && point[data.index].y == route[data.index].routePoint[0].y){
		route[data.index].routePoint.shift();
	}
		routeMethod.next(data.id, data.index, socket);
	if(!data.isStop){
		stepCount[data.index]++;
	}
}

exports.onXXXXX = function(data){
	for(let i = 0; i < point.length; i++){
		if(data.id == point[i].id){
			io.emit('returnEndPoint', { endPoint : endPoint[i] });
		}
	}
}

exports.onAllAutoStart = function(){
	io.emit('autoStart');
}

exports.onDisconnect = function(){
	console.log("disconnect connectCount : " + io.engine.clientsCount)
}