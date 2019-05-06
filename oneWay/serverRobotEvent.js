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
    if(position == 'left'){
        for(let i = mapYLength - 1; i >= 0; --i){
            if(cargoByPosition[i].length > 0){
                gotoList[0] = mapXLength - 1;;
                gotoList[1] = i; //前往有貨物的位置
                return gotoList;
            } 
        }
    } else {
        for(let i = 0; i < mapYLength - 1; ++i){
            if(cargoByPosition[i].length > 0){
                gotoList[0] = 0;
                gotoList[1] = i; //前往有貨物的位置
                return gotoList;
            } 
        }
    }
    return null;
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
    //若此位置沒有貨物，則隨機一個位置去尋找有沒有貨物
    else {
        if(position == 'left'){
            for(let i = data.nowY + 1; i < mapYLength; ++i){
                if(cargoByPosition[i].length > 0){
                    gotoList[0] = 0;
                    gotoList[1] = i; //前往有貨物的位置
                    return gotoList;
                } 
            }
        } else {
            for(let i = data.nowY - 1; i >= 0; --i){
                if(cargoByPosition[i].length > 0){
                    gotoList[0] = mapXLength - 1;
                    gotoList[1] = i; //前往有貨物的位置
                    return gotoList;
                } 
            }
        }
      	return findOtherSideCargp(data, position);
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

exports.onSignUp = function(data, socket){
    point.push(
        {
            x : data.nowX,
            y : data.nowY,
            id : data.id
        }
    );
    var index = routeMethod.findIndex(data.id, socket);
    routeMethod.signUpdrawNumberPlate(index);
    changeRoute[index] = {
        changeRouteStatus : false,
        id : data.id
    };
    robotStatus[index] = {
        crowded : false,
        stopOver : false,
        numberPlateIsNotPreferred : false
    };
    stepCount[index] = 0;
    stopCount[index] = 0;
    io.emit('draw',{ point : point, nextPoint : nextPoint });
    socket.emit('returnIndex', { index : index });
}

exports.onStart = function(data, socket){
    if(data.gotoY < mapYLength){
        routeMethod.findRoute(data.nowX, data.nowY, data.gotoX, data.gotoY, data.id, data.index);
        endPoint[data.index] = {
            x : data.gotoX,
            y : data.gotoY,
            id : data.id
        };
        io.emit('changeEndPoint',
            {
                endPoint : endPoint[data.index]
            }
        );
    } else if(data.gotoY == mapYLength){
        routeMethod.findRestRoute(data.nowX, data.nowY, data.id, data.index);
    }
    routeMethod.next(data.id, data.index, socket);
}

exports.onGetCargoEndPoint = function(data, socket){
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
    }
    routeMethod.next(data.id, data.index, socket);
    if(!data.isStop){
        ++stepCount[data.index];
    }
}

exports.onAllAutoStart = function(){
	io.emit('autoStart');
	startTime = new Date();
    console.time("runTime");
}

exports.onDisconnect = function(){
	console.log("disconnect connectCount : " + io.engine.clientsCount)
}