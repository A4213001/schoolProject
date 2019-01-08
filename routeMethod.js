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
  判斷前方是否有障礙物
  params index robot的index
  		 direction 前進方向
  return 是否有障礙物
*/
function haveBarrier(index, direction){
	var b = {
		x : 0,
		y : 0
	};
	switch(direction){
		case 'up' : b.y = -1; break;
		case 'down' : b.y = 1; break;
		case 'left' : b.x = -1; break;
		case 'right' : b.x = 1; break;
		default: console.log("haveBarrier function direction error"); return false;
	}
	for(let i = 0; i < point.length; i++){
		if(point[index].x + b.x == point[i].x && point[index].y + b.y == point[i].y){
			return true;
		}
	}
	return false;
}

/*
  抽號碼牌
  params index robot的index
  return 無
  會將抽出的號碼牌存進numberPlate Array中
*/
function drawNumberPlate(index, step){
	var exist = false;
	if(step == 1){
		//已抽過號碼牌不再抽取
		for(let i = 0; i < numberPlate.length; i++){
			if(pointEqual(numberPlate[i], route[index].routePoint[0]) && numberPlate[i].index == index){
				exist = true;
			}
		}
		if(!exist){
			numberPlate.push(
				{
					x : route[index].routePoint[0].x,
					y : route[index].routePoint[0].y,
					index : index
				}
			);
		}
	} else if(step == 2 && route[index].routePoint.length > 1){
		//已抽過號碼牌不再抽取
		for(let i = 0; i < numberPlate.length; i++){
			if(pointEqual(numberPlate[i], route[index].routePoint[1]) && numberPlate[i].index == index){
				exist = true;
			}
		}
		if(!exist){
			numberPlate.push(
				{
					x : route[index].routePoint[1].x,
					y : route[index].routePoint[1].y,
					index : index
				}
			);
		}
	} 
};

