var astar = require('./astar');
var fs = require('fs');

global.robotCount = 0; //機器人數量
global.point = []; //當前位置
global.nextPoint = []; //下個位置
global.route = []; //預定路線
global.endPoint = []; //終點位置
global.direction = []; //前進方向
global.numberPlate = []; //號碼牌
global.stepCount = []; //步數
global.changeRoute = []; //更換路徑
global.stopCount = []; //停止次數
global.robotStatus = []; //robot狀態
global.cargo = JSON.parse(fs.readFileSync("cargo.json"));

global.mapXLength = 14;
global.mapYLength = 11;

//---graphInit---
global.map = new Array(mapXLength);
for(var i = 0; i < mapXLength; i++){
	map[i] = Array(mapYLength).fill(1);
}

//前往右側的地圖
global.gotoRightGraph = new astar.Graph(map);
for(let i = 4; i < mapXLength - 5; i++){
	for(let j = 1; j < mapYLength - 1; j+=2){
		gotoRightGraph.grid[i][j].weight = 0;
	}
}
for(let i = 0 ; i < mapXLength; i++){
	gotoRightGraph.grid[i][mapYLength - 1].weight = 0;
}

//前往左側的地圖
global.gotoLeftGraph = new astar.Graph(map);
for(let i = 4; i < mapXLength - 5; i++){
	for(let j = 0; j < mapYLength - 1; j+=2){
		gotoLeftGraph.grid[i][j].weight = 0;
	}
}
for(let i = 0 ; i < mapXLength; i++){
	gotoLeftGraph.grid[i][mapYLength - 1].weight = 0;
}

//前往休息站的地圖
global.gotoRestGraph = new astar.Graph(map);
for(let i = 4; i < mapXLength - 5; i++){
	for(let j = 1; j < mapYLength - 1; j+=2){
		gotoRestGraph.grid[i][j].weight = 0;
	}
}
//