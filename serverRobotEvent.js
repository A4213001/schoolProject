var server = require('./app');

exports.onSetAddress = function(data){
	point[data.index] = {
		x : data.now_x,
		y : data.now_y,
		id : data.id
	};
	server.useNumberPlate(data.index, data.previous_x, data.previous_y);
	io.emit('draw',{ point : point, nextPoint : nextPoint });
}

exports.onStart = function(data, socket){
	if (io.sockets.connected[socket.id]) {
  		var exist = false; //此robot是否存在於當前point Array
  		for(let i = 0; i < point.length; i++){
  			if(point[i].id == data.id){
  	  			point[i] = {
  	  				x : data.now_x,
  	  				y : data.now_y,
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
  					x : data.now_x,
  					y : data.now_y,
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
	  				stopCountExceed4 : false,
	  				numberPlateIsNotPreferred : false
	  			}
	  		)
	  		stopCount.push(0);	
  		}
  		io.emit('draw',{ point : point, nextPoint : nextPoint });
  		var index = server.find_index(data.id, socket);
  		endPoint[index] = {
				x : data.goto_x,
				y : data.goto_y,
				id : data.id
			}
			if(isNaN(stepCount[index])){
				stepCount[index] = 0
			}
  		server.find_route(data.now_x, data.now_y, data.goto_x, data.goto_y, data.id, index);
  		server.next(data.id, index, socket);
	}
}

exports.onWalk = function(data, socket){
	if(point[data.index].x == route[data.index].route_point[0].x && point[data.index].y == route[data.index].route_point[0].y){
		route[data.index].route_point.shift();
		server.next(data.id, data.index, socket);
	}
	else{
		server.next(data.id, data.index, socket);
	}
	if(!data.isStop){
		stepCount[data.index]++;
	}
}

exports.onXXXXX = function(data){
	for(let i = 0; i < point.length; i++){
		if(data.id == point[i].id){
			io.emit('return_endPoint', { endPoint : endPoint[i] });
		}
	}
}

exports.onAllAutoStart = function(){
	io.emit('autoStart');
}

exports.onDisconnect = function(){
	console.log("disconnect connectCount : " + io.engine.clientsCount)
}