/*
  重新尋找路徑(因原路徑上有區域賭塞 or 停止次數>5)
  params nowX 當前X座標
         nowY 當前Y座標
         gotoX 目的地X座標
         gotoY 目的地Y座標
         index robot的index
         lock 賭塞的區域(將此區域鎖住後來尋找路徑)
  return 無
  會將尋找好的路徑存進route Array中
*/
function reFindRoute(nowX, nowY, gotoX, gotoY, index, lock) {
	var graphLine;
	if(gotoX == 0){
		graphLine = _.cloneDeep(variable.gotoLeftGraph);
	} else if(gotoX == mapXLength - 1){
		graphLine = _.cloneDeep(variable.gotoRightGraph);
	} else {
		graphLine = _.cloneDeep(variable.fullGraph);
	}
	for(let i = 0; i < lock.length; i++){
		graphLine.grid[lock[i].x][lock[i].y] = 0;
	}
	io.emit("console",{graph : graphLine});
	var start = graphLine.grid[nowX][nowY];
	var end = graphLine.grid[gotoX][gotoY];
	var result = astar.astar.search(graphLine, start, end);
	var routePoint = [];
	result.forEach(function(element) {
		routePoint.push(
			{
				x : element.x,
				y : element.y
			}
		);
	});
	if(routePoint.length > 0){
		route[index].routePoint = routePoint;
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
  預先碰撞處理，繞路方法
  params index robot的index
  首先會判斷是否自己前方是否有對向來車，若有的話將其中一方繞路
*/
function collision(index){
	for(let i = 0; i < route.length; i++){
		if(i != index){
			//判斷對撞
			if(route[i] != null && point[index].x == route[i].routePoint[0].x && point[index].y == route[i].routePoint[0].y && point[i].x == route[index].routePoint[0].x && point[i].y == route[index].routePoint[0].y && (point[index].x < 4 || point[index].x >= mapXLength - 5)){
				//上下準備對撞時，判斷上邊的robot位置，位置在前2行或倒數第3、4行，往右方繞路
				if(point[index].x == route[index].routePoint[0].x && point[index].x <= 1 && point[index].y < point[i].y || point[index].x == route[index].routePoint[0].x && (point[index].x == mapXLength - 3 || point[index].x == mapXLength - 4) && point[index].y < point[i].y){
					//判斷上方robot的右方是否有障礙物
					if(!haveBarrier(index, 'right')){
						changeRoute[index] = true;
						throwNumberPlate(index, point[index].x, point[index].y);
						if(route[index].routePoint.length > 1 && route[index].routePoint[1].x == point[index].x + 1 && route[index].routePoint[1].y == point[index].y + 1){
							route[index].routePoint.shift();
						} else {
							route[index].routePoint.unshift(
								{
									x : point[index].x + 1,
									y : point[index].y + 1
								}
							)
						}
						// 00 01 11 原本路徑
						// 00 10 11 01 11正常變更
						// 00 10 11 新的變更
						route[index].routePoint.unshift(
							{
								x : point[index].x + 1,
								y : point[index].y
							}
						);
					//若上邊robot的右方有阻礙，則由下方robot往右方繞路
					} else {
						changeRoute[i] = true;
						throwNumberPlate(i, point[i].x, point[i].y);
						if(route[i].routePoint.length > 1 && route[i].routePoint[1].x == point[i].x + 1 && route[i].routePoint[1].y == point[i].y - 1){
							route[i].routePoint.shift();
						} else {
							route[i].routePoint.unshift(
								{
									x : point[i].x + 1,
									y : point[i].y - 1
								}
							)
						}
						route[i].routePoint.unshift(
							{
								x : point[i].x + 1,
								y : point[i].y
							}
						);
					}
				}
				//上下準備對撞時，判斷下邊的robot位置，位置在第3、4行或倒數前2行，往左方繞路
				else if(point[index].x == route[index].routePoint[0].x && (point[index].x == 2 || point[index].x == 3) && point[index].y > point[i].y || point[index].x == route[index].routePoint[0].x && point[index].x >= mapXLength - 2 && point[index].y > point[i].y){
					if(!haveBarrier(index, 'left')){
						changeRoute[index] = true;
						throwNumberPlate(index, point[index].x, point[index].y);
						if(route[index].routePoint.length > 1 && route[index].routePoint[1].x == point[index].x - 1 && route[index].routePoint[1].y == point[index].y - 1){
							route[index].routePoint.shift();
						} else {
							route[index].routePoint.unshift(
								{
									x : point[index].x - 1,
									y : point[index].y - 1
								}
							)
						}
						route[index].routePoint.unshift(
							{
								x : point[index].x - 1,
								y : point[index].y
							}
						);
					//若下方robot的左方有阻礙，則由上方robot往左方繞路
					} else {
						changeRoute[i] = true;
						throwNumberPlate(i, point[i].x, point[i].y);
						if(route[i].routePoint.length > 1 && route[i].routePoint[1].x == point[i].x - 1 && route[i].routePoint[1].y == point[i].y + 1){
							route[i].routePoint.shift();
						} else {
							route[i].routePoint.unshift(
								{
									x : point[i].x - 1,
									y : point[i].y + 1
								}
							)
						}
						route[i].routePoint.unshift(
							{
								x : point[i].x - 1,
								y : point[i].y
							}
						);
					}
				}
				//左右準備對撞時，判斷左邊的robot位置，位置在前2列時，往下方繞路
				else if(point[index].y == route[index].routePoint[0].y && point[index].y <= 1 && point[index].x < point[i].x){
					changeRoute[index] = true;
					throwNumberPlate(index, point[index].x, point[index].y);
					if(route[index].routePoint.length > 1 && route[index].routePoint[1].x == point[index].x + 1 && route[index].routePoint[1].y == point[index].y + 1){
						route[index].routePoint.shift();
					} else {
						route[index].routePoint.unshift(
							{
								x : point[index].x + 1,
								y : point[index].y + 1
							}
						)
					}
					route[index].routePoint.unshift(
						{
							x : point[index].x,
							y : point[index].y + 1
						}
					);
				}
				//左右準備對撞時，判斷右邊的robot位置，位置在後2列時，往上方繞路
				else if(point[index].y == route[index].routePoint[0].y && point[index].y >= 2 && point[index].x > point[i].x){
					changeRoute[index] = true;
					throwNumberPlate(index, point[index].x, point[index].y);
					if(route[index].routePoint.length > 1 && route[index].routePoint[1].x == point[index].x - 1 && route[index].routePoint[1].y == point[index].y - 1){
						route[index].routePoint.shift();
					} else {
						route[index].routePoint.unshift(
							{
								x : point[index].x - 1,
								y : point[index].y - 1
							}
						)
					}
					route[index].routePoint.unshift(
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

/*
  判斷前方區域是否壅擠
  params index robot的index
  		 lock 禁止通行的區域(傳入時為空)
  return 前方2*3區域車子數量
*/
function frontAreaCount(index, lock){
	var count = 0;
	var frontAreaX = point[index].x;//用於計算觀看前方區域X
	var frontAreaY = point[index].y;//用於計算觀看前方區域Y
	switch(direction[index]){
		//向下前進時
		case "down":
			//當位置不在最左或最右，且下方還>=2格
			if(frontAreaX > 0 && frontAreaX < mapXLength - 1 && frontAreaY < mapYLength - 2){
				for(let i = frontAreaX - 1; i <= frontAreaX + 1; i++){
					for(let j = frontAreaY + 1; j <= frontAreaY + 2; j++){
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
			//當位置在最左時，且下方還>=2格
			else if(frontAreaX == 0 && frontAreaY < mapYLength - 2){
				for(let i = frontAreaX; i <= frontAreaX + 1; i++){
					for(let j = frontAreaY + 1; j <= frontAreaY + 2; j++){
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
			//當位置在最右時，且下方還>=2格
			else if(frontAreaX == mapXLength - 1 && frontAreaY < mapYLength - 2){
				for(let i = frontAreaX; i >= frontAreaX - 1; i--){
					for(let j = frontAreaY + 1; j <= frontAreaY + 2; j++){
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
			//當位置不在最左或最右時，且上方還>=2格
			if(frontAreaX > 0 && frontAreaX < mapXLength - 1 && frontAreaY > 1){
				for(let i = frontAreaX - 1; i <= frontAreaX + 1; i++){
					for(let j = frontAreaY - 1; j >= frontAreaY - 2; j--){
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
			//當位置在最左時，且上方還>=2格
			else if(frontAreaX == 0 && frontAreaY > 1){
				for(let i = frontAreaX; i <= frontAreaX + 1; i++){
					for(let j = frontAreaY - 1; j >= frontAreaY - 2; j--){
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
			//當位置在最右時，且上方還>=2格
			else if(frontAreaX == mapXLength - 1 && frontAreaY > 1){
				for(let i = frontAreaX; i >= frontAreaX - 1; i--){
					for(let j = frontAreaY - 1; j >= frontAreaY - 2; j--){
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
			//當位置不在最上或最下時，且左方還>=2格
			if(frontAreaX > 1 && frontAreaY > 0 && frontAreaY < mapYLength - 1){
				for(let i = frontAreaX - 1; i >= frontAreaX - 2; i--){
					for(let j = frontAreaY - 1; j <= frontAreaY + 1; j++){
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
			//當位置在最上時，且左方還>=2格
			else if(frontAreaX > 1 && frontAreaY == 0){
				for(let i = frontAreaX - 1; i >= frontAreaX - 2; i--){
					for(let j = frontAreaY; j <= frontAreaY + 1; j++){
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
			//當位置在最下時，且左方還>=2格
			else if(frontAreaX > 1 && frontAreaY == mapYLength - 1){
				for(let i = frontAreaX - 1; i >= frontAreaX - 2; i--){
					for(let j = frontAreaY; j >= frontAreaY - 1; j--){
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
			//當位置不在最上或最下時，且右方還>=2格
			if(frontAreaX < mapXLength - 2 && frontAreaY > 0 && frontAreaY < mapYLength - 1){
				for(let i = frontAreaX + 1; i <= frontAreaX + 2; i++){
					for(let j = frontAreaY - 1; j <= frontAreaY + 1; j++){
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
			//當位置在最上時，且右方還>=2格
			else if(frontAreaX < mapXLength - 2 && frontAreaY == 0){
				for(let i = frontAreaX + 1; i <= frontAreaX + 2; i++){
					for(let j = frontAreaY; j <= frontAreaY + 1; j++){
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
			//當位置在最下時，且右方還>=2格
			else if(frontAreaX < mapXLength - 2 && frontAreaY == mapYLength - 1){
				for(let i = frontAreaX + 1; i <= frontAreaX + 2; i++){
					for(let j = frontAreaY; j >= frontAreaY - 1; j--){
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
	return count;
}

/*
  停止次數過多，重新尋找路徑
  params index robot的index
*/
function stopOverReFindRoute(index){
	var lock = [];
	for(let i = 0; i < point.length; i++){
		if(stopCount[i] > 5 && i != index){
			lock.push(
				{
					x : point[i].x,
					y : point[i].y
				}
			)
		}
	}
	throwNumberPlate(index, point[index].x, point[index].y);
	reFindRoute(point[index].x, point[index].y, route[index].routePoint[route[index].routePoint.length - 1].x, route[index].routePoint[route[index].routePoint.length - 1].y, index, lock);
}

/*
  前方擁擠，重新尋找路徑
  params index robot的index
  return 是否停留
*/
function crowdedReFindRoute(index, lock){
	//若不在單行道則進行避開擁擠區的重新規劃路徑
	if(point[index].x < 4 && point[index].x >= mapXLength - 4){
		throwNumberPlate(index, point[index].x, point[index].y);
		reFindRoute(point[index].x, point[index].y, route[index].routePoint[route[index].routePoint.length - 1].x, route[index].routePoint[route[index].routePoint.length - 1].y, index, lock)
		return false
	}
	//若即將離開單行道時發現前方壅擠，則在原地等待
	else if ((direction[index] == 'left' && point[index].x == 4) || (direction[index] == 'right' && point[index].x == mapXLength - 5)){
		throwNumberPlate(index, point[index].x, point[index].y);
		robotStatus[index].crowded = true;//前方擁擠
		return true;
	}
	//若在單行道上則繼續前進
	else {
		return false;
	}
}

/*
  檢查號碼牌優先權
  params index robot的index
  return 號碼牌是否優先
*/
function checkNumberPlate(index, step){
	if(step == 1){
		for(let i = 0; i < numberPlate.length; i++){
			if(route[index].routePoint[0].x == numberPlate[i].x && route[index].routePoint[0].y == numberPlate[i].y){
				if(numberPlate[i].index != index){
					return false;
					robotStatus[index].numberPlateIsNotPreferred = true; //號碼牌不優先
				} else {
					return true;
				}
			}
		}
	} else if(step == 2 && route[index].routePoint.length > 1){
		for(let i = 0; i < numberPlate.length; i++){
			if(route[index].routePoint[1].x == numberPlate[i].x && route[index].routePoint[1].y == numberPlate[i].y){
				if(numberPlate[i].index != index){
					return false;
					robotStatus[index].numberPlateIsNotPreferred = true; //號碼牌不優先
				} else {
					return true;
				}
			}
		}
	} else {
		return false;
	}
}

function getCmd(index, step){
	var next;
	if(step == 1){
		next = {
			x : route[index].routePoint[0].x - point[index].x,
			y : route[index].routePoint[0].y - point[index].y	
		};
	} else if(step == 2 && route[index].routePoint.length > 1){
		next = {
			x : route[index].routePoint[1].x - route[index].routePoint[0].x,
			y : route[index].routePoint[1].y - route[index].routePoint[0].y	
		};
	} else {
		next = {
			x : 0,
			y : 0
		};
	}
	if(next.x == 1){
		return "+x";
	} else if(next.x == -1){
		return "-x"
	} else if(next.y == 1){
		return "+y";
	} else if(next.y == -1){
		return "-y";
	} else {
		return "stop";
	}
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
	var routeIndex = 0;
	var mapY;
	if(nowX == 0){
		if(nowY <= gotoY){
			mapY = gotoY;
			if(gotoY % 2 == 0){
				mapY++;
			}
			for(let i = nowY + 1; i <= mapY; i++){
				routePoint[routeIndex++] = {
					x : 0,
					y : i
				};
			}
			for(let i = 1; i < mapXLength; i++){
				routePoint[routeIndex++] = {
					x : i,
					y : mapY
				};
			}
			for(let i = mapY - 1; i >= gotoY; i--){
				routePoint[routeIndex++] = {
					x : mapXLength - 1,
					y : i
				};
			}
		} else if(nowY > gotoY){
			mapY = nowY;
			if(nowY % 2 == 0){
				mapY++;
				routePoint[routeIndex++] = {
					x : 0,
					y : mapY
				};
			}
			for(let i = 1; i < mapXLength; i++){
				routePoint[routeIndex++] = {
					x : i,
					y : mapY
				};
			}
			for(let i = mapY - 1; i >= gotoY; i--){
				routePoint[routeIndex++] = {
					x : mapXLength - 1,
					y : i
				};
			}
		}
	} else if(nowX == mapXLength - 1){
		if(nowY >= gotoY){
			mapY = gotoY;
			if(gotoY % 2 == 1){
				mapY--;
			}
			for(let i = nowY - 1; i >= mapY; i--){
				routePoint[routeIndex++] = {
					x : mapXLength - 1,
					y : i
				};
			}
			for(let i = mapXLength - 2; i >= 0; i--){
				routePoint[routeIndex++] = {
					x : i,
					y : mapY
				};
			}
			for(let i = mapY + 1; i <= gotoY; i++){
				routePoint[routeIndex++] = {
					x : 0,
					y : i
				};
			}
		} else if(nowY < gotoY){
			mapY = nowY;
			if(nowY % 2 == 1){
				mapY--;
				routePoint[routeIndex++] = {
					x : mapXLength - 1,
					y : mapY
				};
			}
			for(let i = mapXLength - 2; i >= 0; i--){
				routePoint[routeIndex++] = {
					x : i,
					y : mapY
				};
			}
			for(let i = mapY + 1; i <= gotoY; i++){
				routePoint[routeIndex++] = {
					x : 0,
					y : i
				};
			}
		}
	}
	route[index] = {
		id : robotId,
		routePoint : routePoint
	};
};

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
			if(numberPlate[i].index == index && numberPlate[i].x == x && numberPlate[i].y == y){
				numberPlate.splice(i, 1);
			}
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
exports.next = function(robotId, index, socket, time) {
	var stop = false;
	var step1, step2;
	var returnTwoCmd = false;

	var count = 0;
	var lock = [];
	direction[index] = trunWhere(index);
	
	if(!stop){
		step1 = getCmd(index, 1);
		step2 = getCmd(index, 2);
		if(step1 == step2 && step1 != "stop"){
			drawNumberPlate(index, 1);
			if(!checkNumberPlate(index, 1)){
				stop = true;
			} else {
				drawNumberPlate(index, 2);
				if(checkNumberPlate(index, 2)){
					returnTwoCmd = true;
				}
			}
		} else if(step1 != "stop"){
			drawNumberPlate(index, 1);
			if(!checkNumberPlate(index, 1)){
				stop = true;
			}
		} else {
			stop = true;
		}
	}

	if(stop){
		socket.emit('go',
	    	{
	    		cmd : ["stop"],
	    		time : time
	    	}
	    );
		stopCount[index]++;
	} else {
		stopCount[index] = 0;
		if(returnTwoCmd){
			socket.emit('go',
		    	{
		    		cmd : [step1, step2],
	    			time : time
		    	}
		    );
		    io.emit('draw',{ point : point, nextPoint : nextPoint });
		} else {
			socket.emit('go',
		    	{
		    		cmd : [step1],
	    			time : time
		    	}
		    );
		    io.emit('draw',{ point : point, nextPoint : nextPoint });
		}
	    nextPoint[index] = {
	    	x : route[index].routePoint[0].x,
	    	y : route[index].routePoint[0].y,
	    	id : robotId
	    };
	}
};