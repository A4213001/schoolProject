var server = require('./app');
var routeMethod = require('./routeMethod');

exports.onSetAddress = function(data){
	point[data.index] = {
		x : data.nowX,
		y : data.nowY,
		id : data.id
	};
	routeMethod.useNumberPlate(data.index, data.previousX, data.previousY);
	io.emit('draw',{ point : point, nextPoint : nextPoint });
}

exports.onStart = function(data, socket){
	if (io.sockets.connected[socket.id]) {
  		var exist = false; //此robot是否存在於當前point Array
  		for(let i = 0; i < point.length; i++){
  			if(point[i].id == data.id){
  	  			point[i] = {
  	  				x : data.nowX,
  	  				y : data.nowY,
  	  				id : data.id
  	  			};
  	 			exist = true;
  	  			break;
  			}
  		}
  		//當robot不存在時，新增資料進point Array
  		if(!exist){
  			robotCount++;
  			point.push(
  				{
  					x : data.nowX,
  					y : data.nowY,
  					id : data.id
  				}
  			);
  			changeRoute.push(
	  			{
	  				changeRouteStatus : false,
	  				id : data.id
	  			}
	  		);
	  		robotStatus.push(
	  			{
	  				crowded : false,
	  				stopOver : false,
	  				numberPlateIsNotPreferred : false
	  			}
	  		)
	  		stopCount.push(0);	
  		}
  		io.emit('draw',{ point : point, nextPoint : nextPoint });
  		var index = routeMethod.findIndex(data.id, socket);
  		endPoint[index] = {
				x : data.gotoX,
				y : data.gotoY,
				id : data.id
			}
			if(isNaN(stepCount[index])){
				stepCount[index] = 0
			}
  		routeMethod.findRoute(data.nowX, data.nowY, data.gotoX, data.gotoY, data.id, index);
  		routeMethod.next(data.id, index, socket);
	}
}

exports.onWalk = function(data, socket){
	if(point[data.index].x == route[data.index].routePoint[0].x && point[data.index].y == route[data.index].routePoint[0].y){
		route[data.index].routePoint.shift();
		routeMethod.next(data.id, data.index, socket);
	}
	else{
		routeMethod.next(data.id, data.index, socket);
	}
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