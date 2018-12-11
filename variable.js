var astar = require('./astar');

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

global.mapXLength = 14;
global.mapYLength = 10;

//---graphInit---
global.map = new Array(mapXLength);
for(var i = 0; i < mapXLength; i++){
	map[i] = Array(mapYLength).fill(1);
}
global.graph = new astar.Graph(map);
//