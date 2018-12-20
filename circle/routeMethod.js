var astar = require('./astar');
var variable = require('./variable');
var _ = require('lodash');

/*
  位置相等判斷
  params point1 座標1
         point2 座標2
  return 是否相等
*/
function pointEqual(point1, point2){
	if(point1.x == point2.x && point1.y == point2.y){
		return true;
	} else {
		return false;
	}
}

/*
  抽號碼牌
  params index robot的index
  return 無
  會將抽出的號碼牌存進numberPlate Array中
*/
function drawNumberPlate(index){
	var exist = true;
	//已抽過號碼牌不再抽取
	for(let i = 0; i < numberPlate.length; i++){
		if(pointEqual(numberPlate[i], route[index].routePoint[0]) && numberPlate[i].index == index){
			exist = false;
		}
	}
	if(exist){
		numberPlate.push(
			{
				x : route[index].routePoint[0].x,
				y : route[index].routePoint[0].y,
				index : index
			}
		);
	}
};

/*
  丟棄當前位置以外的號碼牌(因路徑轉換而或前方壅擠)
  params index robot的index
  		 x 當前X座標
  		 y 當前Y座標
  return 無
  會將丟棄的號碼牌從numberPlate Array中移除
*/
function throwNumberPlate(index, x, y){
	for(let i = 0; i < numberPlate.length; i++){
		if(numberPlate[i].index == index && (numberPlate[i].x != x || numberPlate[i].y != y)){
			numberPlate.splice(i, 1);
		}
	}
}

/*
  丟棄所有號碼牌(因重新規畫路徑)
  params index robot的index
  		 x 此號碼牌的X座標
  		 y 此號碼牌的Y座標
  return 無
  會將丟棄的號碼牌從numberPlate Array中移除
*/
function throwAllNumberPlate(index){
	for(let i = 0; i < numberPlate.length; i++){
		if(numberPlate[i].index == index){
			numberPlate.splice(i, 1);
		}
	}
}

/*
  判斷robot前進方向
  params index robot的index
  return 前進方向
*/
function trunWhere(index){
	var xChange = route[index].routePoint[0].x - point[index].x;
	var yChange = route[index].routePoint[0].y - point[index].y;
	if(xChange == 1){
		return "right";
	} else if(xChange == -1){
		return "left";
	} else if(yChange == 1){
		return "down";
	} else if(yChange == -1){
		return "up";
	} else {
		return "stop";
	}
}

/*
  檢查號碼牌優先權
  params index robot的index
  return 號碼牌是否優先
*/
function checkNumberPlate(index){
	var valid = true;
	for(let i = 0; i < numberPlate.length; i++){
		if(route[index].routePoint[0].x == numberPlate[i].x && route[index].routePoint[0].y == numberPlate[i].y){
			if(numberPlate[i].index != index){
				valid = false;
				robotStatus[index].numberPlateIsNotPreferred = true; //號碼牌不優先
			}
			break;
		}
	}
	return valid;
}

/*
  尋找robot index
  params robotId robot編號
         socket socket連線(用於發送returnIndex事件)
  return index
*/
exports.findIndex = function(robotId, socket){
	for(let i = 0; i < point.length; i++){
		if(robotId == point[i].id){
			return i;
		}
	}
};

/*
  尋找路徑
  params nowX 當前X座標
         nowY 當前Y座標
         gotoX 目的地X座標
         gotoY 目的地Y座標
         robotId robot編號
         index robot的index
  return 無
  會將尋找好的路徑存進route Array中
*/
exports.findRoute = function(nowX, nowY, gotoX, gotoY, robotId, index) {
	var routePoint = [];
	if(nowX == 0){
		for(let i = nowY + 1; i < mapYLength; i++){
			routePoint.push(
				{
					x : 0,
					y : i		
				}
			)
		}
		for(let i = 1; i < mapXLength; i++){
			routePoint.push(
				{
					x : i,
					y : mapYLength - 1
				}
			)
		}
		for(let i = mapYLength - 2; i >= gotoY; i--){
			routePoint.push(
				{
					x : mapXLength - 1,
					y : i
				}
			)
		}
	} else if(nowX == mapXLength - 1){
		for(let i = nowY - 1; i >= 0; i--){
			routePoint.push(
				{
					x : mapXLength - 1,
					y : i		
				}
			)
		}
		for(let i = mapXLength - 2; i >= 0; i--){
			routePoint.push(
				{
					x : i,
					y : 0
				}
			)
		}
		for(let i = 1; i <= gotoY; i++){
			routePoint.push(
				{
					x : 0,
					y : i
				}
			)
		}
	}
	route[index] = {
		id : robotId,
		routePoint : routePoint
	};
};

