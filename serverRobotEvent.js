var server = require('./app');
var routeMethod = require('./routeMethod');

function findOtherSideCargp(data, position){
    var gotoList = [0, 0];
	var cargoByPosition;
  	if(position == 'left'){
	    cargoByPosition = cargo.right;
  	} else if(position == 'right'){
	    cargoByPosition = cargo.left;
  	} else {
	    return null;
  	}
  	//如果此位置還有貨物，直接取得此位置的座標
	if(cargoByPosition[data.nowY].length > 0){
    	gotoList[0] = (position == 'left') ? mapXLength - 1 : 0;
	  	gotoList[1] = data.nowY;
	  	return gotoList;
    } 
    //若此位置沒有貨物，則去附近尋找貨物
    else {
        var offset = 1; //相鄰格數
    	var turn = 1; //上方或下方
	 	var times = 0; //迴圈執行次數
    	var cargoIndex; //貨物位置
    	var rnd = Math.floor(Math.random() * 2);
    	for(let i = 0; i < mapYLength ; i++){
        	if(i % 2 == rnd){
        		cargoIndex = i / 2;
        	} else {
        		cargoIndex = mapYLength - 1 - (i / 2);
        	}
		    if(cargoByPosition[cargoIndex].length > 0){
    		    gotoList[0] = (position == 'left') ? mapXLength - 1 : 0;
    		    gotoList[1] = cargoIndex; //前往有貨物的位置
    		    return gotoList;
      		}
      	}
    }
}

function findCargo(data, position){
	var gotoList = [0, 0];
	var cargoByPosition;
	if(position == 'left'){
		cargoByPosition = cargo.left;
	} else if(position == 'right'){
		cargoByPosition = cargo.right;
	} else {
		return null;
	}
	//如果此位置還有貨物，直接取得此貨物的終點座標
    if(cargoByPosition[data.nowY].length > 0){
    	gotoList[0] = (position == 'left') ? mapXLength - 1 : 0;
    	gotoList[1] = cargoByPosition[data.nowY][0];
    	return gotoList;
    } 
    //若此位置沒有貨物，則去從外往內尋找貨物
    else {
    	var offset = 1; //相鄰格數
    	var turn = 1; //上方或下方
    	var times = 0; //迴圈執行次數
    	var cargoIndex; //貨物位置
    	var rnd = Math.floor(Math.random() * 2);
    	for(let i = 0; i < mapYLength ; i++){
        	if(i % 2 == rnd){
        		cargoIndex = Math.floor(i / 2);
        	} else {
        		cargoIndex = mapYLength - 1 - Math.floor(i / 2);
        	}
		    if(cargoByPosition[cargoIndex].length > 0){
    		    gotoList[0] = (position == 'left') ? 0 : mapXLength - 1;
    		    gotoList[1] = cargoIndex; //前往有貨物的位置
    		    return gotoList;
      		}
      	}
    }
}

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
        if(data.gotoY < mapYLength){
  	      	routeMethod.findRoute(data.nowX, data.nowY, data.gotoX, data.gotoY, data.id, index);
  		} else if(data.gotoY == mapYLength){
          	routeMethod.findRestRoute(data.nowX, data.nowY, data.id, index);
      	}
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

exports.ongetCargoEndPoint = function(data, socket){
    console.log(cargo);
  	var success = true;
  	var gotoList;
  	if(data.nowX == 0){
		gotoList = findCargo(data, 'left');
	} else if(data.nowX == mapXLength - 1){
        gotoList = findCargo(data, 'right');
	} else {
	    gotoList = null;
	}
  	if(gotoList != null){
        if(data.nowX == 0){
      	    cargo.left[data.nowY].shift();
    	} else {
            cargo.right[data.nowY].shift();
    	}
    	socket.emit('returnCargoEndPoint',
      	    {
        		gotoX : gotoList[0],
    		    gotoY : gotoList[1]
      		}
    	)
  	} else {
        socket.emit('returnCargoEndPoint',
            {
                gotoX : 0,
                gotoY : mapYLength
            }
        )
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
	startTime = new Date();
}

exports.onDisconnect = function(){
	console.log("disconnect connectCount : " + io.engine.clientsCount)
}