/*
  尋找前往休息站路徑
  params nowX 當前X座標
         nowY 當前Y座標
         robotId robot編號
         index robot的index
  return 無
  會將尋找好的路徑存進route Array中
*/
exports.findRestRoute = function(nowX, nowY, robotId, index){
	var gotoX, gotoY = mapYLength;
	for(let i = mapXLength - 1; i >= 0; i--){
		if(!restStation[i]){
			restStation[i] = true;
			gotoX = i;
			if(i < 5){
				console.log(startTime + " " + (new Date()));
				console.log(totalStopCount);
				console.log(stepCount);
				console.log(changeDirectionCount);
			}
			break;
		}
	}
	endPoint[index] = {
        x : gotoX,
        y : gotoY,
        id : robotId
    };
	var routePoint = [];
	if(nowX == 0){
		for(let i = nowY + 1; i < mapYLength; i++){
			routePoint.push(
				{
					x : 0,
					y : i		
				}
			)
		}
		for(let i = 1; i <= gotoX; i++){
			routePoint.push(
				{
					x : i,
					y : mapYLength - 1
				}
			)
		}
		routePoint.push(
			{
				x : gotoX,
				y : mapYLength
			}
		)
	} else if(nowX == mapXLength - 1){
		for(let i = nowY - 1; i >= 0; i--){
			routePoint.push(
				{
					x : mapXLength - 1,
					y : i		
				}
			)
		}
		for(let i = mapXLength - 2; i >= 0; i--){
			routePoint.push(
				{
					x : i,
					y : 0
				}
			)
		}
		for(let i = 1; i < mapYLength; i++){
			routePoint.push(
				{
					x : 0,
					y : i
				}
			)
		}
		for(let i = 1; i <= gotoX; i++){
			routePoint.push(
				{
					x : i,
					y : mapYLength - 1
				}
			)
		}
		routePoint.push(
			{
				x : gotoX,
				y : mapYLength
			}
		)
	}
	route[index] = {
		id : robotId,
		routePoint : routePoint
	};
}

/*
  註冊時抽號碼牌
  params index robot的index
  return 無
  會將抽出的號碼牌存進numberPlate Array中
*/
exports.signUpdrawNumberPlate = function(index){
	numberPlate.push(
		{
			x : point[index].x,
			y : point[index].y,
			index : index
		}
	);
}

/*
  使用號碼牌
  params index robot的index
  		 x 此號碼牌的X座標
  		 y 此號碼牌的Y座標
  return 無
  會將使用的號碼牌從numberPlate Array中移除
*/
exports.useNumberPlate = function(index, x, y){
	if(point[index].x != x || point[index].y != y){
		for(let i = 0; i < numberPlate.length; i++){
			if(numberPlate[i].index == index && numberPlate[i].x == x && numberPlate[i].y == y)
				numberPlate.splice(i, 1);
		}
	}
}

/*
  robot前進下一步
  params robotId robot編號
         index robot的index
         socket socket連線(用於發送事件)
  return 無
  判斷此robot是否需要停下、改道，若不需要就讓robot繼續前進
*/
exports.next = function(robotId, index, socket) {
	if(robotId == 0){
		// console.log(numberPlate);
		// console.log(direction);
		// console.log(stepCount);
	}
	var stop = false;

	var lastDirection = direction[index];
	direction[index] = trunWhere(index);
	if(lastDirection != direction[index]){
		changeDirectionCount++;
	}
	
	if(!stop){
		drawNumberPlate(index);
		if(!checkNumberPlate(index)){
			stop = true;
		}
	}

	if(stop){
		socket.emit('stop');
		stopCount[index]++;
		totalStopCount++;
	} else {
		stopCount[index] = 0;
		changeRoute[index].changeRouteStatus = false;
	    socket.emit('go',
	    	{
	    		x : route[index].routePoint[0].x,
	    		y : route[index].routePoint[0].y
	    	}
	    );
	    nextPoint[index] = {
	    	x : route[index].routePoint[0].x,
	    	y : route[index].routePoint[0].y,
	    	id : robotId
	    };
	    io.emit('draw',{ point : point, nextPoint : nextPoint });
	}
};